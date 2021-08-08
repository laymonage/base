---
title: 'Form field and database feature'
date: 2019-06-25T20:24:33+07:00
draft: false
toc: false
comments: true
description: >-
  In these past two weeks, I've added a form field for my JSONField. I have
  also done some improvements to the tests and the field itself.
---

I know this post is way overdue. I haven't been feeling well lately and there
were some things in life I need to catch up with. Anyway, I still try to make
progress in my project whenever I can. In these past two weeks, I've added a
form field for my `JSONField`. I have also done some improvements to the tests
and the field itself. I feel like there isn't much to write about this time,
since most of the work is documented on the GitHub [PR].

Compared to its model fields, Django's form fields are easier to write. This
time, the Django [documentation] isn't very helpful. However, with the
`JSONField` form field available in `contrib.postgres`, we can reuse most of
its code for our cross-DB `JSONField`'s form field.

I won't go into details of each method in the form field, since the form field
from `contrib.postgres` already works out of the box. However, I'll try to add
support for custom JSON encoder and decoder that will be used in the field's
validation.

It's very easy. I just needed to add the encoder and decoder to the field's
constructor like this:

```python
def __init__(self, encoder=None, decoder=None, **kwargs):
    self.encoder, self.decoder = encoder, decoder
    super().__init__(**kwargs)
```

and add the `cls` argument to `json.dumps` and `json.loads` calls.

I decided to change the invalid error message from `'%(value)s' value must be valid JSON.` into `Enter a valid JSON value.` to be consistent with other form
fields in `django.forms`.

That's it!

Now, we just need to link our model field with the new form field to be used by
`ModelForm`. This can be done by overriding the `formfield` method in the model
field. We basically just need to specify the form class, but since we have
added support for custom JSON encoder and decoder in our form field, it's a
good idea to pass the encoder and decoder used in the model field to the form
field.

```python
# django/db/models/fields/json.py
def formfield(self, **kwargs):
    return super().formfield(**{
        'form_class': forms.JSONField,
        'encoder': self.encoder,
        'decoder': self.decoder,
        **kwargs,
    })
```

On the other hand, I finally touched the backend code to add a new database
feature in Django, named `supports_json`. It's a flag that determines if the
currently used database backend supports JSON. I used it to prevent the use of
`JSONField` if the backend does not support it. It may or may not be useful for
web developers, I'm not really sure `¯\_(ツ)_/¯`.

For most backends, I just write it as a boolean variable with `True` as its
value if the minimum version required by Django for that backend already
supports JSON. Otherwise, I write it as a method that checks the version and
return `True` or `False` accordingly. The method is decorated with
`cached_property` as with other database features that use methods. Here's an
example:

```python
# django/db/backends/mysql/features.py
@cached_property
def supports_json(self):
    if self.connection.mysql_is_mariadb:
        return self.connection.mysql_version >= (10, 2, 7)
    return self.connection.mysql_version >= (5, 7, 8)
```

For SQLite, it was a bit tricky. JSON support for SQLite is provided through
the JSON1 extension, which was introduced with the release of SQLite 3.9.0.
However, it's a loadable extension and there's the possibility that it's not
included in the installation (since it's optional).

There is no command to check for enabled extensions in SQLite. One way I could
think of is to execute an SQL query like `SELECT JSON('"test"')` and see if it
works. If it does, then JSON1 is enabled, and vice versa. To do this, I execute
the query in the feature method, wrapped with `transaction.atomic()` to avoid
breaking transactions if the query raises an exception.

```python
# django/db/backends/sqlite3/features.py
@cached_property
def supports_json(self):
    try:
        with self.connection.cursor() as cursor, transaction.atomic():
            cursor.execute("SELECT JSON('\"test\"')")
    except OperationalError:
        return False
    else:
        return True
```

Now that I've touched the backend code, I might end up removing `db_type` and
`db_check` in our `JSONField` and defining them in the backend by adding JSON
to `data_types` and adding the constraints to `data_type_check_constraints` in
the `DatabaseWrapper`. I'll need opinions to see if this is the right approach,
though.

I guess that's it for this post. The first GSoC evaluation is happening right
now until June 29, 2019 at 00:59 (UTC+07:00). Let's hope I'll make it through!

[pr]: https://github.com/django/django/pull/11452
[documentation]: https://docs.djangoproject.com/en/2.2/ref/forms/fields/#creating-custom-fields
