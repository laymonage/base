---
title: 'Writing JSONField from scratch'
date: 2019-06-09T12:37:01+07:00
draft: false
toc: false
comments: true
description: >-
  This week, I tried to create a unified JSONField from scratch.
---

[Last week], I improved an existing Django package and implemented some SQLite
lookups for its `JSONField` to get some sense of how Django model fields work.
This week, I tried to create a unified JSONField **from scratch**. It's
_unified_ in the sense that it works on all database backends supported by
Django. I also set up docker containers to run Django's test suite with all
database backends with the help of [django-docker-box] \(though I ended up
making my own for Oracle since it's a bit more complex). However, I'm just
going to talk about writing the field as that's more interesting.

As before, the docs on how to write [custom model fields] is very handy. I
started building my own `JSONField` and got it working in a relatively short
time. Not without bugs and quirks I had to deal with on each database backend,
though.

First, I wrote the code with SQLite as the top priority. I overrode the
`db_type` method so it returns `json`. It's also the name of the data type used
in MySQL and MariaDB for JSON values, so I guess it's a good start.

```python
def db_type(self, connection):
    return 'json'
```

This means that the SQL query for the table creation will be something like:

```sql
CREATE TABLE ... (..., "column_name" json)
```

Now, is there a `json` datatype in SQLite, especially with the [JSON1]
extension available? Nope. I thought there was, as the [JSON1 docs] have some
examples that use `JSON` as the data type of some columns. Anyway, the docs
state that the extension stores JSON data as ordinary `text`.

You can actually use custom data type names in SQLite. It means we can still
define our column's data type as `json`, so the database schema will look
pretty nice.

However, SQLite uses dynamic typing. This means that data types aren't
determined by the container (i.e. column) of the value. In SQLite, the data
type is associated with the value itself. There's something called type
affinity in SQLite. It's a system that tries to convert the values inserted
into a table according to the preferred storage class for a column, called
_affinity_.

There's a break down of how SQLite determines column affinity in the [data type
docs]. I recommend giving it a quick read.

Anyway, according to the docs, our `json` data type will have a `NUMERIC`
affinity. This means, SQLite will try to store any values in the column as an
`INTEGER` or `REAL` (in that order). This can lead into some problems.

When we retrieve a JSON value from the database, we would like it to be
converted into its Python equivalent (`bool`, `int`, `float`, `str`, `dict`,
`list`), despite it being stored as a text in the database. To illustrate:

```python
>>> value = {'name': 'John', 'age': 20, 'height': 180.3}
>>> obj = JSONModel.objects.create(value=value)
>>> obj = JSONModel.objects.get(id=obj.id)
>>> type(obj.value)
<class 'dict'>
```

That means, the _[serialization]_ (fancy word for translation) of the `value`
should be handled automatically by our `JSONField`. In Django, we implement
this by overriding two essential methods in our `Field` subclass:
`get_prep_value` and `from_db_value` (for serialization and deserialization,
respectively).

Thanks to Python's `json` library, we can use the `json.dumps` and `json.loads`
functions for that purpose.

```python
def get_prep_value(self, value):
    """Convert the value into a JSON string."""
    if value is None:
        return value
    return json.dumps(value)

def from_db_value(self, value, expression, connection):
    """Convert the JSON string value into a Python object."""
    if value is None:
        return value
    return json.loads(value)
```

Keep in mind that our field has a `NUMERIC` affinity in the database. Let's say
we want to insert a Python `int` as the value, let's say `3`. It's a valid JSON
value. If we call `json.dumps(3)`, we will get the Python string `'3'`. Suppose
we create a new object of our model. The value will be inserted into the
database like so:

```sql
INSERT INTO myapp_mymodel VALUES (..., '3', ...)
```

That SQL query is perfectly fine, since SQLite stores JSON as ordinary `text`.
However, with `NUMERIC` affinity, SQLite will try to convert the value into an
`INTEGER` in the database. It succeeds in doing so, therefore it's stored as an
`INTEGER`.

If we go ahead and retrieve our object using `Model.objects.get`, our
`from_db_value` will receive a Python `int` object `3` as the value, instead of
`str` object `'3'`, from the database backend. Of course, calling
`json.loads(3)` would raise an exception (a `TypeError`, to be precise).

We could go ahead and add `if isinstance(value, (int, float))` to our
`from_db_value` method, but I find the best solution is to just ditch `json` as
our `db_type` and use `text` instead, so our column will have a `TEXT` affinity
and no conversion will be done by SQLite.

Actually, SQLite will assign `TEXT` affinity if the declared type of a column
contains the string `"CHAR"`, `"CLOB"`, or `"TEXT"`. So, we can actually
specify something like `json text` as our data type, but I'm not sure if that's
something people would like. (I kind of like it, so I might use that later.)

Anyway, that's just some SQLite magic.

For MySQL and MariaDB, we can use `json` as our data type and our `JSONField`
would work without having to change anything else. That's pretty cool!

If we want to make it cooler, we can add an SQL `CHECK` constraint using the
`JSON_VALID` function available in SQLite, MySQL, and MariaDB. To do so, we can
just override `db_check` method in our field. This will prevent invalid JSON
values from getting inserted into the database table.

```python
def db_check(self, connection):
    data = self.db_type_parameters(connection)
    if connection.vendor in ('mysql', 'sqlite'):
        return 'JSON_VALID(%(qn_column)s)' % data
    return super().db_check(connection)
```

Note that `connection.vendor` is also `'mysql'` for MariaDB. Also, for MariaDB
10.4.3 and up, the `JSON_VALID` function is automatically used as a `CHECK`
constraint for `JSON` data type.

Now, let's move on to PostgreSQL.

PostgreSQL provides two data types for JSON values: `json` and `jsonb`. In
short, <code>json<strong>b</strong></code> is **b**etter. It supports indexing
and other cool stuffs. You can see the [JSON Types docs] for more details.

`django.contrib.postgres.fields.JSONField` also uses `jsonb`. If you look at
[its source code], you can see that it doesn't override `from_db_value`. Why is
that?

Well, Django uses `psycopg2` as the database adapter for its PostgreSQL
backend. It turns out, `psycopg2` already does [JSON adaptation] when it
retrieves `json` and `jsonb` data from the database. The Python `json` module
and `json.loads` are used, just like what our `from_db_value` method does. You
can verify this in the [psycopg2 source code].

Calling `json.loads` with the adapted value could throw a `TypeError`. It's
kind of like what happened with SQLite earlier. We can easily handle this by
modifying our method like this:

```python
def from_db_value(self, value, expression, connection):
    """Convert the JSON string value into a Python object."""
    if value is None or connection.vendor == 'postgresql':
        return value
    return json.loads(value)
```

However, I want to spice things up a bit. Let's allow custom JSON encoder
**and** decoder to be used in our serialization and deserialization process!

Both `json.dumps` and `json.loads` accept a keyword argument `cls`. It can be
used to specify the `class` of a JSON encoder and decoder, respectively. The
argument is `None` by default, which will make the functions use the built-in
`json.JSONEncoder` and `json.JSONDecoder`.

If we would like to allow custom JSON encoder and decoder, we need to pass them
as an argument in our `JSONField` constructor and make it an instance
attribute. This way, we can pass the encoder and decoder to our `json.dumps`
and `json.loads` calls like so:

```python
def __init__(self, encoder=None, decoder=None, default=dict, *args, **kwargs):
    self.encoder, self.decoder = encoder, decoder
    super().__init__(default=default, *args, **kwargs)

def get_prep_value(self, value):
    if value is None:
        return value
    return json.dumps(value, cls=self.encoder)

def from_db_value(self, value, expression, connection):
    if value is None:
        return value
    return json.loads(value, cls=self.decoder)
```

We also need to override the `deconstruct` method accordingly:

```python
def deconstruct(self):
    name, path, args, kwargs = super().deconstruct()
    if self.default is dict:
        del kwargs['default']
    if self.encoder is not None:
        kwargs['encoder'] = self.encoder
    if self.decoder is not None:
        kwargs['decoder'] = self.decoder
    return name, path, args, kwargs
```

You probably notice that I left off the conditional for PostgreSQL in
`from_db_value`. If we stick to our solution, we won't be able to use a custom
decoder, since we will just return the value adapted by `psycopg2`.

A naive solution might be to call `json.dumps` on that value and call
`json.loads` with our decoder, basically serializing it and deserializing it
again. It could work, but that would be slow. We need a way to prevent
`psycopg2` from adapting the value to Python objects.

According to the docs, we can either cast the column to `text` in the query, or
register a no-op `loads` with `register_default_json` (the registration is
shared for the same database connection). If we choose the latter, we might
break compatibility with `contrib.postgres`'s `JSONField`, since it doesn't
allow a custom decoder and it relies on `psycopg2`'s `loads` instead.

Thankfully, we can implement the former by overriding `select_format`. It's not
documented as of this writing, but the docstring gives a clue on how it can be
used. I found examples of overridden `select_format` in `contrib`'s GIS fields.
Apparently, we can do it like this:

```python
def select_format(self, compiler, sql, params):
    if compiler.connection.vendor == 'postgresql':
        return '%s::text' % sql, params
    return super().select_format(compiler, sql, params)
```

Therefore, `from_db_value` will always retrieve a string value for non-`NULL`
values in the database, and we can call `json.loads` just like for other
backends.

Phew! Now, we've got our `JSONField` working on SQLite, MySQL, MariaDB, and
PostgreSQL. We've also allowed the use of custom JSON encoder and decoder.
Let's move on to the last database backend: Oracle.

Oracle can use `VARCHAR2`, `BLOB`, or `CLOB` data types to store JSON values.
It [recommends] us to use `BLOB`, but there are some downsides:

- When selecting data from a `BLOB` column, if you want to view it as printable
  text then you must use SQL function `to_clob`.

- When performing insert or update operations on a `BLOB` column, you must
  explicitly convert character strings to BLOB format using SQL function
  `rawtohex`.

I haven't verified if that's the case with `cx_Oracle` (Oracle Database adapter
for Python). Since an implementation of `JSONField` on Oracle is [available]
and it uses `CLOB` instead, I'm going to use `CLOB` too. If `BLOB` turns out to
be feasible to implement (without some complex things), I might switch to
`BLOB`.

Oracle also provides the `IS JSON` constraint for columns that hold JSON data.
It also recommends us to use this constraint in our table definition, because
we won't be able to use the simple dot-notation syntax to query the JSON data
otherwise.

However, from my experience, the `IS JSON` constraint only accepts a JSON
object or array as its value. Meaning, we can only use `dict` or `list` Python
objects and not any of `bool`, `int`, `float`, and `str` as our field's value.

To add that constraint in our field, we can override `db_check` like before:

```python
def db_check(self, connection):
    data = self.db_type_parameters(connection)
    if connection.vendor in ('mysql', 'sqlite'):
        return 'JSON_VALID(%(qn_column)s)' % data
    if connection.vendor == 'oracle':
        return '%(qn_column)s IS JSON' % data
    return super().db_check(connection)
```

Another thing to note is that `cx_Oracle` returns a Python object of type `LOB`
for values with `BLOB`, `CLOB`, and `NCLOB` data types. We cannot simply use
`json.loads` as the decoder doesn't know how to decode `LOB` objects. In order
to do that, we must obtain the `str` equivalent of the `LOB` object by calling
the `.read` method of the `LOB`.

The `oracle-json-field` package overcomes this by subclassing `TextField`.
`TextField` on Oracle is implemented using `NCLOB` in Django, and the database
backend already has a converter that calls the `.read` method.

We can either modify the backend so it also does the same for our `JSONField`,
or we can also override the `get_db_converters` method in our field. I choose
the latter to be consistent with my previous decisions.

The `get_db_converters` method isn't documented as of this writing, but we
basically just need to create a list that contains the functions that we want
to be run before returning the final value. Then, we extend that list with the
one returned by the original `get_db_converters`.

I implemented mine like this:

```python
def convert_jsonfield_value(value, expression, connection):
    if connection.vendor == 'oracle':
        return value.read()
    return value


class JSONField(Field):
    ...
    def get_db_converters(self, connection):
        return [convert_jsonfield_value] + super().get_db_converters(connection)
```

Now, our `from_db_value` method will get the equivalent `str` of the `LOB` as
the value.

And, that's it! We've successfully implemented our own unified `JSONField`. We
have yet to implement custom lookups and transforms, but that's on our to-do
list. I made a [draft PR] to Django for this field today (which also happens to
be my birthday!). If some things in that PR turn out different from what I
wrote here, maybe I've found some better approaches in implementing them.

Whoa, this turned out long. Anyway, if you want to leave a feedback, feel free
to comment below or on the PR, I'd love to hear some thoughts about this. I'll
be back here with another post next week!

[last week]: /gsoc/poc
[django-docker-box]: https://github.com/django/django-docker-box
[custom model fields]: https://docs.djangoproject.com/en/2.2/howto/custom-model-fields/
[json1]: https://www.sqlite.org/json1.html
[json1 docs]: https://www.sqlite.org/json1.html#the_json_each_and_json_tree_table_valued_functions
[data type docs]: https://www.sqlite.org/datatype3.html#determination_of_column_affinity
[serialization]: https://en.wikipedia.org/wiki/Serialization
[json types docs]: https://www.postgresql.org/docs/current/datatype-json.html
[its source code]: https://github.com/django/django/blob/master/django/contrib/postgres/fields/jsonb.py#L30
[json adaptation]: http://initd.org/psycopg/docs/extras.html#json-adaptation
[psycopg2 source code]: https://github.com/psycopg/psycopg2/blob/master/lib/_json.py#L158
[recommends]: https://docs.oracle.com/en/database/oracle/oracle-database/12.2/adjsn/overview-of-storage-and-management-of-JSON-data.html
[available]: https://github.com/Exscientia/oracle-json-field
[draft pr]: https://github.com/django/django/pull/11452
