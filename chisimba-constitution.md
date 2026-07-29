# Chisimba Constitution

**Last updated:** 2026-07-21

## Status

This document is the governing statement of long-lived principles for the
Chisimba Revival project. It consolidates recurring ideas found across the
existing project documentation and records decisions confirmed during the
revival work.

Milestone notes, audit reports, implementation plans, and temporary debugging
documents may change frequently. This Constitution should change only when a
foundational principle changes.

---

## 1. Purpose and identity

### 1.1 Chisimba is a framework

Chisimba is the framework: the stable structure from which complete systems are
built. Applications, learning environments, organisational sites, and other
solutions are houses built upon that framework.

### 1.2 Restoration serves renewal

The project does not exist merely to preserve an old PHP application. It restores
the sound architectural ideas of Chisimba so they can support a maintainable,
modern, extensible platform.

### 1.3 Education remains central

The long-term direction is a fully AI-backed learning platform in which AI can
participate constructively in learning: asking questions, guiding inquiry,
encouraging reflection, joining discussions, and helping learners develop
understanding rather than merely supplying answers.

---

## 2. Architectural principles

### 2.1 Stable abstractions before implementation details

Modules should depend on Chisimba framework concepts rather than directly on
third-party libraries, frontend frameworks, database peculiarities, or other
replaceable implementation details.

### 2.2 The skin renders the canvas

The skin is the stable presentation framework and design system. Canvases provide
contextual presentation and layout variants. The canvas does not replace the
skin; the skin renders it.

### 2.3 UI concepts belong to Chisimba

Modules should request user-interface concepts through Chisimba objects, for
example:

```php
$window = $this->getObject('window', 'ui');
```

Modules must not bind themselves directly to ExtJS or to a future fashionable
frontend framework.

### 2.4 Prefer the web platform

Use semantic HTML, modern CSS, browser-native capabilities, and progressive
enhancement before introducing JavaScript libraries. JavaScript should enhance
the interface rather than become its foundation.

### 2.5 One responsibility per layer

Application logic, UI components, skin/design system, canvas, and browser
behaviour should remain clearly separated. A layer should not absorb the
responsibilities of another merely for convenience.

### 2.6 Compatibility layers are temporary

Compatibility code may be used only when it enables a controlled migration.
It must have a defined removal path and must not become the new architecture.

---

## 3. Accessibility

### 3.1 Accessibility is a framework requirement

**All new Chisimba UI and presentation work must be accessible by default.**

Accessibility is not an optional enhancement to be added later. It is part of
the public contract of every new UI component and presentation-layer feature.

### 3.2 Semantic HTML first

Use the correct native HTML element whenever one exists. Add ARIA only where
native semantics cannot express the required behaviour.

### 3.3 Required accessibility behaviour

New components must, as applicable, provide:

- complete keyboard operation;
- visible and consistent focus states;
- meaningful labels and instructions;
- accessible validation and status messages;
- appropriate colour contrast;
- screen-reader-compatible names, roles, states, and relationships;
- reduced-motion support where motion is non-essential;
- behaviour that remains understandable without pointer-only interaction.

### 3.4 Accessibility must be tested

Accessibility checks should accompany syntax checks, browser tests, and
regression checks. A dedicated accessibility audit of legacy Chisimba should be
performed, with repairs prioritised by severity, reach, and practical impact.

---

## 4. Presentation and design system

### 4.1 The presentation layer is a system

Typography, spacing, colour, responsive behaviour, forms, tables, buttons,
messages, navigation, cards, and other common elements should form a coherent
design system rather than a collection of module-specific fixes.

### 4.2 Components inherit the active design system

UI components should provide semantic structure and behaviour. The active skin
should determine visual language such as colour, spacing, typography, borders,
shadows, and motion.

### 4.3 Responsive behaviour is normal behaviour

Desktop, tablet, narrow-screen, keyboard, and assistive-technology use are all
ordinary operating conditions, not special cases.

---

## 5. Modernisation principles

### 5.1 Evidence over belief

Decisions about legacy behaviour must be based on source inspection, runtime
evidence, database evidence, and repeatable tests rather than assumptions.

### 5.2 Migrate complete callers

When replacing obsolete technology, migrate a complete caller or component
category, remove its legacy assets and APIs, and add a regression check that
prevents reintroduction.

### 5.3 Do not reproduce obsolete frameworks

The goal is not to recreate ExtJS under another name. Add the smallest coherent
Chisimba component needed by real modules, using native browser capabilities
wherever practical.

### 5.4 Preserve valuable architecture, replace obsolete machinery

Backward compatibility is valuable where it protects real applications and
sound concepts. It is not a reason to preserve obsolete dependencies,
unmaintainable security mechanisms, or accidental historical behaviour.

---

## 6. Security principles

### 6.1 Security is structural

Authentication, authorisation, validation, output handling, permissions, and
data access must be treated as framework concerns, not optional module details.

### 6.2 Safe defaults

Framework APIs should guide developers toward safe behaviour by default and
make unsafe behaviour explicit and difficult.

### 6.3 Temporary security bridges must be revisited

Compatibility fixes that bypass obsolete systems may be necessary during
restoration, but must be documented and revisited when the relevant subsystem is
properly replaced.

---

## 7. Engineering and documentation

### 7.1 New code must be understandable

New code should follow traditional Chisimba commenting discipline with clear
class, method, property, template, JavaScript, CSS, and configuration comments.
Developer attribution should use Derek Keats where required by the project.

### 7.2 Automate repeatable work

Modernisation, assembly, diagnostics, audits, migration checks, and deployment
steps should be scripted where practical. Manual edits are a last resort.

### 7.3 Tests accompany change

A change is not complete merely because it appears to work once. Syntax checks,
positive and negative regression tests, browser checks, and focused audits
should accompany significant framework work.

### 7.4 Documentation has hierarchy

The Constitution records enduring principles.

Architecture decision records explain major decisions and their reasoning.

Design-system documentation defines presentation rules and tokens.

Milestone documents, audits, inventories, and debugging reports record temporary
or implementation-specific work.

No temporary report should silently redefine a constitutional principle.

---

## 8. Operational discipline

### 8.1 Repositories remain authoritative

Source repositories are authoritative. The moderniser and runtime assembler
should create the executable runtime. Ad hoc runtime changes are for diagnosis
or bounded proof only and must be reflected back into source and automation.

### 8.2 Diagnostics are captured consistently

Project audit and diagnostic scripts should write consolidated output to:

```text
/run/media/derek/main/chisimba-revival/killme.txt
```

### 8.3 Production is not a laboratory

Production scripts must be narrowly scoped, reversible where practical, and must
not create or restructure an existing production site unexpectedly.

---

## 9. Governance

### 9.1 Changing the Constitution

A constitutional change should:

1. identify the principle being changed;
2. explain why existing principles are insufficient;
3. identify affected architecture or workflows;
4. preserve a dated historical version through version control;
5. be reflected in implementation guidance and tests where applicable.

### 9.2 Interpreting conflicts

When documents conflict, prefer, in order:

1. this Constitution;
2. explicit architecture decisions;
3. current design-system and framework specifications;
4. current milestone plans;
5. older audits, notes, and historical documents.

---

## 10. Current non-negotiable principles

1. Chisimba is a framework, not merely an LMS.
2. Restoration exists to enable modern renewal.
3. The skin renders the canvas.
4. Modules depend on Chisimba abstractions, not frontend frameworks.
5. Prefer semantic HTML and the native web platform.
6. All new UI and presentation work is accessible by default.
7. Accessibility is tested, not assumed.
8. Security is a framework responsibility.
9. Compatibility layers are temporary and removable.
10. Evidence, automation, and regression testing guide modernisation.
11. Repositories remain authoritative; assembled runtimes are derived.
12. AI should support active, reflective, educationally positive learning.

---

## Source audit appendix

This appendix is generated from the current documentation trees. It records the
documents most likely to contain principles, architectural decisions, design
rules, and project direction. Inclusion does not mean every statement in a
source has constitutional status.

- `dev-environment/docs/chisimba-design-system.odt` — themes: accessibility, architecture, design_system, modernisation, vision; extraction: odt; relevance score: 96
- `dev-environment/docs/extjs-successor-architecture.md` — themes: accessibility, architecture, coding, modernisation, operations, security; extraction: text; relevance score: 89
- `dev-environment/docs/public-demo-deployment.md` — themes: architecture, coding, design_system, modernisation, operations, security, vision; extraction: text; relevance score: 45
- `dev-environment/docs/ui-component-catalogue.md` — themes: accessibility, architecture, coding, design_system, modernisation, vision; extraction: text; relevance score: 34
- `chisimba-info/docs/MODERNISATION_LOG.md` — themes: architecture, coding, modernisation, operations; extraction: text; relevance score: 32
- `chisimba-info/MILESTONE_10_CHISIMBA_REBORN.md` — themes: accessibility, architecture, coding, design_system, modernisation, security, vision; extraction: text; relevance score: 32
- `chisimba-info/PHP82_SMOKE_TEST.md` — themes: architecture, coding, modernisation, operations, security, vision; extraction: text; relevance score: 27
- `chisimba-info/docs/ARCHITECTURE_NOTES.md` — themes: architecture, coding, design_system, modernisation, operations; extraction: text; relevance score: 26
- `dev-environment/docs/milestone-8/AUTHENTICATION_BEHAVIOURAL_CONTRACT.md` — themes: coding, modernisation, security; extraction: text; relevance score: 24
- `dev-environment/docs/PHP82_RUNTIME_DEBT.md` — themes: architecture, coding, modernisation, security; extraction: text; relevance score: 23
- `chisimba-info/docs/KNOWN_ISSUES.md` — themes: architecture, coding, modernisation, operations, security; extraction: text; relevance score: 19
- `chisimba-info/MILESTONE_6_RUNTIME_COMPATIBILITY.md` — themes: accessibility, architecture, coding, modernisation; extraction: text; relevance score: 19
- `dev-environment/docs/extjs-removal-discipline.md` — themes: architecture, design_system, modernisation; extraction: text; relevance score: 18
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_COMPARISON_MATRIX.md` — themes: coding, modernisation, operations, security; extraction: text; relevance score: 17
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_FEATURE_FLAG_PLAN.md` — themes: coding, modernisation, operations, security; extraction: text; relevance score: 17
- `chisimba-info/docs/MIGRATION.md` — themes: architecture, coding, design_system, modernisation, vision; extraction: text; relevance score: 15
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_BEHAVIOURAL_CONTRACT.md` — themes: architecture, coding, modernisation, security, vision; extraction: text; relevance score: 15
- `dev-environment/docs/ARCHITECTURE.md` — themes: architecture, design_system, modernisation, operations; extraction: text; relevance score: 14
- `chisimba-info/docs/HISTORY.md` — themes: architecture, coding, modernisation; extraction: text; relevance score: 13
- `chisimba-info/milestone-8/LIVEUSER_BEHAVIOUR_RECORDER.md` — themes: coding, design_system, operations, security, vision; extraction: text; relevance score: 13
- `chisimba-info/docs/DECISIONS.md` — themes: architecture, coding, modernisation, operations; extraction: text; relevance score: 12
- `chisimba-info/docs/INSTALL_HISTORY.md` — themes: architecture, design_system, modernisation, operations; extraction: text; relevance score: 10
- `chisimba-info/PHP82_SMOKE_TEST_update.md` — themes: architecture, coding, modernisation; extraction: text; relevance score: 10
- `chisimba-info/milestone-8/CANONICAL_AUTHENTICATION_RESULT.md` — themes: coding, modernisation, security, vision; extraction: text; relevance score: 9
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_LIVE_CAPTURE.md` — themes: coding, modernisation, operations, security; extraction: text; relevance score: 7
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_READONLY_IMPLEMENTATION.md` — themes: architecture, coding, modernisation, security; extraction: text; relevance score: 7
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_SHADOW_HOOK.md` — themes: architecture, security; extraction: text; relevance score: 7
- `dev-environment/docs/adr/0001-preserve-historical-runtime-boundary.md` — themes: architecture, design_system, modernisation, operations; extraction: text; relevance score: 7
- `chisimba-info/docs/PEOPLE.md` — themes: architecture, coding; extraction: text; relevance score: 6
- `chisimba-info/milestone-8/NATIVE_AUTHENTICATION_SHADOW_TRACE.md` — themes: modernisation, operations, security, vision; extraction: text; relevance score: 5
- `dev-environment/docs/extjs-migration-inventory.csv` — themes: title relevance; extraction: unsupported; relevance score: 5
- `chisimba-info/docs/README.md` — themes: architecture, coding, modernisation; extraction: text; relevance score: 4
- `dev-environment/docs/milestone-8/AUTHENTICATION_COMPARISON_MATRIX.md` — themes: modernisation, security; extraction: text; relevance score: 4
- `chisimba-info/docs/PROJECT_NOTEBOOK.md` — themes: architecture, coding, vision; extraction: text; relevance score: 3
- `dev-environment/docs/milestone-8/NATIVE_AUTH_FEATURE_FLAG.md` — themes: security; extraction: text; relevance score: 1

## Documentation health summary

- Files scanned: **37**
- Files with principle or architecture relevance: **35**
- Exact duplicate sets: **0** covering **0** files
- Files whose text could not be extracted: **0**
- Unsupported file types encountered: **3**
- Existing files were not moved, renamed, deleted, or rewritten.
- Most common file types: `.md`: 33, `[no extension]`: 2, `.odt`: 1, `.csv`: 1

## Candidate consolidation work

1. Review the source appendix and mark each document as constitutional, architectural, implementation guidance, historical, or obsolete.
2. Create a later, separately approved normalization pass that moves files into a small documented hierarchy rather than deleting them.
3. Preserve `chisimba-design-system.odt` as the current design-system source until its content is deliberately migrated to a version-controlled text format.
4. Convert repeated architectural decisions into concise ADRs only when they are actively needed; do not create ADRs merely to increase document count.
5. Treat this Constitution as the first document to consult when future notes or scripts appear to conflict.
