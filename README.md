# UICG

## Develop

### Components

Components is templates in `/apps/cli/src/templates`. Create a `.astro` file in this directory. 

Go to `/apps/docs` and `node ../cli/cli.js add <component>` to add a component to the docs.

Add `/apps/docs/content/docs/components/<component>.md` to add the component to the docs.


### Docs

    npm run docs

## Versioning

Do your changes and commit.

### Adding changesets
    
    npx changeset

### Publishing

Once you decide you want to do a release, you can run

    npx changeset version

Review both the changelog entries and the version changes for packages. Once you are confident that these are correct, and have made any necessary tweaks to changelogs, you can publish your packages:

    npx changeset publish