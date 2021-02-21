---
title: Django's Git flow
date: 2020-06-03T01:52:43.000Z
tags:
  - django
  - git
toc: false
comments: true
draft: false
description: 'Django uses Git to manage its codebase, but how?'
image: /img/uploads/django+git.png
---

![The web framework for perfectionists with deadlines, and the version control system.](/img/uploads/django+git.png "The web framework for perfectionists with deadlines, and the version control system.")

Like pretty much every popular open source project nowadays,
[**Django**][django] uses [**Git**][git] to manage its code base. It's hosted
on [**GitHub**][github] and you can see how new code gets merged into the
repository.

There are plenty of ways to use Git, such as [Gitflow][gitflow] or
[trunk-based development][tbd]. Well, how does Django use Git?

Before jumping into that, I'd like to talk a bit about how Django manages
the work on the code base.

As you can see, there's no **Issues** tab on Django's GitHub repository.
Instead of GitHub Issues, Django uses [**Trac**][trac] to manage tickets.
Most of Django's workflow is based around the concept of a ticket’s triage
stages. The contributing guide has a nice diagram for that:

<a target="_blank" rel="noreferrer noopener nofollow" href="https://docs.djangoproject.com/en/dev/internals/contributing/triaging-tickets/#how-can-i-help-with-triaging">
	<img src="/img/uploads/triage_process.svg" alt="The triage process." title="The triage process." class="w-full sm:w-8/12" loading="lazy">
</a>

In short, the stages are:

- **Unreviewed**: the ticket hasn't been reviewed by anyone felt qualified to
  mark it as a valid issue, a viable feature, or invalid.
- **Accepted**: the main stage. The ticket is valid. Some flags may be added
  to add more information, such as:
  - **No flags**: no patch has been submitted. Most likely, you can safely
    start writing the patch for it.
  - **Has Patch**: a patch has been submitted, waiting for review.
  - **Has Patch + Needs …**: the ticket and patch have been reviewed, and
    have been found to need further work. That can either be **"Needs tests"**,
    **"Needs documentation"**, or **"Needs improvement"**.
- **Ready For Checkin (RFC)**: the ticket has been reviewed by any member of
  the community (other than the one who submitted the patch) and found to
  be ready to be merged. A committer (people with commit access to Django's
  main repository) needs to do a final review and merge it if it passes.

> There is another stage **Someday/Maybe** for long term feature requests but
> it's uncommon (hence not shown on the diagram). There are also other flags
> to describe a ticket, such as **"Easy pickings"**, **"Component"**,
> **"Version"**, etc. but I won't go into details. You can read more about
> [triaging tickets][triaging] in Django's docs.

> [**Security issues**][security] aren't handled on Trac. Instead, they should
> be reported to [**`security@djangoproject.com`**][security-email].

Now, let's get back to Git. In Django's repository, you can see that there are
several [branches][branches]:

- **`master`**: contains the main in-development code. This will be the next
  packaged release of Django. Most development activity is focused here.
- **`stable/A.B.x`**: branches where release preparation work happens. They're
  used for bugfix and security releases as necessary after the initial release
  of a **feature version**.

If you're unfamiliar, Django's versions are numbered in the form of **`A.B`**
or **`A.B.C`**:

- **`A.B`** is the **feature release** version number. Each version is mostly
  backwards-compatible with the previous release otherwise noted in the release
  notes. New version is released roughly every eight months.
- **`C`** is the **patch release** version number, incremented for bugfix and
  security releases.

If you want to submit a patch for the first time, you'll need to [fork][fork]
Django into your GitHub account and create a new branch. Most of the time,
you're writing a patch for a ticket. It's common to use **`ticket_xxxxx`** as
the name of your new branch. You should create the new branch from the branch
you're targeting. So, if you're fixing a bug that still exists on the
**`master`** branch, you should create your new branch from there.

> Sometimes, you may need to write a patch for a specific (but still supported)
> feature release of Django. This may happen if the bug no longer exists on the
> **`master`** branch. If that's the case, you should create your branch from
> the **`stable/A.B.x`**.

From there, you just need to write your patch and create a commit. Then, push
the commit to your fork of the repository. After that,
[**create a pull request**][pull-request] to the target branch in Django's
main repository.

> As with tickets, security patches should be submitted via
> [**email**][security-email], not a Pull Request.

Once your pull request is made, you should update the Trac ticket with a link
to the PR and add the appropriate flags (such as **"Has patch"**). Hopefully,
folks from the Django community will review your patch and continue the triage
process. You can continue adding commits and pushing them to your fork as
needed, and the PR will be updated automatically.

When your pull request is ready to be merged, you would most likely be asked
to [**squash**][squash] your commits. If you're unfamiliar with it, the
committers would do it for you (very nice of them!).

Finally, a committer would merge your branch into the target branch. This is
done with the [rebase-and-merge][rebase-merge] strategy so that it's merged
without a merge commit. If it's applicable, your commit(s) will be
**backported** into the previous (still supported) feature release branches.
If I'm not mistaken, this is done using Git's [**`cherry-pick`**][cherry-pick]
feature. You don't need to do anything for this, that's the committer's work.
They'll also reword the commit message with the **`[A.B.x]`** prefix to note
that it's a backport.

To illustrate, you can see the following graph of Django's repository snapshot
I took at the time of this writing.

<iframe
  width="100%"
  height="320"
  src="https://gitgraphs-django.laymonage.com">
</iframe>

You can see that commits like `Fixed typo in docs/ref/templates/language.txt.`
was first seen on **`master`**, then it got backported into **`stable/3.1.x`**,
**`stable/3.0.x`**, and **`stable/2.2.x`**. The "same" commit has different
hashes on each branch for [a number of reasons][git-hash], including:

- Each branch has diverged from master, so the parent commit of that typo fix
  is different.
- The commit message is different (the backports have the **`[A.B.x]`**
  prefix).
- The commit timestamp is different (based on the time the committer did
  `cherry-pick`).

You can also see that not all patches get backported to other previous
releases, such as
`Fixed #31643 -- Changed virtualenv doc references to Python 3 venv.` that
didn't get backported to **`stable/2.2.x`**.

If your pull request has been merged, congratulations! Now, you just need to
wait until the next release of Django to include your patch.

While it's often the case, a pull request does not need to be associated with
a ticket. If you're adding small improvements to the docs (fixing typos, etc.),
you don't need to write a ticket. You can also utilize GitHub's
[**draft PR**][draft] feature to demonstrate a proof-of-concept and provide a
more concrete look of your idea (while also discussing it on Trac and/or the
[django-developers][django-developers] mailing-list).

Now that you've understood how Django's Git flow works, why not take on the
[**tickets**][tickets] on Trac, and **help your web framework grow**?
[**Your web framework needs you!**][your-web-framework-needs-you] ;)

[django]: https://djangoproject.com
[git]: https://git-scm.com
[github]: https://github.com/django/django
[gitflow]: https://nvie.com/posts/a-successful-git-branching-model
[tbd]: https://trunkbaseddevelopment.com
[trac]: https://code.djangoproject.com
[triaging]: https://docs.djangoproject.com/en/3.0/internals/contributing/triaging-tickets
[security]: https://docs.djangoproject.com/en/dev/internals/security
[security-email]: mailto:security@djangoproject.com
[branches]: https://github.com/django/django/branches
[fork]: http://github.com/django/django/fork
[pull-request]: https://github.com/django/django/pull/new/master
[squash]: https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#_squashing
[rebase-merge]: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#rebase-and-merge-your-pull-request-commits
[cherry-pick]: https://git-scm.com/docs/git-cherry-pick
[git-hash]: https://gist.github.com/masak/2415865
[draft]: https://github.blog/2019-02-14-introducing-draft-pull-requests
[django-developers]: https://groups.google.com/forum/#!forum/django-developers
[tickets]: https://code.djangoproject.com/query
[your-web-framework-needs-you]: https://www.youtube.com/watch?v=1BFjg9XtptM
