# Project Decisions

## Decision 0001 — Treat the assembled runtime as disposable

**Status:** Accepted  
**Date:** 2026-07-11

### Decision

The directory:

`dev-environment/runtime/ch/`

is an assembled and mutable runtime, not the permanent source tree.

### Reason

The runtime combines material from multiple repositories and contains generated installation state.

### Consequences

- Runtime edits may be used for diagnosis and proof of a fix.
- Verified fixes must be applied back to the relevant source repository.
- The runtime may be deleted and rebuilt.
- The runtime should not be committed to Git.

---

## Decision 0002 — Use one command and one hypothesis at a time

**Status:** Accepted  
**Date:** 2026-07-11

### Decision

Technical debugging will proceed in small, explicit steps:

1. state one question or hypothesis;
2. run one command or experiment;
3. interpret the result;
4. record the conclusion;
5. only then proceed.

### Reason

Large batches of tests caused state confusion, stale assumptions, and unnecessary investigation of downstream symptoms.

### Consequences

- Avoid multi-command diagnostic batches unless explicitly justified.
- Do not make code changes until the earliest failure has been identified.
- Prefer partial certainty over broad speculation.

---

## Decision 0003 — Fix causes before consequences

**Status:** Accepted  
**Date:** 2026-07-11

### Decision

Errors caused by an incomplete installer run are not to be treated as independent application defects until the installer itself has completed.

### Reason

Missing tables and controller errors were initially investigated even though the database schema was only partially installed.

### Consequences

- Always identify the earliest failure in the installer or bootstrap sequence.
- Do not patch application code merely to tolerate an incomplete schema.

---

## Decision 0004 — Preserve a known working legacy baseline

**Status:** Accepted  
**Date:** 2026-07-11

### Decision

The successful PHP 5.6 / MySQL 5.5 installation is the compatibility baseline for future modernisation.

### Reason

The project needs a reproducible working reference before changing PHP versions, database drivers, libraries, or architecture.

### Consequences

- Keep the legacy Docker environment operational.
- Maintain a documented clean-install procedure.
- Create local database backups before risky work.
- Modernise incrementally while comparing behaviour against the legacy baseline.

---

## Decision 0005 — Prefer the background installer for the current baseline

**Status:** Accepted provisionally  
**Date:** 2026-07-11

### Decision

Use the background installer for the reproducible legacy installation path until the AJAX installer is separately diagnosed.

### Reason

The background installer completed successfully and produced a working login screen, while the AJAX path previously obscured failures.

### Consequences

- The AJAX installer is a separate issue, not a blocker for establishing the baseline.
- Documentation must clearly identify which installation path was verified.
