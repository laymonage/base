---
title: 'Git rebase: a quick explanation'
date: 2020-02-26T20:09:08.724Z
tags:
  - ppl
  - git
toc: false
draft: false
description: |-
  As a regular user of Git, I find one particular command
  to be extremely powerful. That command is…
image: /img/uploads/git-rebase-2.png
---

According to StackOverflow’s [annual developer survey][stackoverflow-survey],
Git is the most popular version control system for developers, with almost 90%
of them checking in their code via Git. As a regular user of Git myself, I find
one particular Git command to be extremely powerful. That command is…

```
git rebase
```

### **What** is it, really?

To quote the [Pro Git book][progit-branching-rebasing],

> In Git, there are two main ways to integrate changes from one branch into
> another: the `merge` and the `rebase`.

You may have heard about or used `git merge`. What about `git rebase`?

To take it literally, “rebasing” means “to replace the base of something”. In
this case, we’re replacing the “base” of some commits so that they are reapplied
on top of another base tip. I believe it’s easier to understand if I demonstrate
it, so here it is.

Let’s start with `git merge` first. Let’s say you’ve created a new branch called
`experiment`, and you’ve diverged your work by creating different commits on
`experiment` and `master`.

![Note that each commit in Git (except the initial commit) has a reference to its parent commit(s).](/img/uploads/git-rebase-0.png 'Note that each commit in Git (except the initial commit) has a reference to its parent commit(s).')

Now, let’s say you want to integrate your changes on `experiment` into `master`.
The easiest way to do this is to use `git merge`. It will merge the two latest
branch states (“snapshots”, in this case, `C3` and `C4`) and the most recent
common ancestor of the two (`C2`), creating a new snapshot and a **merge**
commit.

![C5 is the merge commit.](/img/uploads/git-rebase-1.png 'C5 is the merge commit.')

However, there’s another way. You can take the changes you’ve made on
`experiment` and reapply them on top of `C3`. That’s what we call a `rebase`. In
this case, you can check out the `experiment` branch and **rebase** it onto
master.

### **How** to do it?

Here’s how:

```bash
$ git checkout experiment
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: C4
```

When you rebase, Git will go to the common ancestor of the two branches, saving
the changes you’ve made in each commit on `experiment` into temporary files,
resetting `experiment` to the same commit as `master`, then reapplying each
commit in turn.

![The result of rebasing the experiment branch onto master.](/img/uploads/git-rebase-2.png 'The result of rebasing the experiment branch onto master.')

After that, you can go back to `master` and do a `git merge`, which will be a
fast-forward merge since the base of `experiment` is now directly ahead of
`master`.

```bash
$ git checkout master
$ git merge experiment
```

![Fast-forwarding the master branch.](/img/uploads/git-rebase-3.png 'Fast-forwarding the master branch.')

The snapshot of the end result pointed by `C4'` is exactly the same as the one
pointed by `C5` (in the first merge example). However, `C4'` and `C4` now have
different hashes because their parent commit is different. For `C4` it’s `C2`,
but for `C4'` it’s `C3`. If you’ve previously `push`ed your `experiment` branch
and you want to `push` the rebase result, you’ll need to use `--force`, because
you’ve **rewritten the commit history**.

### **Why** all the hassle?

It’s true that using `git merge` is easier than using `git rebase`. So, why
should you use `rebase`?

The answer is, _you don’t have to_. However, rebasing makes your commit history
much **cleaner**. If you look at the above examples, you’ll notice that the
rebase result looks like a linear history. It looks as if the work you did on
`experiment` happened in series, even when it originally happened in parallel.

One would argue that rebasing is _blasphemy_ because it rewrites your commit
history and you’re _lying_ about what actually happened. On the other hand, one
could also argue that rebasing allows people to understand your project history
more easily because there won’t be a lot of messy merge commits in it. It’s up
to you to decide which side you’re on.

### **When** to use it?

I’ll just quote the Pro Git book again.

> **Do not rebase commits that exist outside your repository and that people may
> have based work on.**

> If you follow that guideline, you’ll be fine. If you don’t, people will hate
> you, and you’ll be scorned by friends and family.

However, in my experience of contributing to open source projects on GitHub,
most project maintainers suggest using `rebase` when you need to catch up with
the project’s `master` branch. Therefore, the commit history of your Pull
Request will only contain your changes that would be incorporated into the
project, making it easier to review.

One particular part of `git rebase` that I love is the `--interactive` mode.
With the interactive mode, you can do different things such as amending,
squashing, or even dropping some commits when they are reapplied. This is very
useful if you made a mistake or just want to build your commit history
differently.

![git rebase --interactive](/img/uploads/git-rebase-4.png 'git rebase --interactive')

Another thing to note is that `git rebase` can’t only be used to work with
branches. You can also pass a [Git reference][progit-git-internals-git-references]
or a commit hash as the argument instead of a branch. Therefore, you can use
something like `git rebase HEAD~3 --interactive` to be able to modify up to the
last three commits from your current `HEAD`. This is very useful when you need
to fix some mistakes in past commits, something I often do when working on my
local repository.

Now that you’ve learned the power of `git rebase`, I just want to end this post
with:

> Please use it wisely :)

**Reference:** \
[ProGit: Branching - Rebasing][progit-branching-rebasing]

> **Note:** \
> This article was written as part of a series for my Software Engineering
> Project (Proyek Perangkat Lunak, [PPL][ppl]) course. This article was first
> published on [Medium][medium] under a different title. I decided to write
> the whole series on my own blog, so I moved it here.

[stackoverflow-survey]: https://insights.stackoverflow.com/survey/2018/#work-_-version-control
[progit-branching-rebasing]: https://git-scm.com/book/en/v2/Git-Branching-Rebasing
[progit-git-internals-git-references]: https://git-scm.com/book/en/v2/Git-Internals-Git-References
[medium]: https://medium.com/@laymonage/40709ebb4ec2
[ppl]: /tags/ppl
