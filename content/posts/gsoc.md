---
title: Google Summer of Code reflection
date: 2020-03-19T03:20:20.193Z
tags:
  - gsoc
  - django
  - open source
toc: true
draft: false
description: >-
  Google Summer of Code 2019 was a life changing experience for me. Thanks to
  Django, I learned a lot of things through the summer.
image: /img/uploads/gsoc-15years.png
---

<a href="https://opensource.googleblog.com/2019/09/google-summer-of-code-2019-statistics.html">
	<img src="/img/uploads/gsoc-15years.png" alt="Celebrating 15 Years - Google Summer of Code" title="Google Summer of Code 2019: 15th year" class="dark:bg-gray-700"/>
</a>

[**Google Summer of Code**][gsoc] 2019 was a life changing experience for me.
Thanks to [**Django**][django], I learned a lot of things through the summer.
Here are some things I'd advise if you're looking to participate this year.

## 1. Find your dream project/organization

This one may not be easy, depending on your interests. The organizations were
announced a few weeks ago. It would be an advantage if you'd already been eyeing
on some organizations. If not, don't waste your time!

Browse through [the list][orgs-list] and see what suits you. You can pick
more than one organization, but I'd advise picking **no more than two**.
It's fine if you submit three proposals, though.

For me, I had been looking at Django's **`JSONField`** idea since the previous
February. I was _lucky_ to stumble upon it.

### > Some backstory

I took a Web Design and Programming course the previous semester. We used
Django. It was the first time I used it thoroughly (I had finished
[the tutorial][django-tutorial] during the summer break but that was it).
During the course, I encountered the need for a `JSONField` in my model.

Then I saw Django [**has it**][postgres-jsonfield], only to find out it's only
for PostgreSQL.

I deployed my course projects to Heroku and used the Heroku Postgres add-on.
However, I only had SQLite locally. So, the postgres `JSONField` wasn't an
option.

I wasn't interested in using a third-party package just for that, so I used a
[**`TextField`**][textfield] and made use of [**`json.loads`**][json.loads] and
[**`json.dumps`**][json.dumps] instead. It worked, though not as simple as
using a `JSONField`.

When I saw Cross-DB `JSONField` on Django's
[GSoC 2019 ideas list][ideas-list], I was **hooked**. I participated in
[Google Code-In][gci] back in high school and heard about GSoC then. I really
wanted to participate in GSoC even before I attended university.

In fact, I also signed up in 2018, but I didn't submit a proposal since I
couldn't find my dream project nor organization. As I was still in my second
semester, I also felt my experience was lacking. Seeing the `JSONField` idea
the next year felt like **destiny**.

## 2. Get yourself out there

**Join** the organization's communication channels. Mailing lists, IRC, Slack,
Discord, whatever. Get to know the community. Find the people who are going
to be mentors. Read the organization's [**contributing guide**][contrib-guide].

If you found an issue/ticket that you can fix, go ahead and **fix it**! Having
contributed to the organization will obviously **increase your chances** of
getting selected.

## 3. Start early

Start working on a draft proposal as soon as you can. The sooner you write one,
the sooner your mentors can review it. **Don't wait until the last minute.**
Feedback from your mentors will help you plan your project. They might give you
ideas on how your project is best approached.

## 4. Have some confidence

You might think you're not capable. You might be having trouble writing your
proposal as you don't really know how you're going to implement it. Don't worry.
Do more research on your project. Ask your mentors and the community.
**Believe in yourself.**

### > Another backstory

Imagine a 2nd-year university student who's taking a Database Systems course.
That person has **never** actually executed an SQL query directly into a
client-server database terminal before that.

They've heard about

```sql
SELECT ... FROM ... WHERE ...
```

but they'd never done it themselves. Django's ORM helped them not to worry
about SQL.

Now imagine that someone, aiming to implement a `JSONField` for Django that
works on MariaDB, MySQL, PostgreSQL, SQLite, and Oracle Database. Yes, even
Oracle!

To top that, they hadn't even **tried** the postgres-only `JSONField`, nor
the other third party `JSONField` packages, nor the database systems other
than PostgreSQL and SQLite. I probably would think it's unlikely to happen.

But hey! **That person was me.** As you can imagine, writing my proposal wasn't
easy. I could imagine what the end product would look like. However, I _barely_
had an idea of how I was going to implement it.

I kept reading the docs of those DBMS. I could understand what each system's
JSON functions do on the database level. The thing is, I wasn't sure how to
"connect" them with the Python code.

Given that the submission period was also around midterm exams, I didn't have a
lot of time to do research. You're allowed to submit up to three proposals, but
I only submitted **one**. It was **all or nothing**.

## 5. Don't just wait

If you've submitted your proposal, don't just wait. You're not the only one who
submitted a proposal. Some may even submit more than one! Your mentors need time
to do the review. Use it to **show them you're the one**.

Find more issues to fix. Even the documentation ones! You can also create new
issues/tickets if you find something off. Just... **don't just wait ;)**

**FYI:** I submitted [my first PR][first-pr] to Django during the student
application period. I sent [another one][second-pr] the next day. As you can
see, they're both very small tickets, or "[easy-pickings][easy-pickings]"
as the Django folks call them.

However, I didn't stop there. Between the application period and the
announcement, I also wrote [a documentation ticket][first-ticket] and submitted
[a PR][third-pr] to fix it. Again, it's an easy-picking, but
**consistency is the key**.

---

> Let's take a short intermission.\
> If you've made it here, thanks a lot for reading!\
> And, if you made it through the selection, congratulations!\
> \
> Now, for the real deal: **working on the project**.

<a
  href="https://tenor.com/view/spongebob-squarepants-patrick-star-snow-winter-cold-gif-4769079"
  style="display: block; margin-left: auto; margin-right: auto; width: fit-content;">
<Image
    src="/img/uploads/shiver.gif"
    alt="Patrick shivering"
    title="I literally shivered when I found out I was accepted."
    width="500"
    height="278"
  />
</a>

It was around 04:00 AM. I woke up to a chat from my friend. He said,

> **Congrats**

I immediately checked the GSoC website. I was very excited to look at the
dashboard and saw that I got selected. I still couldn't believe it. I literally
**shivered**. I also found out that two of my friends also got accepted. It was
only the three of us from our university who submitted a proposal, so it was a
big relief to see that we all got selected.

Once you've got through the selection, you'll code for the rest of the summer.
However, there are some things I would advise if you want your journey to go
**smoothly**.

---

## 6. Communicate

In GSoC, you work on a project, **remotely**. There will be obstacles as you go
along the way. If you don't communicate with your mentors, they won't be able
to help you. They don't even _know_ what difficulties you are having.

So, please, **communicate** with your mentors. Use email, GitHub, Slack,
whatever.

**Don't disappear mid-project.** You're a programmer, not a magician.
<sup><sub>(Unless...?)</sub></sup>

## 7. Write a blog

Seriously, though, do it. Your blog posts will help you communicate with your
mentors and the community about how you're doing with the project. Tweet a
link to your blog. People **do** read them.

Don't worry too much about your English/writing. Despite some mistakes here and
there, people still get your idea most of the time. Some of them may even
provide ideas to help you.

If you have friends who are also participating in GSoC, that's great! You can
**share** each other's progress and maybe ask them for help. If not, you can
still write your progress on your blog and share it on social media.

Your blog will also be a part of your **portfolio**. Getting selected already
takes a lot of effort, make sure you make the most of it for your career as
well.

Also, the most important thing is, your blog will help you remember **how** you
implemented things in your project.

## 8. Read the docs **and** code

Most likely, you'll be using a lot of tools to work on your project. Some of
them you may not have used before. **Don't be lazy to read.** Read not only the
docs but the **code** as well.

You're working on an open source project. If you're adding a new feature, it's
likely that **studying the existing source code will help you** implement your
project.

I saved myself from a lot of hassle by reading the implementation of other
fields in Django's source code.

## 9. Have fun

It's your project. You're contributing to open source. People will use your
work. You get paid when you succeed. Can it get even better?

Yes, if you make it a **fun** experience.

You'll learn a lot over the course of your project and that's fun! However,
there may be times when it feels overwhelming.

It's okay to take a break for a while. Maybe play some video games. Watch some
movies. Read books. Anything, really. It's summer, you can still **have fun**!
Just make sure to relax **responsibly**.

Remember:

> All ~~work~~ **code** and **no play** makes Jack a **dull** boy.

---

Anyway, I think that's it for now. If you have any questions, feel free to ask
me! If you want to see my journey, checkout [**my GSoC blog**][gsoc-blog]. You
can also see [**my proposal**][proposal] and [**project page**][project-page].

I hope you find this useful!

> This post was previously written as [a thread on my Twitter][twitter-thread].

[gsoc]: https://g.co/gsoc
[django]: https://djangoproject.com
[orgs-list]: https://summerofcode.withgoogle.com/organizations
[django-tutorial]: https://docs.djangoproject.com/en/3.0/intro/tutorial01
[postgres-jsonfield]: https://docs.djangoproject.com/en/3.0/ref/contrib/postgres/fields/#jsonfield
[textfield]: https://docs.djangoproject.com/en/3.0/ref/models/fields/#textfield
[json.loads]: https://docs.python.org/3/library/json.html#json.loads
[json.dumps]: https://docs.python.org/3/library/json.html#json.dumps
[ideas-list]: https://code.djangoproject.com/wiki/SummerOfCode2019
[gci]: https://g.co/gci
[contrib-guide]: https://docs.djangoproject.com/en/dev/internals/contributing/
[first-pr]: https://github.com/django/django/pull/11133
[second-pr]: https://github.com/django/django/pull/11137
[easy-pickings]: https://code.djangoproject.com/query?status=!closed&easy=1
[first-ticket]: https://code.djangoproject.com/ticket/30326
[third-pr]: https://github.com/django/django/pull/11201
[gsoc-blog]: https://gsoc.laymonage.com
[proposal]: https://gist.github.com/laymonage/b53a1acbbab36b77776cd526b48fd2a5
[project-page]: https://summerofcode.withgoogle.com/archive/2019/projects/6436908320686080/
[twitter-thread]: https://twitter.com/laymonage/status/1240274106852839426
