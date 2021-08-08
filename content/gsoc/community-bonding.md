---
title: Community Bonding and getting started
date: 2019-06-03T09:35:35.687Z
draft: false
toc: false
comments: true
description: >-
  In the official GSoC timeline, there's a Community Bonding period
  on May 7–27.
---

In the [official GSoC timeline][timeline], there's a Community Bonding period
on May 7–27. To quote the [glossary][glossary], it's

> The period of time between when accepted students are announced and the time
> these students are expected to start coding. This time is an excellent one to
> introduce students to the community, get them on the right mailing lists,
> working with their mentors on their timeline for the summer, etc.

At the start this period, we're also given emails from Google about what we
need to do. We are tasked to set up a Payoneer account to receive our stipend
later. We were also invited to a mailing list for current (and past) students.
Some students decided to create a Telegram group for discussions with other
students all over the world.

I posted on the [django-developers] mailing list to ask about communication
channels we'll use during the program, and one of my mentors said that he will
send an email to get me (and another student) started.

On May 13, my mentors (there are four) sent introductory emails on how to get
started. The plans are quite similar to what I put in my [proposal][proposal],
so I guess I'm on the right track. I assigned a related [ticket][ticket] on
Trac to myself as suggested, to let people know that I will be working on it.

One of my mentors also suggested to have an email exchange each week. Besides
that, he also suggested to use the [django-core-mentorship] mailing list for a
narrow implementation discussion we can have in public. For "project update"
type of emails, he suggested the usual django-developers list.

On the other hand, it was the last week before exams at my university, and I
had a lot of group projects and homework due that week. I didn't have a lot of
spare time to be actively involved in the community, so I just tried to read
more resources that will help me in my project. My exams also went from May 20
to May 25, so those two weeks were very busy for me.

It didn't end there, though. I also had one final group project due on May 29.
It was originally due on May 27, but it was extended since some students found
it too hard. I had finished most of my part before the deadline, but I still
had to help my friends to make sure our project ran smoothly.

It was a project for my Databases course, in which we're tasked to create a web
app with no help from any kind of ORM. Most of us, myself included, decided to
use Django. However, since we had to write our own SQL queries, we weren't
allowed to use Django models. This was quite a challenge, and it was very
interesting for me since my GSoC project also involves the database layer of
Django.

The coding period of this year's GSoC actually kicked off on May 27, so I
started later than I should. However, I was able to learn a thing or two about
how Django works with its database layer from my group project. I guess it
wasn't really a waste of my coding period after all.

Thankfully, my mentors have been very understanding and supportive of my
conditions and decisions. I appreciate them a lot!

Over the first week, I started working on a proof-of-concept `JSONField` for
SQLite, which I will explain in the next post.

[timeline]: https://summerofcode.withgoogle.com/how-it-works/#timeline
[glossary]: https://developers.google.com/open-source/gsoc/resources/glossary#community_bonding_period
[django-developers]: https://groups.google.com/d/msg/django-developers/M4dYz7T2SUo/cjGIfng-BAAJ
[proposal]: https://gist.github.com/laymonage/b53a1acbbab36b77776cd526b48fd2a5
[ticket]: https://code.djangoproject.com/ticket/12990
[django-core-mentorship]: https://groups.google.com/forum/#!forum/django-core-mentorship
