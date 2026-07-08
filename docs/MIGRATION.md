# Chisimba Revival Information

This repository contains the documentation, architecture,
design notes, governance, roadmaps and historical information
for the Chisimba Revival project.

# Chisimba Revival Repository Migration

**Project:** Chisimba Revival\
**Organisation:** https://github.com/chisimba-revival

## Purpose

This document records the provenance of the Chisimba Revival
repositories. The goal is to preserve the complete development history
of the original Chisimba project before any modernisation work is
undertaken.

## Repository Mapping

  Original       Revival
  -------------- -----------------
  chisimba       framework
  modules        modules
  canvases       canvases
  shellscripts   shellscripts
  (new)          dev-environment
  (new)          chisimba-info

## Migration Method

``` bash
git clone --mirror https://github.com/chisimba/<repo>.git
cd <repo>.git
git remote add revival git@github.com:chisimba-revival/<newrepo>.git
git push --mirror revival
```

Expected warnings such as:

``` text
! [remote rejected] main (refusing to delete the current branch)
```

are normal because GitHub protects the default branch. Rejected
`refs/pull/*` references are also expected.

## Principles

1.  Preserve history exactly.
2.  Do not rewrite commits during migration.
3.  Modernise only after migration is complete.
4.  Keep architectural decisions documented.

## Next Steps

-   Build the historical environment.
-   Verify a clean historical installation.
-   Create a controlled upgrade path.
-   Modernise incrementally while preserving the original architecture.

Document created during the Chisimba Revival project (July 2026).
