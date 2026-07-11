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
