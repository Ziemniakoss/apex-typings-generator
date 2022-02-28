# Rich apex typings generator

![Image showing completions](images/apexgenerator.png)

Unofficial rich apex typings generator.
Based on my other [project](https://github.com/Ziemniakoss/apex-sobjects-typings-generator) that won't be maintained due to complications with the worst OS ever, windows.

## Why and What it does?

### What it does?

This plugin overrides (or creates) files used by official apex language server stored in .sfdx folder of project.
Currently, folders used for completions by this server are stored in:

-   .sfdx/tools/sobjects/standardObjects
-   .sfdx/tools/sobjects/customObjects

and for soql completions:

-   .sfdx/tools/soqlMetadata/stadardObjects
-   .sfdx/tools/soqlMetadata/customObjects

### Why?

Unfortunately, only supported editor for automatically generating these typings is VS Code, which is bloated, slow, ugly, asks to install tons of useless plugins all the time and lacks good vim emulation.
Without this tool, apex completions in other editors with language server support, like nevim or vim with CoC, are almost impossible.

## How to install

```
sfdx plugins:install sfdx-apex-typings-generator
```

## How to use

```cmd
sfdx apex-typings:sobject -s Account,Contact,Address,Ship__c
```

To remove existing typings for all typings, add -r flag

## Planned

-   installed package indexing (tricky due to high RAM usage and lack (at least for now) of good parser for apex)
