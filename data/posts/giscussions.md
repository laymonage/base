---
title: 'Introducing giscussions'
date: 2021-05-15T08:09:08.724Z
tags: []
toc: false
comments: true
draft: false
description: |-
  Introducing giscussions: a comments widget built on GitHub Discussions.
image: /img/uploads/giscussions.svg
---

## The idea 💡

On my [old blog][old], I used this widget called [utterances][utterances]. It's
a widget that lets people sign in with GitHub and leave comments on your
website.

It uses [GitHub Issues][issues] as the comments' backend. So, you need to
install the app on your GitHub repository in order to connect the two. After
that, you just need to include a small script to your website.

The script will search for a matching issue based on the container page's
attributes (e.g. `pathname`, `<title>`, etc.) and display the issue's comments
on the page. If a matching issue doesn't exist, a bot will automatically create
it the first time someone leaves a comment.

I think the idea is really cool! However, I find it funny how it (ab)uses
GitHub Issues: an issue tracker, which isn't really suitable for conversations.
Yet, it's funny how utterances takes something and turn it into a completely
different thing...

...that works.

It works because GitHub's markdown renderer is very feature-rich. It works
because GitHub Issues lets you add emoji reactions to comments. It works
because people who would use it have audiences that are likely to have GitHub
accounts, which they'd use rather than signing up for some random website.

If only we can lift those advantages off of the fact that it uses GitHub
Issues, an issue tracker...

## GitHub Discussions 💬

Last year, [GitHub announced][discussions-announcement] a new feature: GitHub
Discussions! You've probably already heard (or used) it. If you haven't, I'll
just quote from the announcement:

> Until now, GitHub only offered issues and pull requests as places to have
> these conversations. But issues and pull requests both have a **linear
> format**—well suited for merging code, but not for creating a community
> knowledge base. Conversations **need their own place**—that’s what GitHub
> Discussions is for. ... Their threaded format makes it easy to **start**,
> **respond to**, and **organize** unstructured conversations.

That sounds like something that'd work **much better** for utterances. And it
does.

[And I'm not the first one to think that.][utterances-issue]

GitHub Discussions was initially only available on select repositories. Then,
it [went live][discussions-live] as a public beta in December last year.

However, it wasn't [until February this year][discussions-api-announcement]
that the API became accessible.

So, I immediately began to work on it.

Initially, I wanted to fit Discussions support into utterances directly.
However, with the obstacles I encountered and the limited time I have, I
decided it would be much faster to build the thing from scratch.

## Enter: giscussions 💎

giscussions is a comments widget built on GitHub Discussions. It's really
similar to utterances. Basically, just replace Issues in utterances with
Discussions and you get giscussions.

Even the [landing page][giscussions] is similar.

Behind the scenes, though, it's quite different.

The Discussions API is only available through GitHub's GraphQL API. It requires
authentication for all requests, which means you can't fetch comments without
signing in. Plus, as Discussions is still in beta, it requires a custom
`GraphQL-Features: discussions_api` header to be set, which unfortunately has
[this issue][discussions-cors].

Those are just some of the challenges that I faced. I already wrote more
details and I almost included them here, but it would make this post be too
long to be an announcement. (It probably already is). I'll just turn it into a
separate blog post for later.

Anyway, in short, building giscussions wasn't so easy as I originally thought
it would be.

Thus, I'd really appreciate it if you would use it.  Put it on your website. Tell your friends, too. [Contribute][giscussions-gh].

And, try it, right below this blog post! 👇

[old]: https://blog.laymonage.com
[utterances]: https://utteranc.es
[issues]: https://guides.github.com/features/issues
[discussions-announcement]: https://github.blog/2020-05-06-new-from-satellite-2020-github-codespaces-github-discussions-securing-code-in-private-repositories-and-more/#discussions
[discussions-live]: https://github.blog/changelog/2020-12-08-github-discussions-now-available-as-a-public-beta/
[utterances-issue]: https://github.com/utterance/utterances/issues/324
[discussions-api-announcement]: https://github.com/github/feedback/discussions/43#discussioncomment-399047
[discussions-cors]: https://github.com/github/feedback/discussions/3622
[giscussions]: https://giscussions.vercel.app
[giscussions-gh]: https://github.com/laymonage/giscussions
