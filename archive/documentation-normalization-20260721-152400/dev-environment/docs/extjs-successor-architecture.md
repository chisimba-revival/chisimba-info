# ExtJS Successor Architecture

## Status

This document converts the July 2026 ExtJS reconnaissance into an incremental
replacement architecture for Chisimba.

The current system has a valuable service boundary:

```php
$objExtJS = $this->getObject('extjs', 'ext');
$objExtJS->show();
```

The `extjs` class is primarily an asset loader. It is not the source of most
application behaviour. Module templates and JavaScript files still contain
direct `Ext.*` APIs.

## Confirmed current architecture

Primary shared service:

```text
framework/app/core_modules/ext/classes/extjs_class_inc.php
```

Legacy duplicate loader:

```text
framework/app/core_modules/htmlelements/classes/extjs_class_inc.php
```

Current shared service responsibilities:

1. read the configured ExtJS theme;
2. choose the standard or Prototype adapter;
3. load JavaScript and CSS assets;
4. append those assets to `headerParams`.

The service currently loads ExtJS 3.4.0. Many older modules bypass it and load
ExtJS 3.0 RC2, 3.0.0, or 3.0.3 directly.

Generated source counts:

- modules referencing the shared service: **10**
- modules containing direct `Ext.*` APIs: **18**
- modules loading ExtJS assets directly: **20**
- high-priority migration modules: **10**
- medium-priority migration modules: **13**
- wrapper-only low-risk modules: **2**
- modules with separate editor dependencies: **75**

The detailed inventory is in:

```text
dev-environment/docs/extjs-migration-inventory.csv
```

## Decision

Do not perform a system-wide “replace ExtJS” rewrite.

Instead, replace the **Ext service boundary** while preserving its existing
object lookup during the transition.

The migration must distinguish four concerns:

1. JavaScript and stylesheet asset loading;
2. Chisimba UI component helpers;
3. module-specific interactive behaviour;
4. rich-text editor integration.

Editors are not part of the ExtJS replacement and must have a separate
migration path.

## Proposed successor

### Transitional identity

Retain the existing lookup:

```php
$this->getObject('extjs', 'ext');
```

Retaining this lookup prevents unnecessary changes in wrapper-only modules.

The implementation should become a compatibility facade whose responsibility
is broader than ExtJS but whose initial API remains compatible.

Suggested class role:

```text
Chisimba UI asset and compatibility service
```

A future clean name may be `uiservice`, but renaming the object should happen
only after ExtJS consumers have been migrated.

### Compatibility API

The successor should initially retain:

```php
init()
show($type = UI_STANDARD)
```

It should add explicit methods rather than forcing modules to concatenate
script and link tags:

```php
loadCore()
loadComponent($component)
loadModuleAssets($module, array $assets)
addScript($uri, $defer = true)
addStylesheet($uri)
addInlineScript($script)
addInlineStyle($style)
```

During migration, `show()` should delegate to `loadCore()`.

### Compatibility modes

The service should support explicit modes:

```php
UI_NATIVE
UI_EXTJS_LEGACY
UI_EXTJS_WITH_PROTOTYPE
```

`UI_NATIVE` must become the default for new work.

`UI_EXTJS_LEGACY` should load ExtJS only for pages that still require it.

The service must not load ExtJS globally.

### Native foundation

The successor should prefer browser-native capabilities:

- semantic HTML;
- CSS Grid and Flexbox;
- `<dialog>` for modal interactions where supported;
- `fetch()` for HTTP requests;
- `FormData`;
- native form controls;
- small, documented JavaScript helpers;
- progressive enhancement.

No new monolithic JavaScript framework should replace ExtJS at framework level.

A narrowly-scoped library may be adopted for a component only when native
browser APIs would create excessive complexity or accessibility risk.

## ExtJS concept mapping

| ExtJS concept | Successor direction |
|---|---|
| `Ext.onReady` | `DOMContentLoaded` or deferred modules |
| `Ext.QuickTips` / `Ext.ToolTip` | native accessible tooltip helper |
| `Ext.form.FormPanel` | semantic `<form>` plus validation helper |
| `Ext.form.TextField` | native `<input>` |
| `Ext.form.TextArea` | native `<textarea>` |
| `Ext.form.DateField` | native date input with progressive fallback |
| `Ext.form.HtmlEditor` | separate editor service |
| `Ext.grid.GridPanel` | accessible table plus optional data-grid helper |
| `Ext.data.Store` | `fetch()` plus plain objects |
| `Ext.PagingToolbar` | server-driven pagination component |
| `Ext.Window` | `<dialog>`-based modal component |
| `Ext.Panel` | semantic section/card component |
| `Ext.Msg.alert` | accessible notice or dialog helper |
| `Ext.XTemplate` | server rendering or small template function |
| `Ext.Resizable` | CSS resize or focused helper |
| `Ext.state.CookieProvider` | explicit preference storage service |

## Migration layers

### Layer 1 — establish the service seam

1. document both existing ExtJS loaders;
2. designate `core_modules/ext` as the only supported legacy loader;
3. mark `htmlelements/classes/extjs_class_inc.php` deprecated;
4. introduce compatibility mode constants;
5. make duplicate asset inclusion impossible;
6. add diagnostic logging in development when legacy mode is used.

This layer must preserve current behaviour.

### Layer 2 — eliminate direct asset loading

Replace module code that manually loads:

```text
ext-all.js
ext-all.css
ext-base.js
```

with calls to the compatibility facade.

This is primarily mechanical and can be moderniser-assisted.

After this layer, one service controls whether ExtJS is present on a page.

### Layer 3 — migrate simple direct APIs

Start with:

- `Ext.onReady`;
- tooltips;
- alerts;
- simple text and date fields;
- basic panels.

These have low-risk native replacements.

### Layer 4 — migrate complex components

Handle separately:

- grids;
- data stores;
- paging;
- windows;
- complex form panels;
- state persistence;
- HTML editor usage.

Each component should be replaced with a documented Chisimba-native component,
not ad hoc module code.

### Layer 5 — remove legacy assets

Only after no source references remain:

1. remove ExtJS 3.0 RC2 assets;
2. remove ExtJS 3.0.0 and 3.0.3 copies;
3. remove ExtJS 3.4.0;
4. remove the legacy `htmlelements` loader;
5. rename or retire the transitional `ext` service.

## Migration priority

### High priority

These have the heaviest direct coupling or repeated direct asset loading:

- `activitystreamer` — API refs: 0; direct asset refs: 15; top file: `n/a`
- `efl` — API refs: 8; direct asset refs: 12; top file: `efl/templates/content/home_tpl.php`
- `fossad` — API refs: 19; direct asset refs: 9; top file: `fossad/templates/content/memberlist_tpl.php`
- `gift` — API refs: 13; direct asset refs: 6; top file: `gift/templates/content/edit_tpl.php`
- `jukskei` — API refs: 5; direct asset refs: 6; top file: `jukskei/classes/contentmanager_class_inc.php`
- `liftclub` — API refs: 7; direct asset refs: 10; top file: `liftclub/templates/content/messages_tpl.php`
- `resdevelopment` — API refs: 4; direct asset refs: 12; top file: `resdevelopment/templates/content/Edit_tpl.php`
- `simpleregistration` — API refs: 86; direct asset refs: 24; top file: `simpleregistration/templates/content/eventlisting_tpl.php`
- `speak4free` — API refs: 5; direct asset refs: 6; top file: `speak4free/classes/contentmanager_class_inc.php`
- `wicid` — API refs: 10; direct asset refs: 14; top file: `wicid/templates/content/admin_tpl.php`

### Medium priority

These use direct ExtJS APIs or direct asset loading but are less concentrated:

- `contextcontent` — API refs: 2; direct asset refs: 0
- `contextinstructor` — API refs: 1; direct asset refs: 0
- `contexttools` — API refs: 1; direct asset refs: 3
- `gradebook2` — API refs: 0; direct asset refs: 1
- `jturnitin` — API refs: 1; direct asset refs: 1
- `learningcontent` — API refs: 5; direct asset refs: 0
- `lifeline` — API refs: 0; direct asset refs: 3
- `ocsinterface` — API refs: 0; direct asset refs: 3
- `podcaster` — API refs: 3; direct asset refs: 3
- `practicals` — API refs: 2; direct asset refs: 3
- `tooltipdemo` — API refs: 11; direct asset refs: 3
- `turnitin` — API refs: 0; direct asset refs: 2
- `webpresent` — API refs: 3; direct asset refs: 3

### Low-risk wrapper users

These reference the common loader but contain no direct ExtJS API calls.
They should require little or no module rewrite when the service changes:

- `kbookmark`
- `mcqtests`

## Editor boundary

`Ext.form.HtmlEditor` must not become the basis of the new editor architecture.

Chisimba already has separate historical editor abstractions, including
HTMLArea/FCKeditor, TinyMCE, CKEditor-related modules, and markItUp.

Create a distinct editor service with a stable server-side contract. The UI
service may request an editor component, but editor selection, configuration,
sanitisation, and content handling belong to that editor service.

## Immediate implementation sequence

1. Create a compatibility-safe successor implementation inside
   `core_modules/ext`.
2. Preserve `getObject('extjs', 'ext')` and `show()`.
3. Add native and legacy modes without changing existing call sites.
4. Add protection against duplicate asset loading.
5. Update the moderniser to replace direct ExtJS asset tags with facade calls.
6. Choose one low-risk module for a native component proof of concept.
7. Do not begin with `simpleregistration`; use it later as a stress test.
8. Keep editor replacement as a separate tracked workstream.

## Recommended proof of concept

Use a module with a small number of direct calls and a visible, testable UI.
A suitable candidate should:

- be non-critical;
- use one or two simple ExtJS concepts;
- be easy to regression-test;
- not combine ExtJS with a rich-text editor;
- not contain a large data grid.

The generated inventory should be used to select that candidate from the
currently installed and testable modules.

## Acceptance criteria

The successor architecture is successful when:

1. wrapper-only modules render without ExtJS;
2. a page loads ExtJS only when explicitly placed in legacy mode;
3. no module manually emits ExtJS asset tags;
4. native components meet keyboard and accessibility requirements;
5. editor loading is controlled by a separate service;
6. direct `Ext.*` references decline monotonically until they reach zero;
7. all ExtJS vendor trees can be deleted without breaking Chisimba.
