# Project Notebook

The Project Notebook is the engineering memory of the Chisimba Revival
project.

Its purpose is to record the reasoning behind investigations and code
changes.

Git records what changed.

The Project Notebook records why it changed.

Every investigation should test a single hypothesis, record the evidence,
and conclude with the next single question to investigate.

## Investigation 0000 — Engineering Principles

The Chisimba Revival project follows these principles:

1. One command at a time.
2. One hypothesis at a time.
3. Always investigate the earliest observed failure.
4. Avoid rabbit holes by distinguishing causes from consequences.
5. Commit only verified fixes.
6. Record the reasoning behind every permanent change.


## Investigation 0001 — Why did `dbtable` receive a null database object?

**Date:** 2026-07-10 to 2026-07-11
**Status:** Confirmed

...

**Conclusion**

The cached database object must be returned on every call to
`getDbObj()`, not only during first-time construction.

**Files changed**

framework/app/classes/core/engine_class_inc.php

**Git commit**

Ensure cached database object is returned

**Verification**

- Background installer completed successfully.
- Login screen displayed.
- Login succeeded using `admin / a`.

**Next step**

Re-run the installer from a completely clean database and runtime
installation state.
