# Crawl Transparence Sante

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.
Make sure you have [PhantomJS](http://phantomjs.org/) installed.
Make sure you have [CasperJS](http://casperjs.org/) installed.

```sh
git clone git@github.com:dadtmt/crawl-transparence-sante.git
cd crawl-transparence-sante
casperjs crawl.js
```

Your app should now be running on [localhost:1337](http://localhost:1337/).

## Principles

### Creator role

A creator creates a story.

A story is made of pages.

A page contains many solutions.

Each solution leads to a target page.

### Player role

A player plays a story.

He gets the first page and then click on a solution that will display the target page.

When a player asks for a page or click a solution, the page may not exist or the solution may not have a target page. In this case the StoryHandler class will serve the page when the creator will create the page or link a target page to the solution.

## What is working

- Story creation with pages and solutions
- Playing to story

## Issues to fix in near future

- StoryController should not instantiate story, page or solution => make factories used in StoryHandler
- Write proper tests in StoryHandler and indexController (find a test framework)
- indexCreated should be named id (indexCreated wtf)

## Next tasks

- Show to the story creator the players actions
- MongoDb
