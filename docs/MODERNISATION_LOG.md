# Modernisation Log

This document records deliberate changes that move Chisimba toward a maintainable modern platform. Compatibility repairs needed only to establish the legacy baseline should be recorded in `INSTALL_HISTORY.md` and the project notebook first.

## Current phase — Establish and preserve the legacy baseline

**Status:** In progress

### Completed

- Created a Docker environment using PHP 5.6 and MySQL 5.5.
- Established a reproducible background-installer path.
- Confirmed a successful login after installation.
- Simplified the legacy container mount to use a single assembled runtime tree.
- Added legacy PEAR package installation steps for MDB2, XML Parser, and Calendar.
- Created a working database backup.

### Immediate next work

- Verify a clean image rebuild after the corrected Dockerfile syntax.
- Confirm whether PEAR Calendar is detected after rebuild.
- Review and commit the runtime assembly script changes.
- Apply the verified `Engine::getDbObj()` correction to the permanent `framework` source if it is not already present there.
- Add `.gitignore` rules for generated runtime and local backups.

## Future modernisation tracks

These are not yet implementation commitments. They are likely work streams to investigate after the legacy baseline is stable.

### Runtime and language

- Introduce a supported modern PHP target incrementally.
- Add compatibility tests before each PHP version increase.
- Replace removed or deprecated PHP behaviour deliberately rather than through broad search-and-replace changes.

### Dependency management

- Catalogue PEAR dependencies.
- Identify maintained replacements.
- Introduce Composer where practical.
- Preserve adapter layers while dependencies are replaced.

### Database layer

- Document MDB2 usage patterns.
- Evaluate PDO or a maintained database abstraction layer.
- Add schema and installer tests before replacing MDB2.

### Front-end dependencies

- Catalogue Prototype.js and legacy jQuery usage.
- Continue removing Prototype.js without changing user-facing behaviour unnecessarily.

### Testing

- Add installer smoke tests.
- Add login and bootstrap tests.
- Add tests for module registration and schema creation.
- Preserve a legacy reference environment for behavioural comparisons.

### Documentation

- Document object creation and module loading.
- Document installer stages and state transitions.
- Record every architectural decision that affects compatibility or extension development.
