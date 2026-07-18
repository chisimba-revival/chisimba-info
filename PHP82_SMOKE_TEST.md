# Chisimba Revival - PHP 8.2 Smoke Test

## Purpose

This document defines the repeatable smoke test used to verify that the
Chisimba framework is fundamentally healthy after changes to the framework,
runtime assembler, or PHP compatibility layer.

A smoke test is **not** exhaustive testing. It confirms that the core
framework is operational before more detailed testing begins.

---

## Test Status

| Status | Meaning |
|---------|---------|
| ☐ | Not tested |
| ✅ | Passed |
| ❌ | Failed |
| ⚠️ | Passed with warnings |

---

# Phase 1 - Framework

| Area | Test | Expected Result | Status | Notes |
|------|------|-----------------|:-----:|------|
| Installer | Fresh installation | Installer completes successfully | ✅ | |
| Authentication | Login as admin | Login succeeds | ✅ | |
| Authentication | Logout | Returns to prelogin | ☐ | |
| Session | Navigate authenticated pages | Session persists | ✅ | |
| Contexts | Create context | Context created successfully | ✅ | |
| Contexts | Edit context | Changes saved | ☐ | |
| Contexts | Delete test context | Context removed | ☐ | |
| User Admin | Open administration | Loads correctly | ☐ | |
| Site Config | Save configuration | Setting persists | ☐ | |
| Languages | Language administration | Opens without errors | ☐ | |
| Module Loader | Module catalogue | Loads and enables/disables modules | ☐ | |

---

# Phase 2 - Core Packages

| Package | Test | Status | Notes |
|---------|------|:-----:|------|
| Discussion | Create forum and post | ☐ | |
| Stories | Create and edit story | ☐ | |
| Files | Upload and download file | ☐ | |
| Groups | Create group | ☐ | |
| Search | Search content | ☐ | |
| Calendar | Basic operation | ☐ | |
| Messaging | Send internal message | ☐ | |
| Blog | Create blog entry | ☐ | |

---

# Phase 3 - Presentation

| Area | Test | Status | Notes |
|------|------|:-----:|------|
| Skins | Switch skins | ☐ | |
| Canvases | Load alternative canvases | ☐ | |
| Themes | Rendering consistency | ☐ | |

---

# Phase 4 - Optional Modules

Record the status of optional modules as they are restored.

| Module | Status | Notes |
|--------|:-----:|------|
| | ☐ | |

---

## Current Milestone Summary

### Confirmed Working

- ✅ Fresh installation
- ✅ Login
- ✅ Authenticated session
- ✅ Context creation

### Remaining Work

Continue through the checklist until all framework items pass before
declaring the PHP 8.2 framework restoration complete.

