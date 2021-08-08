---
title: 'Null values and HasKey lookups'
date: 2019-07-07T11:06:20+07:00
draft: false
toc: false
comments: true
description: >-
  This week, I polished my code, incorporated some tests from contrib.postgres,
  and implemented HasKey, HasAnyKeys, and HasKeys lookups on all database
  backends.
---

I'm still here, which means I've passed the first GSoC evaluation. Yay! The
first phase has been fun and I learned a lot of new things. I'm very grateful
to have amazing people mentoring me in this journey.

Anyway, the end of the first phase marks the start of the second one. This
week, I polished my code, incorporated some tests from `contrib.postgres`, and
implemented `HasKey`, `HasAnyKeys`, and `HasKeys` lookups on all database
backends.

One of my mentors suggested moving all PostgreSQL tests for JSONField to all
database scope and start to work on failures. I decided to do so, starting from
the easy ones like the save/load tests.

I had already replicated most of the save/load tests in my original pull
request. However, I forgot to test for null value on the field. When I did so,
I noticed a couple of things:

- We used the `JSON_VALID` function for the `CHECK` constraint on SQLite,
  MySQL, and MariaDB. I found out that `JSON_VALID(NULL)` returns `0` (false)
  on SQLite, while it returns true on MySQL and MariaDB (or maybe the check
  just doesn't occur). This makes it impossible to store SQL `NULL` even if we
  specify `blank=True, null=True`. I've updated the SQLite constraint with `OR "%(column)s" IS NULL` and now it works correctly.
- Oracle Database stores SQL `NULL` as an empty string `''` on fields that
  support empty strings. I've updated the field to accommodate this behavior.
  Saving empty Python strings would still work, as they would be encoded as
  `'""'` (this doesn't really matter anyway, since Oracle doesn't support
  storing scalar values).

After that, I replicated the serialization tests. I found some interesting
things. According to [the docs], customizing how the values are serialized can
be done by overriding `value_to_string()`. I misunderstood this part, thinking
that I should return the string **result** of the serialization process. It
turns out that this method should return the value that **would be**
serialized.

The docs say that the method [converts] the value to a string, though. However,
I think this is the case if the custom field represents a custom Python object.
Since JSON values translate well into Python objects (`dict`, `list`, and
scalar types), we can just leave the serialization to
`serializers.serialize()`. If we make use of custom Python objects with
`JSONField` and custom encoder, we can just pass the encoder to
`serializers.serialize()` with the `cls` argument.

So, instead of this:

```python
def value_to_string(self, obj):
    value = self.value_from_object(obj)
    return self.get_prep_value(value)
```

I should just do this:

```python
def value_to_string(self, obj):
    return self.value_from_object(obj)
```

Which is exactly how it's done in `contrib.postgres` (duh).

Another thing is that, I previously overrode `to_python()` as instructed in the
docs. The docs say that `to_python()` should deal gracefully with instance of
the correct type, a string, and `None` arguments. However, I didn't really know
how I should deal with a string value since it can either be a serialized
object, or a deserialized string.

After some experimenting, I found the best solution is to **not** override
`to_python()`. Which is, again, exactly how it's done in `contrib.postgres`.
`¯\_(ツ)_/¯`

Now, serialization and deserialization process works as expected. Phew!

Let's start to move on to the most "exciting" part: lookups!

[Previously], I have implemented `HasKey`, `HasAnyKeys`, and `HasKeys` lookups
on SQLite on top of the django-jsonfallback package. So now, I just have to
implement them on Oracle.

To do that, we make use of the [`JSON_EXISTS`] function on Oracle Database. I
can reuse most of my code from my previous implementation, replacing the
function name with `JSON_EXISTS`. However, I stumbled upon a problem.

The query parameters passed by Django to cx_Oracle (and in turn, to Oracle
Database itself) are put into something called [bind variables]. You can read
more about it [here] and [the backend code]. Basically, it's like using
variables in your SQL queries, so it looks like:

```sql
SELECT * FROM employees WHERE department_id = :dept_id AND salary > :sal
```

cx_Oracle can handle this pretty well. However, it turns out that `JSON_EXISTS`
[doesn't support bind variables] for its JSON path argument. The only solution
is to format the JSON path into the string directly in our Python code.
However, this opens up the possibility of SQL injections.

I do `json.dumps()` on the specified key before formatting it, so the key will
be double-quoted. If someone were to execute an SQL injection, they should end
the quote first, which I don't think is possible since `"` will be escaped by
`json.dumps()` into `\"`. I think the worst that could happen is a
`DatabaseError`. I currently can't think of a key string that can be used to
perform an SQL injection.

Still, I'm not sure if this is acceptable. I guess I'll just wait for more
input from my mentors and the community.

Anyway, I think that's it for this week. This post was supposed to be up
earlier, but it took me some time to find out the culprit on Oracle. I also
went on a not-so-planned three-day vacation, and I couldn't get a decent
internet connection to put this up.

I'm looking forward to implement the remaining lookups and transforms. Once
they're done, I'll have to write some docs. Until then, see you!

[the docs]: https://docs.djangoproject.com/en/2.2/howto/custom-model-fields/#converting-field-data-for-serialization
[converts]: https://docs.djangoproject.com/en/2.2/ref/models/fields/#django.db.models.Field.value_to_string
[previously]: /gsoc/poc
[`json_exists`]: https://docs.oracle.com/en/database/oracle/oracle-database/18/adjsn/condition-JSON_EXISTS.html#GUID-8A0043D5-95F8-4918-9126-F86FB0E203F0
[bind variables]: https://oracle.readthedocs.io/en/latest/plsql/bind/
[here]: https://www.oracle.com/technetwork/articles/dsl/prez-python-queries-101587.html
[the backend code]: https://github.com/django/django/blob/master/django/db/backends/oracle/base.py#L478
[doesn't support bind variables]: https://stackoverflow.com/questions/48913687/jdbc-prepared-statement-to-query-json-using-json-exists
