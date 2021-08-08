---
title: Drafting a POC JSONField for SQLite
date: 2019-06-04T09:35:05.687Z
draft: false
toc: false
comments: true
description: >-
  Since my project is to bring a cross-DB JSONField, the django-jsonfallback
  project is very useful for me as a starting point.
---

There's this neat little python package called [django-jsonfallback]. It's made
by one of my mentors. To quote the description, this package allows you to

> Use PostgreSQL's and MySQL's JSONField, but fall back to a TextField
> implementation on other databases.

Since my project is to bring a cross-DB JSONField, this project is very useful
for me as a starting point. To get a better understanding of how that package
works (and how Django model fields work in general), I did a good read on these
wonderful Django docs about [custom model fields] and [custom lookups]. I also
found this interesting [Custom Database Backends] presentation from Django
Under the Hood 2016 event.

As explained in the docs and presentation, you can create `as_vendor` methods
such as `as_mysql`, `as_sqlite`, etc. to create different implementations of
lookups and transforms (it also applies for any class that extends
[BaseExpression], if I'm not mistaken). I began looking at the code in
django-jsonfallback, and I found that it was made with some `if` conditionals
to check for the database backend. I tried replacing the `as_sql` methods with
`as_mysql` as you can see in [this pull request], and it worked pretty well.

I also [tried] to replace the conditionals used in `process_lhs` and
`process_rhs` methods, and it worked for the `CaseInsensitiveMixin`. However,
when I [tried to do the same] for `StringKeyTransformTextLookupMixin`, the
[tests failed]. I tried to print the compiled query by adding:

```python
print(Book.objects.filter(data__title__iexact='harry potter').query)
```

and it shows:

```sql
SELECT `testapp_book`.`id`, `testapp_book`.`data`
FROM `testapp_book`
WHERE LOWER(JSON_EXTRACT(`testapp_book`.`data`, $.title))
LIKE LOWER(harry potter)
```

If I print the query before I replaced the `process_rhs` method, it shows:

```sql
SELECT `testapp_book`.`id`, `testapp_book`.`data`
FROM `testapp_book`
WHERE LOWER(JSON_EXTRACT(`testapp_book`.`data`, $.title))
LIKE LOWER("harry potter")
```

As you can see, the quotes around `harry potter` went missing. I don't know
why. I have spent hours trying to debug this but I still haven't found a clue.

Anyway, I decided to stop refactoring and tried to do something new:
implementing the lookups for SQLite.

The [JSON1] extension provides some functions to handle JSON data in SQLite.
These functions are quite simple and somewhat limited compared to the functions
in other database backends such as PostgreSQL or MySQL. However, if you can
come up with some neat tricks, you can create some useful lookups with these
functions.

The existing PostgreSQL JSONField already has some lookups and transforms
implemented. I made a simple summary of them in [this Google Sheets document].
Looking at the JSON1 functions, I found `json_extract()` or `json_type()` might
be useful in implementing `has_key`, `has_any_keys`, and `has_keys` lookups.

How would that work?

The `json_extract(X,P1,P2,...)` function extracts and returns one or more
values from the well-formed JSON string `X` that are selected by the paths
`P1`, `P2`, .... If the selected path doesn't exist, it will return `NULL`.
That means, if we would like to do a `has_key` lookup such as:

```python
Book.objects.filter(data__has_key='title')
```

We could imagine it being an SQL query like this:

```sql
SELECT * FROM myapp_book
WHERE json_extract(myapp_book.data, '$.title') IS NOT NULL
```

That would work, right?

Not quite. The `json_extract` function also returns `NULL` if the path exists
and the value is actually JSON `null`. So if the JSON object has the specified
key but has `null` as the value, our query would not return such rows. This
isn't what we want!

Let's look for an alternative: `json_type()`

To quote the JSON1 documentation,

> The `json_type(X,P)` function returns the "type" of the element in `X` that
> is selected by path P. The "type" returned by json_type() is one of the
> following an **SQL text values**: `'null'`, `'true'`, `'false'`, `'integer'`
>
> > `'real'`, `'text'`, `'array'`, or `'object'`.

As you can see, it returns **SQL text values** of the JSON type of the value.
Like `json_extract()`, it also returns `NULL` if the path doesn't exist.
However, for `null` values, it returns `'null'`. See the difference?

Therefore, we can still use the same SQL formula, replacing `json_extract` with
`json_type`, like so:

```sql
SELECT * FROM myapp_book
WHERE json_type(myapp_book.data, '$.title') IS NOT NULL
```

Pretty clever, don't you think? We just used a function that checks the
datatype of a JSON value to implement `has_key` lookup!

Now, you might already see it coming, but implementing `has_any_keys` and
`has_keys` lookups are very easy now that we already know what function to use.

For `has_any_keys`, we just need to chain multiple `json_type() IS NOT NULL`
expressions with `OR` for each key specified in the lookup. To illustrate, the
following lookup:

```python
Book.objects.filter(data__has_any_keys=['title', 'foo', 'bar'])
```

would translate into the following SQL query:

```sql
SELECT * FROM myapp_book
WHERE (
    json_type(myapp_book.data, '$.title') IS NOT NULL OR
    json_type(myapp_book.data, '$.foo') IS NOT NULL OR
    json_type(myapp_book.data, '$.bar') IS NOT NULL
)
```

And for `has_keys`, it's pretty much the same. We just need to chain it with
`AND` instead of `OR`.

I've made some commits implementing those lookups on my [sqlite-lookups]
branch. I also deleted `@xfail` decorators for those lookups' tests. So now,
running the tests with SQLite should expect those lookups to work correctly.

Now, I haven't figured out the best way to implement the remaining lookups (and
transforms). Also, I'm not really sure if what I did is the best approach to
implement those three lookups. If you have any thoughts about this, please let
me know on the comments below!

[django-jsonfallback]: https://github.com/raphaelm/django-jsonfallback
[custom model fields]: https://docs.djangoproject.com/en/2.2/howto/custom-model-fields/
[custom lookups]: https://docs.djangoproject.com/en/2.2/howto/custom-lookups/
[custom database backends]: https://simpleisbetterthancomplex.com/media/2016/11/db.pdf
[baseexpression]: https://github.com/django/django/blob/master/django/db/models/expressions.py#L184
[this pull request]: https://github.com/laymonage/django-jsonfallback/pull/1/files
[tried]: https://github.com/laymonage/django-jsonfallback/pull/3/files
[tried to do the same]: https://github.com/laymonage/django-jsonfallback/commit/7651f8d7a613e448837818b149c296d8540f12be
[tests failed]: https://travis-ci.com/laymonage/django-jsonfallback/builds/114230423
[json1]: https://www.sqlite.org/json1.html
[this google sheets document]: https://docs.google.com/spreadsheets/d/1A1TF-A-jbPmSAYd62Y4fqz7s4Mjz7McciWtr0Bp86OA
[sqlite-lookups]: https://github.com/laymonage/django-jsonfallback/commits/sqlite-lookups
