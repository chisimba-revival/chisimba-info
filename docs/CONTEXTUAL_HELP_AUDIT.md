# Contextual Help audit

## Purpose

Contextual Help should answer the question created by the page a person is currently using while leaving that page visible. It is not a replacement for clear navigation, labels or validation. A help topic belongs to the module that owns the task and is rendered by the shared Help service.

The Essay marking proof establishes the initial pattern:

- a compact **Help with this page** disclosure;
- an optional full guide in a side panel;
- the active task remains visible;
- content uses the Chisimba language and systext systems;
- the module checks the current account's real permission before supplying content;
- the closed panel is absent from keyboard navigation;
- Escape and the close control return focus to the opening button;
- a direct guide URL applies the same permission check.

## Implemented

| Page or task | Audience boundary | Status |
| --- | --- | --- |
| AI-assisted Essay marking | Current `[-context-]` marking permission | Shipped as the original contextual Help proof. |
| AI-assisted Worksheet marking (`worksheet`) | Current `[-context-]` lecturer permission | Implemented and browser-tested with authorised and unauthorised accounts. |
| Essay writing and document submission | Current `[-context-]` `[-readonly-]` permission | Implemented for both the in-browser writer and document-upload page; browser-tested with authorised and unauthorised accounts. |
| Membership operations | Current `membership.view` permission | Implemented on the membership workspace with guidance for manual access, lifecycle changes, roles and audit history; browser-tested with authorised and unauthorised accounts. |
| Payment operations and reconciliation | Current `payment.view` permission | Implemented on Payment operations with guidance for status, verified events, fulfilment checks, duplicate events and safe support; browser-tested with authorised and unauthorised accounts. |

## Awaiting integration into the current main branches

These topics have approved source material, but their current pages and services are not present on the framework and modules main branches. Contextual Help should be attached after the underlying work is integrated, rather than documenting an unreachable or obsolete interface.

| Page or task | Existing branch work | Required next step |
| --- | --- | --- |
| Permanent deletion preview | `feature/guarded-permanent-delete` and the KengaLearn system-management deployment branch | Integrate and regression-test the guarded deletion service and its preview pages. |
| Shared AI worker status and restart | System-management deployment/feature work | Integrate and browser-test the worker dashboard and its real restart permission. |

## Audiences

Topics may name one or more audiences:

- `general`: public or authenticated guidance that is independent of role;
- `readonly`: guidance for `[-readonly-]` tasks;
- `author`: guidance for `[-author-]` tasks;
- `admin`: operational site administration;
- `root`: installation, system configuration and other high-risk platform operations.

Audience names are an indexing aid. Visibility must still use the canonical permission for the task. An administrator can also be a `[-author-]`, and a `[-author-]` can participate as a `[-readonly-]` in another `[-context-]`.

## Ready for implementation without further product decisions

These topics have current behaviour, sufficient source material and a clear audience boundary.

| Priority | Page or task | Audience | Source material | Proposed contextual answer |
| --- | --- | --- | --- | --- |
| 1 | Announcement publishing | `author`, `admin` according to announcement type | Current Announcements workflow | Difference between site, service, general and `[-context-]` announcements; audience and delivery consequences. |
| 2 | Creating and editing Rubrics | `author`, `admin` | Current rubric workflow plus Essay and Worksheet guides | How criteria and performance descriptions guide marking, and what a rubric does not calculate. |
| 3 | Assessment Plan and Assessment Sheet | `author`, `admin` | Current Gradebook behaviour | Difference between registering an activity, assigning its weight and recording marks. |

## Best completed after one observed user journey

These are suitable for contextual Help, but the wording should follow a fresh browser pass so Help does not document obsolete or confusing behaviour.

| Area | Audience | Questions the browser pass must settle |
| --- | --- | --- |
| Create a `[-context-]` | `author` | Which choices are difficult to reverse; format, access, sections, admission and publication. |
| Manage `[-sections-]` | `author` | Creating an informational `[-section-]`, assigning `[-chapters-]`, and the fact that assignment does not control chapter order. |
| Add or edit a `[-chapter-]` | `author` | Visibility states, introduction-only behaviour, dates and optional gate. |
| Student section and chapter journey | `readonly` | Why content is unavailable, what acknowledgement means and which gate unlocks the next item. |
| MCQ authoring | `author` | Test state, question order, availability, closing date and gated versus ordinary assessment use. |
| Taking an MCQ | `readonly` | Navigation limits, submission, completion and when results become visible. |
| Discussion marking | `author` | Evidence selection, rubric scores, AI suggestion and final lecturer decision. |
| File Manager picker and upload | `general`, with task permission | Difference between selecting an existing file, uploading a new file and attaching or inserting it. |
| My Learning due work | `readonly` | Why an item appears, gated items, overdue state and the route back to the active `[-context-]`. |
| My Teaching action queue | `author` | Meaning of outstanding counts and the destination of each action. |

## Requires policy or product wording before implementation

| Area | Audience | Decision needed |
| --- | --- | --- |
| Registration before payment | `general` | Final order of payment, account creation and verification, including interruption recovery. |
| Membership tier selection | `general` | Final names and explanation of one month, monthly and annual choices. |
| Payment failure and recovery | `general` | Customer-facing promises, support route and provider-specific wording. |
| Mail queue failure | `admin`, `root` | Which restart actions an ordinary administrator may perform and when escalation is required. |
| Site offline mode | `admin`, `root` | Expected administrator access and safe recovery wording. |
| Certificates | `readonly`, `author`, `admin` | Issuing policy, eligibility and replacement rules. |
| Help and support escalation | all | Site-specific support address, service hours and information users may include safely. |

## Existing legacy material

The language catalogue contains 166 old Help entries across 39 modules. The largest sets are MCQ Tests, PBL Administration, Workgroups, Worksheet Administration, Discussion, Calendar, Announcements and Essay. They are migration leads rather than trusted documentation. Many describe deleted icons, tables, popups or workflows and must be checked against the current page before reuse.

The old Help service already supplied action-specific topics, module fallback and related topics. No maintained rich-help or viewlet collection was found. The modern implementation should retain action and module resolution while replacing the popup, unrestricted lookup and stale topic listing.

## Document and video resources

A contextual topic may later attach resources with these fields:

- stable resource identifier;
- translated title and description;
- audience and canonical permission;
- language;
- format: web guide, PDF, document or video;
- module or service version reviewed against;
- download or viewing location;
- for video: duration, thumbnail, captions and transcript.

Documents should have a readable web form for contextual use. Downloadable DOCX or PDF files can remain available when they are useful outside Chisimba. Videos must not autoplay and must not be the only source of an instruction.

## Autonomous completion rule

A ready topic can be implemented without further approval when it:

1. documents behaviour already present and tested;
2. makes no new policy promise;
3. uses existing approved source material;
4. uses language entries and systext tokens;
5. applies the task's canonical permission on both embedded and direct access;
6. leaves the active page visible in the side-panel journey;
7. is tested with one authorised and one unauthorised account;
8. does not add a side block or duplicate an existing action.

Anything that changes policy, payment promises, deletion authority or support commitments remains in the decision-required queue.
