---
title: 'Contains and contained by lookups'
date: 2019-08-05T16:00:47+07:00
draft: false
toc: false
comments: true
description: >-
  In this post, I explain the containment lookups, i.e. contains and
  contained_by.
---

It's been quite a long time since my last post. Truth is, I've been busy
implementing the remaining lookups on all database backends and polishing the
`JSONField`. Now, the field is pretty much complete and I will try to explain
the implementation here. I'll probably split the explanation into multiple
posts if it becomes too long. In this post, I'll explain the containment
lookups, i.e. `contains` and `contained_by`.

The `contains` lookup for `JSONField` is different from the built-in `contains`
lookup. Instead of checking for a matching substring in the field's value, the
lookup is overridden to check whether field's value contain the specified JSON
path/value entries at the top level. To demonstrate:

```python
>>> Dog.objects.create(name='Rufus', data={'breed': 'labrador', 'owner': 'Bob'})
>>> Dog.objects.create(name='Meg', data={'breed': 'collie', 'owner': 'Bob'})
>>> Dog.objects.create(name='Fred', data={})

>>> Dog.objects.filter(data__contains={'owner': 'Bob'})
<QuerySet [<Dog: Rufus>, <Dog: Meg>]>

>>> Dog.objects.filter(data__contains={'breed': 'collie'})
<QuerySet [<Dog: Meg>]>
```

On PostgreSQL, it's implemented using the `@>` operator.

So, this lookup:

```python
Dog.objects.filter(data__contains={'breed': 'collie'})
```

becomes something like:

```sql
SELECT * FROM myapp_dog WHERE myapp_dog.data @> '{"breed": "collie"}'::jsonb
```

On MySQL and MariaDB, we can make use of the [`JSON_CONTAINS`] function. The
function takes three arguments: target JSON document, candidate(s), and path
(optional). Since we're only checking at the top level, we can omit the path or
specify it as `'$'` (the root of the JSON document). The documentation isn't
really clear what would happen if the path is omitted. It only says
"**candidate** JSON document is contained within a **target** JSON document".
It doesn't mention whether it searches deep into the target document or just
the top level. From what I briefly tested, it seems that it only searches at
the top level. However, let's just be explicit and specify the path as `'$'`.

The query becomes something like:

```sql
SELECT * FROM myapp_dog WHERE JSON_CONTAINS(myapp_dog.data, '{"breed": "collie"}', '$')
```

On Oracle Database and SQLite, there's no proper equivalent of `JSON_CONTAINS`.
So, we have to extract each value of the candidate and check if it also exists
in the target, chained with `AND`. Fun fact: I initially just skipped
implementing this lookup on both backends. After implementing the transforms
later, I realized this lookup can be implemented in this manner.

As always, things are unnecessarily more complex on Oracle Database. There is
no function to easily extract a value from a JSON document. We are given two
functions for this: [`JSON_QUERY`] and [`JSON_VALUE`]. The functions both
require two arguments: the JSON document, and the path we want to extract.

Here's what's ridiculous: `JSON_QUERY` returns a string that represents the
JSON **object** or **array** located at the path. If the path doesn't exist, it
returns SQL `NULL`. If the path exists and the value located at the path is a
JSON **scalar**, it **also returns `NULL`**. Meanwhile, `JSON_VALUE` does the
opposite: it returns SQL equivalent of the scalars and returns `NULL` for JSON
objects and arrays.

I don't really mind having these two functions **if** we have a combination of
the two. On MariaDB, it has `JSON_QUERY`, `JSON_VALUE`, and `JSON_EXTRACT`. You
guessed it: `JSON_EXTRACT` is the combination of the first two.

There's a way to get around this, though. We can use `COALESCE`. ~~However,
it's not really needed now because we can still identify which function to use
by looking at the right-hand-side of the lookup~~ (see update at the bottom of
this post). We will need to use `COALESCE` when we implement the transforms
later.

So, the query for the lookup should be something like:

```sql
SELECT * FROM myapp_dog WHERE JSON_VALUE(myapp_dog.data, '$.breed') = 'collie'
```

If the candidate contains more than one key-value pair, we can chain the
clauses using `AND`.

However, the problem doesn't end there. In this case, the candidate is just a
shallow JSON object. Let's say I have this JSON object:

```json
{
  "a1": {
    "a2": {
      "a3": "first"
    }
  },
  "b1": "second"
}
```

If I want to query using the following lookup:

```python
Dog.objects.filter(data__contains={'a1': {'a2': {'a3': 'first'}}})
```

For some reason, the following `WHERE` clause doesn't match any data:

```sql
WHERE JSON_QUERY(myapp_dog.data, '$.a1') = '{"a2": {"a3": "first"}}'
```

After some [fiddling] around, I altered it to look like this:

```sql
WHERE JSON_QUERY(myapp_dog.data, '$.a1') = JSON_QUERY('{"a2": {"a3": "first"}}', '$')
```

and it works. I don't know why that's the case, though. It probably has
something to do with `LOB` stuff, but I'm not very familiar with Oracle
Database so I'm not really sure if that's the case.

Also, if you noticed, the previous `$.breed = 'collie'` query didn't use
double-quote for the right-hand-side (RHS) string `'collie'` (instead of
`'"collie"'`) as Oracle automatically unquotes the string returned by
`JSON_VALUE`. This means that we'll have to do a `json.loads()` in the Python
code first.

Meanwhile, if the RHS is an integer or float, we shouldn't do a `json.loads()`
because the Oracle backend will throw an error.

What about boolean values?

That's a lot of unnecessary cases to handle. I'm not surprised if there's more
that I haven't caught.

Anyway, one trick I decided to use is to wrap the RHS with a dummy JSON object
and use `JSON_QUERY` or `JSON_VALUE`, depending on the RHS.

So, this lookup:

```python
Dog.objects.filter(data__contains={'a1': {'a2': {'a3': 'first'}}})
```

becomes:

```sql
SELECT * FROM myapp_dog WHERE JSON_QUERY(myapp_dog.data, '$.a1') = JSON_QUERY('{"val": {"a2": {"a3": "first"}}}', '$.val')
```

and this lookup:

```python
Dog.objects.filter(data__contains={'breed': 'collie'})
```

becomes:

```sql
SELECT * FROM myapp_dog WHERE JSON_VALUE(myapp_dog.data, '$.breed') = JSON_VALUE('{"val": "collie"', '$.val')
```

This way, I only have to differentiate whether the RHS is a scalar or not to
decide whether to use `JSON_QUERY` or `JSON_VALUE`. We'll still end up using
the JSON-encoded RHS for both types, so they don't differ much and we can just
chain multiple key-value pairs with `AND`.

Another case is performing the lookup with an empty dictionary (`{}`) as the
candidate. Basically, it means that the query should return any rows that are
JSON objects, as any JSON object can be thought of containing an empty JSON
object. Kind of like an empty set is a subset of any set.

On Oracle, we can only store valid JSON objects or arrays and not scalars.
However, there's no function to check whether the JSON type is an object or an
array. A trick I came up with is by using pattern-matching with the `'{%}'`
pattern. Basically, it means that the data "starts with `{` and ends with `}`",
which is what we need.

That's it, now (I think) the lookup is complete on Oracle.

On SQLite, things are also a bit tricky, but not so much. There's a
[`JSON_EXTRACT`] function, so we don't really have to worry about the
left-hand-side. However, as with Oracle, a JSON object or array RHS can't be
queried directly. I think it's because SQLite minifies the stored data. To get
around this, I just need to wrap the object or array RHS with [`JSON()`].

Meanwhile, for JSON `null` values, we have to use `JSON_TYPE` function to
differentiate it from SQL `NULL`, as I explained in the previous post. We can
also use the function to check for the empty dictionary case.

That's pretty much it for the SQLite implementation.

The next lookup is the `contained_by` lookup. I won't go into details here, as
it's basically the inverse of the `contains` lookup. On PostgreSQL, we just
need to use `<@` operator instead of `@>`. On MySQL and MariaDB, we just need
to flip the arguments of `JSON_CONTAINS`.

On Oracle and SQLite, though... it's impossible (I think)! There's no way to
check if the stored data in the database is completely contained in a Python
object and return the matching data in just a single query. We can do the
inverse by checking if all of the key-value pairs in the Python object also
exist in the database because if they do, then the stored data is a superset of
(or equal to) the Python object. Meanwhile, we cannot know what keys exist in
the stored data without querying for it first. So, I have to leave the lookup
unimplemented for these two backends.

Well, that's it for this post! Sorry if it's confusing, I don't really know how
to explain this stuff in a simpler way because it really is kind of complex.
The next post will be about key transforms, where things get even more ~~fun~~
complex <sup><sub>(or not? Heh, I don't know)</sub></sup>. Until then, bye!

**Update 1:** I realized I missed something for the Oracle implementation. If
the Python dictionary includes a key with `None` as its value, the resulting
part of the `WHERE` clause would be:

```sql
JSON_VALUE(myapp_dog.data, '$.somekey') = JSON_VALUE('{"val": null}', '$.val')
```

and that wouldn't work because it would be like `NULL = NULL`.

To check for an existing key with a `null` value, we need to use `JSON_EXISTS`
combined with `JSON_QUERY(...) IS NULL` and `JSON_VALUE(...) IS NULL`. So, the
correct `WHERE` clause is:

```sql
JSON_EXISTS(myapp_dog.data, '$.somekey') AND COALESCE(
    JSON_QUERY(myapp_dog.data, '$.somekey'), JSON_VALUE(myapp_dog.data, '$.somekey')
) IS NULL
```

Like I said, things are unnecessarily more complex on Oracle Database. On
SQLite, we can make use of the `JSON_TYPE` function which returns the string
`null` for JSON value `null` that exists at a given path. Well, turns out we
**do** need the `COALESCE` function, after all!

**Update 2:** Simon <sup><sub>(yes, <em>that</em> Simon)</sub></sup> [replied]
to my tweet, suggesting the use of a custom SQLite function to implement the
`contained_by` lookup. I decided to implement the function for `contains`
lookup and flip the arguments for `contained_by` lookup, kind of like how it's
done on MySQL.

The implementation of the lookups is very simple. The function takes two
arguments, the target and the candidate. We just need to `json.loads()` them
both. If they're both dictionaries, we can use the comparison operator `>=`
with the `.items()` of the dictionaries. Otherwise, just check if both objects
are equal. That's it!

[`json_contains`]: https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-contains
[`json_query`]: https://docs.oracle.com/database/121/ADXDB/json.htm#ADXDB6277
[`json_value`]: https://docs.oracle.com/database/121/ADXDB/json.htm#ADXDB6263
[fiddling]: https://dbfiddle.uk/?rdbms=oracle_18&fiddle=1406ec1d184af5446d8b6cfcb3823b0e
[`json_extract`]: https://www.sqlite.org/json1.html#jex
[`json()`]: https://www.sqlite.org/json1.html#jmini
[replied]: https://twitter.com/simonw/status/1159077881957371904
