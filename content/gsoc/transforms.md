---
title: 'Key, index, and path transforms'
date: 2019-08-15T06:58:54+07:00
draft: false
toc: false
comments: true
description: >-
  In this post, I explain how I implemented key, index, and path transforms
  to allow querying with JSON values.
---

It's time for one of the most ~~exciting~~ important parts: transforms! This is
probably one of the last few posts on this blog (at least for this year), since
GSoC 2019 is almost finished and I'm wrapping up my project soon. In this post,
I'll explain how I implemented key, index, and path transforms to allow
querying with JSON values. Actually, they aren't made into different
transforms, but a transform (called `KeyTransform`) that can be chained to form
a JSON path. Then, we can do a lookup with the value at that path.

The following is the demonstration from the docs.

To query based on a given dictionary key, simply use that key as the lookup
name:

```python
>>> Dog.objects.create(name='Rufus', data={
...     'breed': 'labrador',
...     'owner': {
...         'name': 'Bob',
...         'other_pets': [{
...             'name': 'Fishy',
...         }],
...     },
... })
>>> Dog.objects.create(name='Meg', data={'breed': 'collie', 'owner': None})

>>> Dog.objects.filter(data__breed='collie')
<QuerySet [<Dog: Meg>]>
```

Multiple keys can be chained together to form a path transform:

```python
>>> Dog.objects.filter(data__owner__name='Bob')
<QuerySet [<Dog: Rufus>]>
```

If the key is an integer, it will be interpreted as an index transform in an
array:

```python
>>> Dog.objects.filter(data__owner__other_pets__0__name='Fishy')
<QuerySet [<Dog: Rufus>]>
```

Note that the transform examples given above [implicitly] use the `exact`
lookup.

## PostgreSQL

On PostgreSQL, if only one key or index is used, the SQL operator `->` is used.
If multiple operators are used then the `#>` operator is used. For example, the
last lookup translates into the following SQL query:

```sql
SELECT * FROM myapp_dog WHERE (data #> ['owner', 'other_pets', '0', 'name']) = 'Fishy'
```

If the transform is chained with a lookup expecting a text lhs, the operators
used are `->>` and `#>>`, respectively.

## MySQL and MariaDB

On MySQL and MariaDB, we can make use of the [`JSON_EXTRACT`][json_extract mysql] function. The function accepts at least two arguments: the JSON document
and the path. However, instead of an array, the path is a [JSONPath] string.
So, the query becomes:

```sql
SELECT * FROM myapp_dog WHERE JSON_EXTRACT(data, '$.owner.other_pets[0].name') = '"Fishy"'
```

Except... things aren't that easy.

The `exact` lookup isn't always used with scalar right-hand-side value in
Python. We also want to be able to use dictionaries and lists, so we can do
something like:

```python
>>> Dog.objects.filter(data__owner__other_pets__0={'name': 'Fishy'})
<QuerySet [<Dog: Rufus>]>
```

For some reason, using just a JSON-encoded RHS doesn't always work. I've spent
a lot of time trying to get it right on both MySQL and MariaDB with many lookup
cases without making the code look too complex and confusing. I can't remember
all of the attempts I've tried.

In the end, I managed to do it by also wrapping the RHS with `JSON_EXTRACT`,
but with `'$'` (root) as the path. It's kind of like the trick I did on Oracle
in the previous post, except that I don't have to wrap it inside a JSON object
with the `"val"` key because MySQL and MariaDB support storing scalar JSON
values.

So now, the previous SQL query for the
`data__owner__other_pets__0__name='Fishy'` lookup becomes:

```sql
SELECT * FROM myapp_dog
WHERE JSON_EXTRACT(data, '$.owner.other_pets[0].name') =
JSON_EXTRACT('"Fishy"', '$')
```

However, on MariaDB, that conditional returns false. After some [fiddling], I
found that I have to wrap the RHS with [`JSON_UNQUOTE`] to yield a result. Now,
the query becomes like this (only if the RHS is a string):

```sql
SELECT * FROM myapp_dog
WHERE JSON_EXTRACT(data, '$.owner.other_pets[0].name') =
JSON_UNQUOTE(JSON_EXTRACT('"Fishy"', '$'))
```

Funnily, as you can see on the fiddle, the expression itself actually still
returns false (`0`). I have no idea why. ¯\\\_(ツ)\_/¯

If you think that I probably should also wrap the LHS with `JSON_UNQUOTE`,
well... I thought so, too. However, doing that will actually mess things up if
the value returned by `JSON_EXTRACT` is a JSON object or array, because it
seems that `JSON_UNQUOTE` will convert it into a normal string. I'm not
entirely sure if that's the case, but I ran the tests and some queries failed
to retrieve what they're supposed to. So, I ended up doing this only for
lookups that expect a text LHS (and the above case with MariaDB). Conveniently,
the existing PostgreSQL implementation also does something similar by having a
mixin called `KeyTransformTextLookupMixin`.

That's just for `exact` lookup. Thankfully, other lookups that can be applied
to a `KeyTransform` only expect scalar values. By unquoting the extracted JSON
value on MySQL and MariaDB, lookups that expect text LHS like `contains` (the
original one), `startswith`, and `endswith` can be implemented just by
inheriting the mixin and the lookups.

However, there's another problem. For some reason, `LIKE` operator on MySQL
doesn't really _like_ <sup><sub>(heh)</sub></sup> JSON strings. Look at [this
fiddle] for illustration. On MariaDB, the `LIKE` operator at least works
correctly for case-insensitive matching when `JSON_UNQUOTE` is applied. Try
switching into MySQL with the same fiddle and you can see that it's not the
_case_ <sup><sub>(heh)</sub></sup>.

In order for case-insensitive matching to work, we have to convert both side to
lowercase (or uppercase). This can easily be done by creating another mixin,
let's call it `CaseInsensitiveMixin`, and wrapping the LHS and RHS with
`LOWER()` in its `process_lhs` and `process_rhs` methods.

For numeric lookups (i.e. `lt`, `lte`, `gt`, `gte`), I decided to create
another mixin called `KeyTransformNumericLookupMixin`. The original PostgreSQL
implementation didn't have this mixin and just leave the lookups to the
superclass. I'm not really sure how, but it just works. Even the RHS is still a
JSON-encoded numeric value, which means we pass it as a string to `psycopg2`.

For all other backends, we just need to do `json.loads` on the RHS to decode it
into numerical values (`int`, `float`). Oh, and obviously, we don't wrap the
LHS with `JSON_UNQUOTE` in the mixin to avoid converting the LHS to string. On
Oracle database, we need to wrap the LHS with `TO_NUMBER` to convert the LHS to
numeric.

One thing I don't really get is how MariaDB can correctly do numeric
comparisons with values retrieved by `JSON_EXTRACT`, but it can't do ordering
by numeric JSON values retrieved by `JSON_EXTRACT`. Instead, it orders the data
by the string representation of the numeric values. Oh, well...

Fun fact: while writing this post, I realized I made a mistake and used
`KeyTransformTextLookupMixin` on numeric lookups as well. I hadn't even created
the `KeyTransformNumericLookupMixin`. The tests still passed because the test
data were too simple and comparing the string representation of the numeric
values would yield the same result as if we're comparing the actual numbers.
For example, `4 < 7` and `'4' < '7'` are both true. I've fixed the tests and
the implementation, so it should work correctly now.

That's pretty much it for the transforms on MySQL and MariaDB. Oh, and you
might have read from [somewhere] that MySQL also has the `->` and `->>`
operator to extract JSON values like on PostgreSQL. The `->` operator is
actually a shorthand for `JSON_EXTRACT()` and the `->>` operator is a shorthand
for `JSON_UNQUOTE(JSON_EXTRACT())`. However, MariaDB hasn't got those two
operators yet, so I decided not to use it to avoid diverging the code too much
between the two.

## Oracle

On Oracle Database, it's pretty much the same except that instead of using
`JSON_EXTRACT`, we use [`JSON_QUERY`] and [`JSON_VALUE`]. As I explained in my
[previous post], `JSON_QUERY` is used to retrieve JSON objects and arrays,
while `JSON_VALUE` is used to retrieve JSON scalar values. However, since a
transform is only used to, well, **transform** the LHS (correct me if I'm wrong
here), we cannot know whether we should use `JSON_QUERY` or `JSON_VALUE`. In
the end, I decided to make use of the [`COALESCE`] function to combine the two.

For the `exact` lookup, as I also explained in my previous post, it's much
easier to wrap the RHS with a dummy JSON object and call `JSON_QUERY` or
`JSON_VALUE` on that object. We also do that here.

So, the `data__owner__other_pets__0__name='Fishy'` lookup translates into:

```sql
SELECT * FROM myapp_dog
WHERE COALESCE(
    JSON_QUERY(data, '$.owner.other_pets[0].name'),
    JSON_VALUE(data, '$.owner.other_pets[0].name')
) = JSON_VALUE('{"val": "Fishy"}', '$.val')
```

I _could_ simplify the LHS so that it only use either `JSON_QUERY` or
`JSON_VALUE`, but that can only be determined by checking the RHS. I think it
wouldn't make sense to do that in `process_lhs` method.

After that's done, we just need to fix some things. First, we need to fix
`exact` lookup if the RHS is `None`, which means that the path exists but the
value is JSON `null`. Both `JSON_QUERY` and `JSON_VALUE` returns SQL `NULL` if
the value at the path is JSON `null`. Which is also the case if the path
doesn't exist. So, what do we do?

Thankfully, [`JSON_EXISTS`] _exists_ <sup><sub>(heh)</sub></sup> on Oracle.
Therefore, we can define the `WHERE` clause as something like:

```
JSON_EXISTS(...) AND COALESCE(JSON_QUERY(...), JSON_VALUE(...)) IS NULL
```

Which basically reads, "the path exists, but the value is null", and that's
exactly what we want.

Next, we need to fix `isnull` lookup. If the RHS is `False`, there's no problem
as we can just use `JSON_EXISTS`. However, if the RHS is `True`, `NOT JSON_EXISTS` only returns true if the JSON path doesn't exist **and the data is
not empty**. We need to fix the condition so it also returns true when the data
is empty. So, we need to append the condition with `OR JSON_QUERY(column_name, '$') IS NULL`.

Finally, we need to fix numeric lookups. It's simple as we just need to wrap
the LHS with [`TO_NUMBER`] to cast it into a, well... number.

## SQLite

I have to hand it to SQLite: the JSON1 extension works so much better than I
expected. As in MySQL, there's also a [`JSON_EXTRACT`][json_extract sqlite] on
SQLite. However, it **automatically** unquotes JSON strings. Also, we don't
need to wrap the RHS with a JSON function whatsoever. **It just works**.

So, the `data__owner__other_pets__0__name='Fishy'` lookup translates into:

```sql
SELECT * FROM myapp_dog WHERE JSON_EXTRACT(data, '$.owner.other_pets[0].name') = 'Fishy'
```

We just need to fix `exact` lookup if the RHS is `None` and `isnull` lookup so
that it uses the [`JSON_TYPE`] function to determine JSON `null` value and
missing keys, which I have explained a few times before. Other than that, we're
good to go!

And, that's it! We have (pretty much) completed all the lookups and transforms
for `JSONField`. In the next few posts, I'll probably explain how I found a
[vulnerability] in `contrib.postgres.fields.JSONField` and do some recaps to
wrap everything up. Until then, see you!

[implicitly]: https://docs.djangoproject.com/en/2.2/howto/custom-lookups/#how-django-determines-the-lookups-and-transforms-which-are-used
[json_extract mysql]: https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#function_json-extract
[jsonpath]: https://goessner.net/articles/JsonPath
[fiddling]: https://dbfiddle.uk/?rdbms=mariadb_10.4&fiddle=4f51807848265fb19098b2cfed1cb2f3
[`json_unquote`]: https://mariadb.com/kb/en/library/json_unquote
[this fiddle]: https://dbfiddle.uk/?rdbms=mariadb_10.4&fiddle=8549eb86195ea9fdd8eb903a0e8c5f6f
[somewhere]: https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html#operator_json-column-path
[`json_query`]: https://docs.oracle.com/database/121/SQLRF/functions091.htm#SQLRF56718
[`json_value`]: https://docs.oracle.com/database/121/SQLRF/functions093.htm#SQLRF56668
[previous post]: /gsoc/containment
[`coalesce`]: https://docs.oracle.com/cd/B28359_01/server.111/b28286/functions023.htm#SQLRF00617
[`json_exists`]: https://docs.oracle.com/en/database/oracle/oracle-database/12.2/adjsn/condition-JSON_EXISTS.html
[`to_number`]: https://docs.oracle.com/cd/E11882_01/server.112/e41084/functions211.htm#SQLRF06140
[json_extract sqlite]: https://www.sqlite.org/json1.html#jex
[`json_type`]: https://www.sqlite.org/json1.html#jtype
[vulnerability]: https://www.djangoproject.com/weblog/2019/aug/01/security-releases/#s-cve-2019-14234-sql-injection-possibility-in-key-and-index-lookups-for-jsonfield-hstorefield
