# Chisimba UI Component Catalogue

## Purpose

The `ui` core module provides stable, framework-level user interface concepts.

Modules should request UI objects through Chisimba:

```php
$window = $this->getObject('window', 'ui');
```

Modules should not depend directly on ExtJS or another monolithic JavaScript
framework.

## Design rules

1. Keep component APIs small.
2. Prefer semantic HTML and browser-native behaviour.
3. Use progressive enhancement.
4. Integrate with the active skin and design tokens.
5. Require keyboard and accessibility support.
6. Keep rich-text editing in a separate editor service.
7. Do not reproduce every ExtJS widget.
8. Add a component only when a real Chisimba module needs it.

## Generation 1 — immediate migration components

| Component | Purpose | Native basis | Status |
|---|---|---|---|
| `window` | Modal or focused content container | `<dialog>` | Implemented |
| `tooltip` | Contextual help | ARIA + CSS | Implemented |
| `alert` | Persistent success, warning, error or information message | semantic status block | Next |
| `panel` | Grouped content section | `<section>` + design tokens | Next |
| `tabs` | Switch between related content views | buttons + ARIA tab pattern | Planned |
| `accordion` | Expand and collapse content | `<details>` / `<summary>` | Planned |

## Generation 2 — application components

| Component | Purpose | Native basis | Status |
|---|---|---|---|
| `toolbar` | Group related commands | semantic command group | Planned |
| `menu` | Navigation or action menu | `<nav>` / popover pattern | Planned |
| `toast` | Temporary non-blocking notification | live region + small JS helper | Planned |
| `pagination` | Navigate result pages | server-rendered links | Planned |
| `progress` | Show completion or activity | `<progress>` / status text | Planned |

## Generation 3 — complex data components

| Component | Purpose | Native basis | Status |
|---|---|---|---|
| `grid` | Sortable or selectable tabular data | accessible `<table>` + focused helper | Planned |
| `tree` | Hierarchical navigation or data | nested lists + ARIA tree where required | Planned |
| `datastore` | Load and retain remote records | `fetch()` + plain objects | Planned |
| `formdialog` | Form presented in a modal workflow | `window` + existing Chisimba form objects | Planned |

## Existing Chisimba objects

The new `ui` module should not duplicate good existing abstractions such as
forms, tables, buttons, links, labels and other `htmlelements` objects.

Those objects should eventually be reviewed and either:

- retained as stable presentation objects;
- adapted to the new design system; or
- gradually moved behind the `ui` namespace where that improves consistency.

## Migration principle

Migration is driven by real module requirements.

For each legacy ExtJS use:

1. identify the UI concept;
2. use an existing native component where possible;
3. add the smallest missing component;
4. migrate the whole caller;
5. remove its ExtJS assets and APIs;
6. add a regression check preventing reintroduction.

## Immediate proof

The first complete migration is:

```php
$tooltip = $this->getObject('tooltip', 'ui');
```

in `tooltipdemo`.

The next components should be selected from actual remaining callers, beginning
with alerts and simple panels before grids and complex forms.
