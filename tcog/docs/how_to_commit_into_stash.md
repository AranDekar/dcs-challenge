
# Git practices for TCOG

The below is an overview of how we use git (Stash) to take on new work and share it with the team.

Make a Pull Request for everything - features, docs, etc. - except incrementing a TCOG version in package.json. That's done on master.

At times we have broken this rule to accomodate an emergency. We generally regret doing so.

Although at times we may deploy feature branchs to non-prod TCOG stacks to support the business, the master branch is what we use for production.

## Naming your Branch

Use a branch prefix that maps to the purpose of your branch. 

`feature/add-the-livefyre-API`
`bugfix/replace-brightcove-with-video-integrator`
`tweak/uat-uses-c3s`
`new-stack/tcog-prd3`

We don't have strict rules about what makes sense as a prefix, sometimes new ones emerge, but the four above should get you a fair way.

## Feature Branches and Rebasing

We use a 'feature branch' strategy for git. It means you can work on a particular branch in isolation however you like, using rebases to keep in sync with changes on the master branch. 

Finally, when you are happy with your work, you should run a final interactive rebase (see below), which allows all of your changes to appear as one git commit change with a meaningful message for the git log. Only bringing one commit into master keeps it simple for us to track changes.

An example git log:

```
commit e0d5ec37f1170b787bbbcd7b4e4c77435da6f816
Author: Nicholas Faiz <nicholasf@mngl1002224.news.newslimited.local>
Date:   Tue Feb 28 09:50:24 2017 +1100

    v4.18.0
    
    * Remove counting stream from logs and health check
    * Worker lib no longer requires analytics.
    * Remove logstash from the sqs listener
    * Remove analytics from, invalidator
    * Replace logging in agent from logstash analytics to bunyan logger. Only log errors
    * Refactor analytics out of deprecate-params
    * Remove analytics/bench from template_loader
    * Removed analytics
    * Remove opsgenie
    * Remove analytics redis from config
    * Redis connection timeout set to 20 seconds, tcp-keepalive 300 (as the default value for 3.2.4)

```

The above was a large codebase refactor, so it touched on many points. Shorter descriptions of work are okay too.

## Example flow of a Feature Branch

`git checkout -b feature/vidora-integration`

You make any number of commits on your branch. A few "WIP" commit messages, etc..

At some stage you want to bring in changes from master.

Run `git log` and count `n` the number of git commits you've made.

### Squashing up via rebase

Squashing up means you will combine a number of commits into one commit. You use this to bring together all your commit messages.

Let's say `n`=5.

`git rebase -i HEAD~5` 

You will see a list of git commits. For each one except the very top specify `s`.

For example:

```
pick c483b286 tweak: update video documentation for capi v2
s 40a1b7d0 The Vidora prototype.
```

Where I am 'squashing up" from 40a1b7d0 into c483b286. Another way of saying it is ensure that the top line is left with pick but the other lines begin with an s.

Save this and then decide how to craft your log messages into a single meaningful one.

### Rebasing against master

Then run `git rebase master`.

If you open the git log and look, you will see your commit is at the top of the tree, with the latest changes from master beneath it.

If you have run into conflicts you will need to resolve them then `git rebase --continue`. At any stage you can `git rebase --abort` if you are unhappy with how a conflict was resolved.

By following this process you can continually work on your branch and hone it, rebasing against master to get its lastest work.

### Ready for a PR

When you are ready to submit a PR run a `git push` and follow the instructions Stash will give you.

```
♪  tcog git:(docs/how-to-stash) ✗ git push
fatal: The current branch docs/how-to-stash has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin docs/how-to-stash
```

After running `git push --set-upstream origin docs/how-to-stash` Stash responds with a URL that will let me create a PR.

```
remote: Create pull request for docs/how-to-stash:
remote:   http://stash.news.com.au/projects/TCOG/repos/tcog/compare/commits?sourceBranch=refs/heads/docs/how-to-stash 
```

## Pull Requests

Pull Requests are a well documented convention in the programming world these days. Some internal conventions we use are:

* be time effective, if the reviewer suggests several small tweaks but is otherwise happy with the code, then it's good to merge as soon as the small tweaks are done (no need for another round of formal review).
* the owner fo the PR is responsible for keeping the branch up to date (rebased) against master (so it's also good for the reviewer to be efficient about reacting to new PRs).

## General Dos and Donts

* Do use PRs as a place to discuss best practices and ideas. PRs mean at least two devs have agreed with new code and open up a space of conversation.
* Don't form new feature branchs of other feature branches. Sometimes this creates a chain of dependencies that haven't been agreed to by another team member. It's always best to branch off master.
