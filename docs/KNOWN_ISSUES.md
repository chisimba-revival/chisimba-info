# Known Issues

This document lists unresolved or partially understood issues. Items should remain here until they are verified as fixed.

## Installer

### AJAX installer reliability

The AJAX installer has not yet been shown to complete reliably in the current legacy Docker environment.

Current working approach:

- use the background installer;
- stop at the first genuine failure;
- inspect server-side logs rather than debugging downstream application errors.

### PEAR Calendar warning

The installer reports that Calendar is not found and warns that some functionality may be unavailable.

A Dockerfile change has been prepared to install:

`Calendar-0.5.5`

This must still be verified by rebuilding the legacy web image and rerunning the installer check.

### Final transition warnings

During the final transition from installation to the installed application, warnings were observed in:

`core_modules/systext/classes/systext_facet_class_inc.php`

The first warning was:

`Invalid argument supplied for foreach()`

Subsequent header warnings were downstream consequences of output already being sent.

The installation nevertheless completed successfully. The root cause remains to be investigated separately, without blocking the working baseline.

## Runtime and build process

### Runtime contains generated and mutable state

`dev-environment/runtime/ch/` is an assembled runtime tree. It must not be treated as the permanent source of truth.

Verified fixes made there must be applied back to the appropriate repository, such as `framework`, `modules`, or `canvases`.

### Database backups are local artefacts

`dev-environment/backups/` contains local database dumps and should not be committed unless the project explicitly decides to maintain sanitized fixtures.

### Temporary installation credentials

The installation used `admin / a` for verification. This is suitable only for the disposable local legacy environment and must not be used outside it.

#Technical debt for admin login

There are three reservations:
The direct permissions-table implementation is a secure PHP 8.2 compatibility bridge. It should be revisited when LiveUser is replaced, rather than preserved as the eventual authorization architecture.

Calling parent::init() inside each lookup changes the model’s active table.
That is normal in some old Chisimba code, but it can create subtle side effects if the same object is reused later. Explicit table arguments help, but a dedicated permissions repository would be cleaner.
It bypasses LiveUser’s higher-level behavior.
Direct membership works, but LiveUser may also have intended semantics around inherited groups, permission types, application scopes, or nested groups. For Site Admin, direct membership is probably the correct security rule, but we should verify that against the original authorization design.

So my assessment is:

Safe enough for the restored development system: yes.
Safer than relying on accesslevel or a username-based override: definitely.
Suitable as the final modernization architecture: no.
Likely to create unauthorized administrator access: not from the evidence we have; the query requires an actual database membership link.
