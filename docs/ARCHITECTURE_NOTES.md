# Architecture Notes

This is an evolving description of Chisimba architecture as verified through code inspection and runtime behaviour.

## Repository structure

The revival workspace contains six repositories with distinct responsibilities:

- `framework` — Chisimba framework and core application code.
- `modules` — module packages.
- `canvases` — presentation canvases.
- `shellscripts` — supporting operational scripts.
- `chisimba-info` — project documentation and historical information.
- `dev-environment` — Docker-based legacy and future development environments.

## Assembled runtime

The development environment assembles a runnable Chisimba tree at:

`dev-environment/runtime/ch/`

The legacy web container mounts this at:

`/var/www/html/ch`

The assembled runtime is mutable and includes generated configuration and installation marker files.

## Bootstrap and database access

`Engine::getDbObj()` lazily creates and caches the database connection.

In the verified legacy environment:

- database abstraction: MDB2;
- driver: `MDB2_Driver_mysql`;
- DSN shape: `mysql://user:password@host/database`;
- connection object is cached in the engine and a global reference.

Callers such as `dbtable::init()` expect `getDbObj()` to return a usable connection on every call.

## Database table abstraction

Core and module database classes commonly extend `dbTable` and call:

`parent::init('table_name')`

The base class stores the table name, obtains the database connection, determines the database layer and database type, and provides query helpers.

## Installer state

The installer uses runtime marker files to determine whether installation has completed.

Observed markers include:

- `config/installdone.txt`
- `tmpinstallfile`

Resetting only the database is insufficient for a clean installer run. The marker files must also be removed.

## Module registration

During first-time registration, Chisimba:

- registers modules;
- creates permission areas;
- creates and populates module tables;
- records registration state;
- writes the installation completion marker.

The system log message:

`First time registration complete`

is an important milestone indicating that the main registration pass finished.

## Language and systext

The language and systext subsystems are involved early in application startup and during the final installer transition.

Warnings in `systext_facet_class_inc.php` can emit output before redirects or headers, causing secondary header warnings. These should be diagnosed separately from the installation baseline.

## Canvas rendering

Successful rendering of the login canvas is a useful smoke test that several systems are working together:

- module loading;
- language lookup;
- template/canvas resolution;
- database access;
- controller dispatch.
