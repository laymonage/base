---
title: Caching API tokens in Supabase for a serverless application
date: 2021-10-16T11:10:51.261Z
tags:
  - supabase
  - giscus
  - serverless
  - api
toc: false
draft: false
comments: true
description: >-
  To help prevent giscus from hitting GitHub API's rate limit, we cache the
  access tokens in Supabase. Here's how I did it.
image: /img/uploads/supabase-giscus.png
---

Recently, [giscus][giscus] hit GitHub API's rate limit for one of its users. One
of the causes was that giscus always requested a new token from GitHub whenever
it makes an API call for unauthenticated users. Each token is valid for 60
minutes, but I didn't cache it at all. As giscus is serverless, I hadn't set up
a database (it didn't need one 🤷). Thus, I didn't have a proper place to cache
the tokens.

I thought I could get away by always requesting a fresh token, but unfortunately
that wasn't the case. [Unusually high traffic][21w41] would lead giscus to
request new tokens too many times in an hour, hitting the rate limit. I decided
to set up a database to cache the tokens.

I don't make any money off giscus, so free tiers are a life-saver for the
project. After a quick research, I found several serverless database platforms
with free tiers:

- [PlanetScale][planetscale]: 3 free databases, with 10GB storage, 100 million
  rows read/month, and 10 million rows written/month per database.
- [Fauna][fauna]: 100k read ops, 50k write ops, 500k compute ops, 5GB storage.
- [Upstash][upstash]: 10k commands/day, 100k commands/month, 1GB storage.
- [Supabase][supabase]: unlimited API requests, 500MB storage.

You probably can't go wrong with either one, but I chose Supabase for a few
reasons:

- It provides unlimited API requests.
- I don't need that much storage space.
- It's open source and built on [open source technologies][supabase-github].
- I'm curious to see what the hype is all about 😆

Here's how the database will be used for caching the access tokens:

1. An unauthenticated user requests a discussion's data to giscus' API.
2. Based on the repository name and owner (e.g. `laymonage/myrepo`), ask GitHub
   for the [ID of that giscus installation][get-installation-id].
3. Using the installation ID, check the database for the last cached token for
   that ID.
4. If a token is found, check the `expires_at` value of the token. If the
   token's remaining lifetime is longer than 5 minutes, use it.
5. Otherwise, [request a new access token][create-installation-access-token]
   from GitHub for that installation, and save the token to the database.

> If we don't cache the tokens, step 3 and 4 are essentially skipped.

With that design in mind, let's see how it can be done using Supabase.

## Creating a new account and project

This one is fairly straightforward. Just head to [their website][supabase-main]
and click on the top-right button to start a new project. Sign in with GitHub,
and you're in.

You can start a new project within your own account, or create a new
organization for the project. Either way, pick a name for the project and set
the database password. I chose the default region (East US).

Wait for the project to be initialized. Take note of the project URL, it looks
something like `https://mypr0j3ct.supabase.co`. Also take note of your
API keys: the `anon` `public` and the `service_role` `secret` keys.

## Creating a new table

Select the table editor menu on the left, and create a new table. Define the
table schema using the editor panel. I'm using the following schema for giscus:

![giscus table schema consists of five columns: `installation_id` (int8),
`token` (varchar), `expires_at` (timestamptz), `created_at` (timestamptz), and
`updated_at` (timestamptz)](/img/uploads/giscus-supabase-schema.png)

> The `created_at` and `updated_at` columns are there just-in-case.

Note that the Row-Level Security (RLS) feature is not enabled because we're
only going to interact with the table from the server side. The RLS feature is
more useful if you're accessing the table from the client side and you use
Supabase Auth.

When the table is populated, it would look something like the following:

![Populated table for the cached access tokens](/img/uploads/giscus-supabase-table.png)

After creating the table, Supabase automatically serves a REST API for the table
using [PostgREST][postgrest]. The API is served at the `/rest/v1/table_name`
endpoint of your project URL, e.g.
`https://mypr0j3ct.supabase.co/rest/v1/my_table`.

## Querying the table

Supabase provides an officially-supported
[JavaScript client library][supabase-js] and the docs seem to indicate that
it's the preferred way. There are also community-supported client libraries for
[Python][supabase-py] and [Dart][supabase-dart]. In addition to those, since
they provide a REST API, you can use any HTTP client to query the table.

For giscus, I'm using plain `fetch()` to avoid extra dependencies that are
barely used. In this post, I'm only going to cover the two simple queries
needed for caching the access tokens: a `SELECT` query and an `UPSERT` query.

Unfortunately, the Supabase docs are still a work-in-progress. The official docs
currently only have examples for the JavaScript client library. Meanwhile, the
auto-generated docs (with cURL examples) only include a few basic examples.

Thankfully, it seems that the PostgREST layer in Supabase is largely unmodified,
so we can utilize the PostgREST docs instead.

### `SELECT` query

The `SELECT` query can be done by sending a `GET` request to the API. Filtering
conditions are sent as query params in the format of
`column_name=operator.value`. For example, to get a row from the
`installation_access_tokens` table based on the `installation_id`, we can send
the following request:

```http
GET /rest/v1/installation_access_tokens?installation_id=eq.12345678 HTTP/1.1
```

That request returns an array of objects that match the query. We made the
`installation_id` the primary key, which is unique. That means the query either
returns an array with one element, or an empty array.

For convenience, we can tell the API to
[return a single object instead of an array][singular-plural]. To do so, we need
to specify `vnd.pgrst.object` as part of the `Accept` header.

```http
GET /rest/v1/installation_access_tokens?installation_id=eq.12345678 HTTP/1.1
Accept: application/vnd.pgrst.object+json
```

> If no rows are found, the server responds with `406 Not Acceptable` and an
> error message instead of `200 OK` and an empty list.

If you're not querying using a unique column, you can limit the result using the
`Range` HTTP header. For example, setting a `Range: 0` header will limit the
result to one object (but you still need the `Accept` header to "unpack" the
array).

Translating the above HTTP request (including the authorization for Supabase)
into a `fetch()` call results in the following code:

```ts
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const API_BASE_URL = 'https://mypr0j3ct.supabase.co/rest/v1/';
const TABLE_NAME = 'installation_access_tokens';

const params = new URLSearchParams({ installation_id: `eq.${installationId}` });
const url = `${API_BASE_URL}${TABLE_NAME}?${params}`;

const response = await fetch(url, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Accept: 'application/vnd.pgrst.object+json',
  },
});

if (!response.ok) {
  // No cached token found or an error occurred. Request a new token.
}

const { token, expires_at } = await response.json();

// Check the remaining lifetime based on `expires_at`.
// If it's more than 5 minutes, use the token. Otherwise, request a new one.
```

With the above code, we can retrieve the cached token from the database. The
next thing we need to do is to save (cache) new tokens into the database.

### `UPSERT` query

The `UPSERT` query is not a literal `UPSERT` statement, but rather a popular
name for the following query:

```sql
INSERT ... ON CONFLICT DO UPDATE
```

Which is quite self-explanatory. We can use the `UPSERT` query to insert a new
token for a new installation ID, or update the token if the installation ID
already exists.

In PostgREST, `UPSERT` can be done by sending a `POST` request with the `Prefer`
header set to `resolution=merge-duplicates`. It operates based on the primary
key columns by default, but you can also use columns that have `UNIQUE`
constraint on them by specifying the `on_conflict` query param.

A single row `UPSERT` can also be done by sending a `PUT` request and filtering
the primary key columns in the same way as the `SELECT` query. Since we only
operate on one installation ID at a time, we can use this shortcut to update or
add our cached tokens.

```http
PUT /rest/v1/installation_access_tokens?installation_id=eq.12345678 HTTP/1.1

{
  "installation_id": 12345678,
  "token": "ghs_50m3r4nD0m5Tr1n650m3r4nD0m5Tr1n650m3",
  "expires_at": "2021-10-16T11:18:30.573Z",
  "updated_at": "2021-10-16T10:18:31.089Z"
}
```

In `fetch()` terms...

```ts
const body = {
  installation_id,
  token,
  expires_at,
  updated_at: new Date().toISOString(),
};

// Using the same `url` and `SUPABASE_KEY` as the previous `SELECT` query.
const response = await fetch(url, {
  method: 'PUT',
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Accept: 'application/vnd.pgrst.object+json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

// Do something (or ignore) if `!response.ok` as needed.
```

Combining our `SELECT` and `UPSERT` queries, we have successfully retrieved and
cached our API tokens using Supabase! 🥳

## Wrapping up

We can write our `SELECT` and `UPSERT` queries as separate functions, then write
a function that wraps the following logic:

- Call `getCachedAccessToken(installationId)` and see if the cache hits.
- If it does, return it. Otherwise, request a new token from GitHub.
- Call `setCachedAccessToken({ installation_id, token, expires_at })` using the
  values obtained from GitHub.

You can see the [PR][final-pr] where I implemented this for more details.

---

Hope you find this useful! 😄

[21w41]: /logs/21w41
[giscus]: https://giscus.app
[planetscale]: https://planetscale.com/pricing
[fauna]: https://fauna.com/pricing
[upstash]: https://docs.upstash.com/account/pricing
[supabase]: https://supabase.io/pricing
[supabase-github]: https://github.com/supabase
[get-installation-id]: https://docs.github.com/en/rest/reference/apps#get-a-repository-installation-for-the-authenticated-app
[create-installation-access-token]: https://docs.github.com/en/rest/reference/apps#create-an-installation-access-token-for-an-app
[supabase-main]: https://supabase.io
[postgrest]: https://postgrest.org
[supabase-js]: https://github.com/supabase/supabase-js
[supabase-py]: https://github.com/supabase-community/supabase-py
[supabase-dart]: https://github.com/supabase/supabase-dart
[singular-plural]: https://postgrest.org/en/v8.0/api.html#singular-or-plural
[final-pr]: https://github.com/giscus/giscus/pull/195
