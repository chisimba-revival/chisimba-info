# ExtJS Removal Discipline

## Decision

The existing `ext` module is legacy infrastructure. It may remain temporarily
for modules that have not yet been migrated, but it must not become a permanent
abstraction or receive new feature development.

The target API is the Chisimba-native `ui` module:

```php
$window = $this->getObject('window', 'ui');
$tooltip = $this->getObject('tooltip', 'ui');
```

## Rules

1. No new direct `Ext.*` calls.
2. No new direct ExtJS asset includes.
3. New UI work must use the `ui` core module.
4. A migrated module must never regain an ExtJS dependency.
5. Every migration must remove both API calls and asset loading.
6. The remaining ExtJS count must move downward.
7. The `ext` module is deleted when the remaining count reaches zero.
8. Rich-text editors are tracked separately from ExtJS.

## First completed migration

`tooltipdemo` is the first complete module migration.

It now uses:

```php
$this->getObject('tooltip', 'ui');
```

The shellscripts repository contains `audit-extjs-debt.sh`, which verifies that
the migrated module remains ExtJS-free and reports all remaining debt.
