# Milestone 10: chisimba-reborn

## Purpose

Create a modern, responsive and accessible Chisimba design system that
supports controlled contextual visual variation through canvases.

## Scope

- Preserve the working PHP 8.2 runtime.
- Do not repair unrelated modernisation defects.
- Create the chisimba-reborn skin.
- Establish design tokens and canvas inheritance.
- Retain compatibility with legacy module output.
- Demonstrate at least two canvas variations.

## Architectural principles

1. The skin owns structure and behaviour.
2. Canvases provide controlled visual variation.
3. Modules should not own site-wide presentation.
4. Legacy compatibility rules remain isolated.
5. Accessibility and responsive behaviour are foundational.
6. Canvas support must work without duplicating the complete skin.
7. Existing working functionality must remain usable throughout development.

## Initial deliverables

1. Existing skin and canvas architecture audit.
2. chisimba-reborn skeleton.
3. Design-token system.
4. Modern application shell.
5. Default canvas.
6. Two demonstration canvases.
7. Core-screen validation.
8. Skin and canvas developer documentation.

## Explicitly deferred

- PHP conversion fixes unrelated to rendering.
- Authentication redesign.
- Module functionality restoration.
- AI functionality.
- Administrative canvas creation tools.
