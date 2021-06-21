# Guidelines

## CSS

Use BEM http://getbem.com/introduction/

Use our Grid for layouts (below)

Use margin bottom for margins (i.e. a simple standard to avoid margin collapsing https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)

### CSS Grid

We have a 12 column grid convention, which is based on the conventions in Bootstrap CSS, but actually uses [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) under the hood.

The convention is:

You'll need at least 1 row, which creates a 12 column grid

```html
<div class="row"></div>
```

Then within that row you specify your columns

```html
<div class="col-1">This div spans 1 column in a 12 column row</div>

<div class="row">
  <div class="col-4">This div spans 4 columns in a 12 column row</div>
  <div class="col-4">This div spans 4 columns in a 12 column row</div>
  <div class="col-4">This div spans 4 columns in a 12 column row</div>
</div>

<div class="row">
  <div class="col-12">This div spans 12 columns in a 12 column row</div>
</div>
```

Please take a look at the examples in the code; for example view-cashflow-files or create-entity

## Greensill Styling

We're using Angular Material with Greensill styling, as per the creatives:

- https://app.axure.cloud/app/project/kfcxcp/overview
- https://www.figma.com/file/9coN4HuLlclKGQdmAoL9H6/Greensill-Components

The Greensill Angular Material Theme is in `src/app/styles/material/ops-portal-theme.scss`

Overrides for material components are in `src/app/styles/material/overrides` (You do not need to import this files into component-level.scss)

The Greensill colour pallet is defined in `src/app/styles/palette.scss`

Css that is common across all pages is in `src/app/styles/common.scss` and the .scss files it imports. (You do not need to import these file into component-level scss)

## Components

Reusable components reside in the shared module; `src/app/shared/components`. They are styled components; they have their styling set at the angular component level. The goal is to make development of new pages quicker through reuse; please refactor repeatable "things" on multiple pages into reusable components as you go. The usual rules apply - single responsibility, tested in isolation, etc.

## Building Pages

So, when building a pages in the feature module:

You should not need component-level styling e.g. styling a button or form field, and so classes on such things should be at a minimum.
You might need page-layout styling using css grid and margins/padding on block-level page elements like `section`. Only use `div` if you there isn't a sematic tag https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Content_sectioning

You should split up a feature component into sub components, each with a single responsibility. E.g. Splitting up a form from the page.

As above, if suitable make reusable components in shared components, or put reusable styling in common.scss and the related .scc files it imports (e.g. table-toolbar)

## Testing

When doing test driven development you can achieve most of your testing using functional BDD-style unit tests in jest. We're also standardising on using helper libraries like ng-mocks, and we have test utilities in `/src/app/shared/utils/test`

E2E tests are done using cypress but they should be kept to a minimum as they are much slower than jest test; this repo is a "monolith" and too many such tests lead to very slow execution times.

You can view coverage reports for both unit tests, cypress tests and combined in `/reports`

Finally, these guidelines will change over time to please keep updating for the many devs working in this repo :-)
