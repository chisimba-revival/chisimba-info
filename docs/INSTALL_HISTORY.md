# Installation History

This document records verified Chisimba installation milestones and the conditions under which they were achieved.

## 2026-07-11 — First successful installation in the legacy Docker environment

### Environment

- Host: Ubuntu-based desktop environment
- Web container: PHP 5.6.40 with Apache 2.4
- Database container: MySQL 5.5.62
- Database abstraction layer: PEAR MDB2
- Runtime URL: `http://localhost:8080/ch/`

### Repository layout

The revival workspace contains six Git repositories:

- `framework`
- `shellscripts`
- `canvases`
- `chisimba-info`
- `modules`
- `dev-environment`

The legacy runtime is assembled under:

`/run/media/derek/main/chisimba-revival/dev-environment/runtime/ch`

and mounted in the web container as:

`/var/www/html/ch`

### Reset procedure used

1. Stop and remove the legacy Docker stack and database volume.
2. Start a fresh stack.
3. Create an empty `chisimba` database.
4. Remove the installer completion markers:
   - `/var/www/html/ch/config/installdone.txt`
   - `/var/www/html/ch/tmpinstallfile`
5. Open the installer directly at:
   - `http://localhost:8080/ch/installer/`
6. Use the background installer rather than the AJAX installer.

### Important runtime correction

`Engine::getDbObj()` must return the cached database object on calls made after the initial connection has already been established.

A missing final return caused later callers to receive `NULL`, which led to failures such as:

- trying to read a property from a non-object in `dbtable_class_inc.php`
- calling `queryAll()` on `NULL`

The runtime method was corrected so that `$this->_objDb` is returned whether it is newly created or already cached.

### Result

The background installer completed first-time module registration and created `installdone.txt`.

Verified outcomes:

- Chisimba opened at the login screen.
- Language text rendered.
- The canvas rendered.
- Login succeeded with the temporary installation credentials `admin / a`.

### Backup

A working database dump was created at:

`dev-environment/backups/chisimba-working-install.sql`

The dump was approximately 526 KB at the time of creation.

### Outstanding installation observations

- The installer reported that PEAR Calendar was not found, but allowed installation to continue.
- Warnings from `systext_facet_class_inc.php` appeared during the transition from installation to the application.
- Header warnings followed because warning output had already been sent.
- Despite those warnings, installation completed and the application was usable.
- The AJAX installer remains unverified and appears less reliable than the background installer.
