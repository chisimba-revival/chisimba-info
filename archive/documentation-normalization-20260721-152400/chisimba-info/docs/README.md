# Chisimba Revival Documentation

This directory records the technical history, decisions, investigations, and architecture of the Chisimba revival project.

## Documents

- `INSTALL_HISTORY.md` — chronological record of installation work and verified milestones.
- `KNOWN_ISSUES.md` — current unresolved issues, warnings, and limitations.
- `DECISIONS.md` — architectural and process decisions that should guide future work.
- `PROJECT_NOTEBOOK.md` — structured investigation log using question, hypothesis, experiment, result, and conclusion.
- `ARCHITECTURE_NOTES.md` — evolving description of Chisimba architecture and runtime behaviour.
- `MODERNISATION_LOG.md` — changes that deliberately move Chisimba toward a maintainable modern platform.

## Working method

The project follows a strict debugging discipline:

1. One command at a time.
2. One hypothesis at a time.
3. Fix the earliest failure first.
4. Distinguish causes from downstream symptoms.
5. Treat the assembled runtime as disposable.
6. Apply verified fixes back to the appropriate source repository.
7. Record important conclusions before moving on.
