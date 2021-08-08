---
title: 'Revisions'
date: 2019-08-26T10:08:29+07:00
draft: false
toc: false
comments: true
description: >-
  In this post, I explain how I found a vulnerability in
  contrib.postgres.fields.JSONField that allowed SQL injections to be
  performed.
---

Mistakes happen, and that's part of a learning process. In a large project like
Django, it can be hard to spot a mistake. Thanks to it being open source,
anyone can see the code and fix the mistakes they see. In this post, I'll
explain how I found a vulnerability in `contrib.postgres.fields.JSONField` that
allowed SQL injections to be performed.

If you're familiar with Python's [DB-API], you may have used the [`.execute()`]
method. It's a method that can be used to prepare and execute a database
operation (query or command). Parameters can be passed into the method and will
be bound to the variables in the operation.

In general, the parameters should be separated from the operation string. That
means instead of formatting the parameters directly into the string, we should
use a placeholder specified by the [`paramstyle`]. This is to avoid SQL
injection attacks that exploit the quotation marks around values. The Django
[docs] give a quick explanation regarding this.

So, instead of doing something like the following:

```python
>>> query = 'SELECT * FROM myapp_dog WHERE name = %s' % name
>>> connection.cursor.execute(query)
```

or the following:

```python
>>> query = "SELECT * FROM myapp_dog WHERE name = '%s'"
```

We should do:

```python
>>> query = 'SELECT * FROM myapp_dog WHERE name = %s'
>>> connection.cursor.execute(query, [name])
```

On Django, this process is very crucial in the implementation of lookups and
transforms. In fact, Django breaks it down into `process_lhs` and `process_rhs`
methods to process the query string and the parameters of the left-hand-side
(LHS) and right-hand-side (RHS) of a query's `WHERE` clause. There's a
[section] on Django docs that explains this. It doesn't really go in depth, but
it should give you the gist of what's happening under the hood. That's where I
spent most of my time working on this project, but I don't think I can explain
it any clearer than the docs. You just need to read the docs and get your hands
dirty with some hands-on if you really want to understand.

While working on the [`KeyTransform`], I noticed [something off] in the
`as_sql()` method. As you can see there, if there isn't more than one key
transform applied and the string raises `ValueError` when casted into `int`,
the code incorrectly **quotes** the `key_name` and **formats** the lookup
**directly** into the string. Basically, it does exactly the two things I
explained above that shouldn't be done. So, I tried to find a way to exploit
this behavior.

As explained before, we need to exploit the quotation marks. Normally, the
following lookup:

```python
>>> query = Dog.objects.filter(data__breed='labrador')
```

gets translated into the following SQL query:

```sql
SELECT * FROM myapp_dog WHERE (data -> 'breed') = 'labrador'
```

We need to come up with a special string for the `KeyTransform` on the `data`
`JSONField`. So, the string that follows `data__` should be special such that
it meets the following conditions:

- It raises a `ValueError` when casted into `int`. This is easy, just make sure
  it's not an index lookup (`data__1`, `data__42`, etc. don't meet this
  condition).
- It only counts as one `KeyTransform`: it can't contain double underscore
  (`__`) that's followed by a string that's not registered as a lookup. So,
  something like `data__breed`, `data__breed__startswith`, or
  `data__breed__contains` meet the condition, but `data__owner__name` doesn't.
- It should escape the quotation mark and contain another condition that
  evaluates to true. So, it should contain something like `OR 1=1`. This should
  be... "impossible".

Keyword arguments must be valid identifiers, therefore we can't include a quote
nor a space. We [can't] do something like:

```python
>>> query = Dog.objecs.filter(data__breed' something OR 1=1 something'='labrador')
```

as that would obviously raise a `SyntaxError`.

However...

We _can_ pass `kwargs` using a dictionary. Any string is a valid key in a
dictionary.

So, it's possible to do this:

```python
>>> kwargs = {"data__breed' = 'a') OR 1 = 1 OR ('d": 'x'}
>>> query = Dog.objects.filter(**kwargs)
```

Which will be translated into the following SQL query:

```sql
SELECT * FROM myapp_dog WHERE (data -> 'breed' = 'a') OR 1 = 1 OR ('d') = '"x"'
```

As you expect, the query will return **all** `Dog` objects because the
condition `1 = 1` is always true.

In order for all this to happen in real life, someone had to use
`contrib.postgres.JSONField` and provide a way for users to construct their own
key-value pair that will be made into a dictionary and passed as `kwargs` in
the query. It is unlikely, but it's possible. We can never be too careful when
it comes to security. Besides, it's best practice to pass values using
parameters when we're using DB-API anyway.

I contacted the Django security team (`security@djangoproject.com`) and they
were pretty quick to respond. One and a half week later, security releases were
[issued] which included a [fix] for the vulnerability. I'm very proud to see my
name on it. Yay!

However, it turns out that the fix wasn't perfect. It spawned a bug that's
split into two tickets ([one] because it's a regression, the [other]'s not).
The regression happened because the fix was based on the code that handles
nested `KeyTransform` and that code already had the bug. The usage of
`KeyTransform` that's affected by this bug is actually undocumented, though.

The fixes ([single] and [nested]) were quite simple. The parameters were in the
wrong order, so the fixes were just to flip them. Funnily, I already did so
when I implemented `KeyTransform` for other database backends. It didn't mean
that the undocumented usage was already working out of the box, though.

While fixing the implementation so that the new tests pass, I had to change my
approach of using `JSON_EXTRACT` and `JSON_UNQUOTE` on MySQL and MariaDB for
the `KeyTransform` implementation. In the end, it's very simple and cleaner
than my previous implementation.

For MariaDB, I always use `JSON_UNQUOTE(JSON_EXTRACT(...))`, while it's just
`JSON_EXTRACT` on MySQL unless it's chained with a lookup expecting a text LHS.
Previously on MariaDB, it's only wrapped with `JSON_UNQUOTE` if the RHS is a
string. However, doing `JSON_UNQUOTE` on MariaDB doesn't do any harm if the RHS
isn't a string because every JSON value is a string anyway (unlike MySQL, it
doesn't have a native JSON type). So, I decided to always use `JSON_UNQUOTE`.
This eliminates the need to check whether the RHS is a string. It also unifies
the code for the `exact` lookup between MySQL and MariaDB.

I think that's the last major revision I did before GSoC finishes today. There
may be some other ones, but that depends on whether other Django folks find
mistakes in my PR or not. For now, my GSoC project is pretty much completed and
I'll probably only have one more post coming to recap the whole journey. The
final announcement is on September 4 (or maybe 3 in where you live), so let's
see if I'm going to pass the final evaluation.

Until then, see you!

[db-api]: https://www.python.org/dev/peps/pep-0249
[`.execute()`]: https://www.python.org/dev/peps/pep-0249/#id15
[`paramstyle`]: https://www.python.org/dev/peps/pep-0249/#paramstyle
[docs]: https://docs.djangoproject.com/en/2.2/topics/db/sql/#passing-parameters-into-raw
[section]: https://docs.djangoproject.com/en/2.2/howto/custom-lookups/
[`keytransform`]: /gsoc/transforms
[something off]: https://github.com/django/django/blob/4b78420d250df5e21763633871e486ee76728cc4/django/contrib/postgres/fields/jsonb.py#L111-L117
[can't]: https://stackoverflow.com/questions/16700006/feature-kwargs-allowing-improperly-named-variables
[issued]: https://www.djangoproject.com/weblog/2019/aug/01/security-releases/#s-cve-2019-14234-sql-injection-possibility-in-key-and-index-lookups-for-jsonfield-hstorefield
[fix]: https://github.com/django/django/commit/7deeabc7c7526786df6894429ce89a9c4b614086
[one]: https://code.djangoproject.com/ticket/30672
[other]: https://code.djangoproject.com/ticket/30704
[single]: https://github.com/django/django/commit/1f8382d34d54061eddc41df6994e20ee38c60907
[nested]: https://github.com/django/django/commit/c19ad2da4b573431843e5cead77f4139e29c77a0
