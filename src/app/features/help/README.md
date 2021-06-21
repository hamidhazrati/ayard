# How to manipulate help feature content

<!-- no toc -->

- [1. Config](#1-config)
  - [1.1. Help item](#11-help-item)
  - [1.2. Accordions](#12-accordions)
  - [1.3. Intro modal](#13-intro-modal)
  - [1.4. Home page](#14-home-page)
  - [1.5. Binding help item to specific route](#15-binding-help-item-to-specific-route)
- [2. Markdown as help item content](#2-markdown-as-help-item-content)
  - [2.1. Links](#21-links)
    - [2.1.1. Relative links](#211-relative-links)
    - [2.1.2. Absolute link](#212-absolute-link)
    - [2.1.3. Link to another markdown](#213-link-to-another-markdown)
    - [2.1.4. Link to file](#214-link-to-file)
  - [2.2. Video](#22-video)
- [3. Developer guide](#3-developer-guide)
  - [3.1. How to set up](#31-how-to-set-up)
  - [3.2. Limitations](#32-limitations)

# 1. Config

## 1.1. Help item

`items` in `help.config` is responsible for the collection of help items. Example:

```
"items": [
    {
      "path": "assets/help/markdown/about.md",
      "description": "Lorem ipsum dolor sit amet consectetur",
      "title": "About",
      "nestedItems": [
        {
          "title": "What is Verdi?",
          "path": "assets/help/markdown/home.md"
        },
        {
          "title": "Contacts",
          "path": "assets/help/markdown/contacts.md"
        }
      ]
    },
    {
      "routes": ["/partners"],
      "path": "assets/help/markdown/instruction.md",
      "description": "Lorem ipsum dolor sit amet consectetur",
      "title": "Instruction"
    }
  ],
```

## 1.2. Accordions

Each markdown page can contain accordions at the bottom of the page. `nestedItems` of the corresponding help item is repsonsible for it. Example:

```
"nestedItems": [
    {
      "title": "What is Verdi?",
      "path": "assets/help/markdown/home.md"
    },
    {
      "title": "Contacts",
      "path": "assets/help/markdown/contacts.md"
    }
  ]
```

## 1.3. Intro modal

It is an introduction modal that appears any time a new user visits the web-resource. It can be set up in `introModal` section. Example:

```
"introModal": {
    "path": "assets/help/markdown/intro-modal.md",
    "title": "What is Verdi?"
  }
```

## 1.4. Home page

It is a markdown page that appears under the collection of the help itmes.
`homeItem` is in charge of it:

```
"homeItem": {
    "path": "assets/help/markdown/home.md"
  },
```

## 1.5. Binding help item to specific route

If you need to bind help items with pages use `route` property. Routes should be relative without domain host section. For example, `https://dev1-operations-portal.development.gcpfidn.net/partners` consists of `/partners` relative section that should be added to `route` in order to make the connection between the page and a specific help item.

Example:

```
{
  "path": "assets/help/markdown/contacts.md",
  "description": "Lorem ipsum dolor sit amet consectetur",
  "title": "Contacts"
  "route": "/page2"
}
```

Binding to a route with a dynamic parameter:

```
{
  "path": "assets/help/markdown/contacts.md",
  "description": "Lorem ipsum dolor sit amet consectetur",
  "title": "Contacts"
  "route": "/page2/.*"
}
```

where **`.*`** is responsible for one dynamic parameter. Next routes will match the pattern above:

`/page2/1233`

`/page2/qwer3-fdse3-fds2-awe3`

If you need to resolve different documents for similar rotes, for example

first
`url - /cashflows/files, route - /cashflows/files/.*`

second
`url - /cashflows/files/some_id/proposal/some_info, route - /cashflows/files/.*/proposal/.*`

You have to place more specific route first in `items` array, for our example it should be second item.

## 1.6. Items on home page

If you want to show items on the home page you should provide following flag with true value in help item

```
{
    "isAvailableOnHomePage": true
}
```

# 2. Markdown as help item content

Help item content is [\*.md file format](https://www.markdownguide.org/). Some additional components may be added:

## 2.1. Links

### 2.1.1. Relative links

It should be used for the resources lied in `assets` folder. Example of the relative link:

```
[img.png](./assets/help/media/image.png)
```

### 2.1.2. Absolute link

It can lead to any external resources. The full path should be specified. Example:

```
[external resource](https://duckduckgo.com/resource)
```

### 2.1.3. Link to another markdown

This link is useful in terms of navigation within help feature. Clicking on it doesn't open a new page in the browser. It opens a new markdown page in help feature instead. **It must end with `.md`**. Example:

```
[another markdown](https://externalhost.com/markdowns/clients.md)
```

The link can be either relative or absolute.

### 2.1.4. Link to file

Help feature renders an appropriate icon near next types of files:

- xls;
- csv;
- json;
- pdf;
- doc, docs;
- tiff, png, jpeg;
- zip.

An appropriate icon will be shown only if the title of the link contains the extansion of the file. In the next example the type of the file is `pdf`:

```
[file.pdf](https://greensillcapitalptylim.sharepoint.com/:b:/r/sites/helpfeature/Shared%20Documents/file.pdf?csf=1&web=1&e=Ci6oJs)
```

The link can be either releative or absolute.

## 2.2. Video

Video can be easily added as `iframe`. You should export a video as HTML embedded block (IFRAME) and insert it into a markdown file. Please, pay attension on setting sizes for `iframe` element. To get a nice view, the width should not be more than 350px. Example:

```
<iframe width="320" height="240" src="https://web.microsoftstream.com/embed/video/48020c6a-9443-4eef-8a93-894c261e8edb?autoplay=false&amp;showinfo=true" allowfullscreen style="border:none;"></iframe>
```

# 3. Developer guide

[Confluence page](https://confluence.greensill.cloud/display/GIS/Help+feature) contains information regarding spikes, approaches, requirements, delivery steps.

[Epic in JIRA](https://jira.greensill.cloud/browse/GDS-410)

Help feature is based on the config, that is responsible for what we can see in help feature depends on the opened web page. The config allows to set up intro modal and home page as well.

## 3.1. How to set up

You should import `HelpModule` into the root module and provide a path to the [config](#1-config):

```
// app.module.ts

@NgModule({
  imports: [
    HelpModule.forRoot({ configPath: 'assets/help/help.config.json' }),
  ]
})
```

## 3.2. Limitations

Current implementation is based on front end resources. It means that we do not have a dedicated API. In terms of search functionality, it is a major drawback because we have to preload all available for the proejct `.md` files and execute searching on them. It can be a problem if there are more then 100 `.md`. Processing a lot of `.md` files in background can lead to ui freazing and unhappy users.
