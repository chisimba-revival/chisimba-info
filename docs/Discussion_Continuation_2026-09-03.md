# Discussion continuation — 3 September 2026

The four pre-existing Discussion modifications have been preserved and built upon. Derek requested committing and pushing the accumulated work to GitHub after this handover was written. Nothing has been deployed to KengaLearn. The previous handover remains in Codex task `01a067b5-f82e-7793-8130-30415f49a1d8`.

## Implemented

- Completed AI suggestions are usable only when their stored evidence matches the current contributions. Active queued/running jobs remain visible until completion; a stale completed job no longer disables fresh marking.
- Human marks now persist an evidence fingerprint. Replies, edits (including text beyond the displayed excerpt), and evidence removals requeue the learner while preserving the prior mark. Same-second changes do not depend on timestamp ordering.
- The save form carries the displayed evidence fingerprint. If evidence changes before saving, the server rejects the stale review. The persisted snapshot also means changes arriving after the server's evidence read requeue on the next page load.
- Legacy marks without a snapshot require one explicit review; scores remain intact. Old AI snapshots lacking revision information are conservatively treated as stale.
- All contributions participate in evidence identity; the old first-500 query truncation is removed. Individual excerpts remain bounded at 8,000 characters. More than 500 contributions require manual review rather than AI scoring an incomplete subset.
- Reviewers can expand contribution evidence, see prior marks, and edit a fresh AI draft. The reviewed-learner toggle is available from the first asynchronous save and can hide learners saved while the toggle was open. Failed asynchronous requests return replacement CSRF tokens for retry.
- Updated the stale reply-scope contract to require parent-derived scope.
- Notification read-update failures now propagate to the caller. Notification page-size normalisation now happens before cursor calculation, preventing an empty, non-advancing page when the requested size is zero or negative.

## Verified

- All Discussion and Notification PHP test scripts passed, including 26 new Discussion behavioural checks and 12 new Notification behavioural checks. Existing source contracts are distinguished from these behavioural tests.
- Discussion behavioural tests also passed on the local site's PHP 8.5 runtime. Rendered marking JavaScript passed syntax checking; changed PHP files and whitespace checks passed.
- The live local database evidence query returns **six** contributions for `essay_smoke_student`, including the legacy-ID reply. Prior mark remains **46/50**.
- Applied the local `evidence_fingerprint VARCHAR(64) NULL` assessment-mark schema upgrade through the existing idempotent storage setup. Tested actual snapshot save/read in a transaction, rolled it back, and confirmed the original mark record was unchanged. The schema addition remains; the test mark change does not.
- Temporary diagnostic script was removed. No new learner posts, outbound notifications, real emails, or permanent deletions were used in this continuation's tests.

## Still required before calling Discussion finished

The in-app browser failed to open `https://chisimba.test:8445/ch/` with `ERR_CERT_AUTHORITY_INVALID`. The browser skill requires the user to handle certificate warnings/trust; do not bypass this or substitute screenshots of static test output for live verification.

Once browser access works, enter course `testing106`. Discussion `gen17Srv16Nme16_17884_1788426926`; topic `gen17Srv16Nme16_69276_1788427046`.

1. Inspect the six learner contributions and preserved 46/50 mark. Save an explicit baseline review to establish its snapshot.
2. Add an authorised dummy learner reply; verify the learner requeues with the old mark preserved and fresh AI marking available after any active old job completes.
3. Complete a fresh AI job, inspect the draft and citations, save, reload, and verify persisted review state. Then exercise a stale open review form by adding evidence before save.
4. Verify lecturer/admin access, learner denial, locked replies, new-topic creation, cross-course boundaries, notification subscription/feed behaviour, and failure messages in the real browser. Do not permanently delete posts for testing without explicit approval.
5. Check layout and reviewed-toggle behaviour, including saving while reviewed learners are shown. Broad shared banner/alert work and searchable outbound email attempt/SMTP-acceptance/delivery history remain subsequent work.

The two earlier intentional probe posts remain: admin `gen17Srv16Nme16_39908_1788435670` and learner `gen17Srv16Nme16_25351_1788435805`.

## Chrome verification follow-up

Derek requested Chrome instead of the in-app browser. The Chrome plugin connected successfully to the existing local-site tab, already signed in as `essay_smoke_lecturer`; no certificate bypass was performed.

- Saved the learner's baseline 46/50 review through the browser. The queue changed from six awaiting / zero reviewed to five awaiting / one reviewed, and the saved state survived reload.
- Signed in as `essay_smoke_student`, submitted a nested reply through the rich-text composer, and verified its author, parent link and new-own-reply delete control. No deletion was performed. New intentional test post: `gen17Srv16Nme16_28801_1788447930`, subject `Re: Evidence freshness browser check`.
- Learner marking access was denied. The denial incorrectly describes the learner as not a course member; this wording remains a known issue.
- Returned to the lecturer and verified seven contributions, requeued review, preserved prior 46/50, and enabled fresh AI submission.
- Submitted a fresh AI request through the browser and processed one worker job: selected 1, completed 1, failed 0. The new draft cited the seventh contribution and proposed 84/100 (42/50), recognising the regression-test posts as non-academic evidence.
- Saved that dummy learner's fresh draft through the browser and verified `Marked: 42 / 50` after reload. The learner has one reviewed snapshot covering seven contributions. This is test data, not a real learner grade.
- The Notifications centre failed to load. Read-only database inspection confirmed no `notifications` module registration and no `tbl_notification*` tables. Its installation and end-to-end delivery remain outstanding. Source inspection also found its feed URL appends `?limit=25` to an existing query URL, and its read-action client does not refresh the one-time CSRF token; these require follow-up.

Chrome resolves the browser-access blocker. The broader locked-topic, new-topic, concurrent stale-form and notification journeys listed above are not yet fully browser-verified. No source-code changes were made during this Chrome check.

## Marking-page visual polish

At Derek's request, the marking page now uses defined white learner cards, compact progress counters, clearer header hierarchy, distinct review-state badges and expand/collapse indicators. Score inputs use the full form width with compact sizing; longer AI reasoning and linked evidence are expandable. Feedback and the total/save action have clearer separation. Styles use the existing skin tokens and are scoped to this marking page. The Discussion stylesheet URL now changes with its file modification time so browsers receive updates.

Verified in Chrome at desktop size and 390-pixel width, including learner expansion and AI evidence expansion. No marking-page elements exceeded the narrow viewport. The evidence freshness and assessment contracts still pass; no marks were changed as part of the visual polish.

## Notification toolbar follow-up

Installed Notifications locally through the native module catalogue installer, creating its event/recipient tables and registration. Added an authenticated Updates bell with unread badge, five-item preview, Refresh/Close controls, and link to the full centre. Counts refresh every minute on visible pages and when focus returns. Opening the preview does not mark notifications read.

Fixed feed query construction and renewal of single-use CSRF tokens after read actions. Preview and centre share one client, synchronize after marking, restrict target links to same-origin HTTP(S), and show useful empty/error states. Assets are versioned. Framework integration remains optional when Notifications is not installed.

Chrome verified the empty centre, two dummy-lecturer test notifications, sequential read actions (2 → 1 → 0 in both surfaces), persistence after reload, unread-only empty state, and a 390px preview with no horizontal overflow. The learner account showed an empty feed and could not see the lecturer fixtures. Local fixture IDs are `9b157651ff5c189c9fed1b324ec7f0e7` and `c63da214893288f99d88fd9f590a8343`; both are read, and their titles clearly identify browser checks. The temporary installer/fixture script was removed. No external messages or email were sent.

Notification contract and 12 service behaviour checks pass, as do toolbar audience/home contracts and the new optional-module/authentication behaviour test. Changed PHP files and client JavaScript pass syntax checks. The existing postlogin_leave_context_contract_test fails against the unchanged sidemenu and unchanged test in HEAD; this pre-existing expectation is unrelated to notifications. Broader producer-to-recipient Discussion subscription checks remain outstanding. No KengaLearn deployment.

## Discussion → toolbar delivery verification

Verified the complete journey in Chrome using the local dummy accounts. The lecturer saved “Replies to this topic”; the learner submitted a reply through the rich-text form. Exactly one event recipient was recorded (essay_smoke_lecturer), and the learner's own notification feed remained empty. The toolbar showed the delivered unread update after the lecturer signed in again.

This exposed a real deep-link defect: the original notification link went straight to Discussion and was denied from the Lobby despite course membership. Discussion now wraps course notification destinations in `courseawarelaunchservice`, retaining the topic and post identifiers and the normal membership checks. Lobby notifications retain their direct destination. Reply notification headings now use the original topic title rather than the reply subject.

Submitted a second real browser reply after the fix. Its notification opened the normal course-entry prompt from a fresh lecturer sign-in; “Enter … and continue” reached the correct topic with the new reply present. Marked both test notifications read (badge returned to zero) and restored the lecturer's original “Do not notify me” preference. The two intentional test posts remain: `gen17Srv16Nme16_39485_1788450459` (original-link regression) and `gen17Srv16Nme16_59189_1788450717` (corrected course-entry verification). These additional contributions will requeue the dummy learner's prior assessment on the next marking-page review; no marks were changed.

The course-target regression test, Discussion Notifications contract, and 12 Notifications service behaviour checks pass, including unique recipients, author exclusion and idempotent repeat publication. PHP syntax and diff whitespace checks pass. This verifies topic-follow → reply → recipient notification → course entry → conversation → mark read. New-topic/all-discussion subscriptions and external email are separate journeys. No production deployment or email sending took place. Previously stored notification targets are not rewritten; the earlier test notification retains its original link.

## Product direction from Derek — discuss next session

The Updates functionality is a useful start, but its user journey needs further design. Derek wants to discuss this tomorrow after revisiting the historical Chisimba alert types. Do not treat the current menu placement as the final design: alerts cannot simply be a menu item.

Capture these use cases and presentation ideas for that discussion:

- Time-sensitive assignment reminders: due this week, in three days, tomorrow, and today, with appropriate urgency colours in the icon. Exact colours and reminder rules are still undecided.
- Event alerts: a question has been answered in a question discussion; an assignment has been marked; further historical alert types to be identified.
- Delivery may include in-app alerts, email, and WhatsApp, for example. These are future channel ideas, not authorization to send messages or enable integrations now.
- Stats/status indicators, including the existing status pill, also need consideration alongside alerts and notifications.
- The main user block is another important place to surface alerts and notifications.

Resume with the user journey and the historical alert inventory before deciding placement, interaction, urgency treatment, channel preferences, or implementation scope. No further interface redesign was requested for tonight.

## Product model: alerts, notifications and dashboard

Derek clarified that these are three distinct product concepts. Preserve this distinction during research and design:

1. **Alert** — an attention signal that makes the user aware of a notification. Its placement, icon, colour and urgency should help the user notice something; it is not itself a toolbar menu destination.
2. **Notification** — the durable explanation of an event or a time-based action that may be required. Examples include a question being answered, an assignment being marked, or a deadline approaching. A notification may later be delivered through in-app UI, email or WhatsApp according to policy and user preferences.
3. **Dashboard** — current results and information of interest across the user's courses and the system. It frequently reflects activity outcomes rather than asking for an action: latest mark, average mark, rank, percentage complete by course, and similar indicators.

All three must be role- and course-sensitive. A person may teach one course and study in another. For example, the current Coming Up block incorrectly presents an overdue learner essay to a lecturer as if the lecturer owed the submission. For a learner, a deadline can mean “submit this work”; for a lecturer, the same assessment can mean “submission window closes soon”, “learners have not submitted”, or later “work awaits marking”. The item wording, action, urgency and visibility must derive from the user's role in that course, not merely from the existence of the activity.

Before further implementation, review other LMS products and the historical Chisimba alert inventory. Compare their treatment of attention signals, notification records, delivery preferences, role-specific action queues, dashboard metrics, acknowledgement/read state, urgency and duplication. Evaluate patterns rather than copying terminology, since products may use “alert” and “notification” differently. The existing Coming Up data and UI should be reused where it represents the right user obligation, but it must not become a source of misleading or duplicated alerts.

## Moodle reference supplied by Derek

Derek supplied these findings alongside more than two years of hands-on Moodle experience. They are informed comparison material, not agreed Chisimba requirements. The Notifications documentation link was supplied subsequently below.

- **Core channels:** web notification bell/pop-ups and email, controlled by user preferences; mobile push through a messaging server connected to the official app. Preferences cover notification types such as forums, assignments and feedback.
- **Event monitoring:** admins and teachers can define rules around events such as course completion and forum posts; users subscribe to rules, including threshold-based alerts. The supplied summary notes monitoring defaults and database overhead as considerations for large platforms.
- **Additional tools:** an Advanced Notifications block for dismissible global announcements; a Notifications Agent plugin for automated targeted messaging rules; external outputs such as WhatsApp or Slack. “Event Monitoring” and “Edwiser Guide” were mentioned as references without links. Plugin selection and version compatibility can be investigated if these integrations enter the implementation scope.

Useful comparison dimensions: core versus plugin capabilities; event generation versus delivery channels; user preferences versus rule subscriptions; personal action notifications versus global banners; and the cost of monitoring at scale. These are inputs to the provisional alerts/notifications/dashboard model, not a decision to reproduce Moodle's implementation.


## Moodle Notifications page supplied by Derek

Reference: https://docs.moodle.org/en/Notifications (resolved to https://docs.moodle.org/502/en/Notifications when read on 3 September 2026).

The useful pattern is an explicit mapping from event to recipient: assignment submissions and overdue student submissions can notify teachers, while grades/feedback and personal submission reminders notify students. The page also documents a count indicator, recent notifications, read controls, a full list, preferences, and navigation to the relevant activity. User delivery preferences and site defaults are separate controls.

For Chisimba, use this as input to an event/recipient/action inventory and a clearer visual design. Each item should explain what happened, why it matters to this user in this course, and what they can do next. Keep the distinction between reading a notification and completing its underlying action. Reuse Coming Up where suitable, with correct course-role filtering. Urgency should be conveyed with words and icons as well as colour. These are discussion proposals, not an approved redesign.

Derek's context matters: he has over two years of Moodle experience, notes that KEWL predates Moodle, and worked with the Sakai team, including demonstrating Chisimba in Michigan during Sakai's early development. Compare systems alongside Chisimba/KEWL's own history. The earlier blanket “unverified” label on his contribution was inappropriate and has been removed.

## Dashboard audience decision and My Learning correction — 4 September 2026

Derek and Codex agreed to separate the personal dashboards into My Learning, My Teaching and My Administration, while sharing their layout/block infrastructure. Site privilege and course role are independent. A site administrator can be a student in Course A, lecturer in Course B, and administrator of Course C; those relationships must not leak content between personal dashboards.

Implemented the first boundary in My Learning. Its course overview and Coming Up service now use only `getContextWhereStudent()`, rather than every course membership. An administrator or lecturer therefore does not acquire learner progress or overdue submissions merely through broad access. My Learning navigation is shown only when the account has at least one student course.

Administrator configuration is a separate `manage` route. Top navigation places “Manage My Learning page” under Administration; the account block provides the same explicit management link. The management view keeps the shared block layout and Turn Editing On capability, identifies that changes affect the student experience, and does not display the administrator's membership panel. Administrators who are genuinely enrolled as students retain their ordinary My Learning journey as well as the management link.

Chrome verification used the local Site Administrator and Essay Smoke Student accounts. Site Administrator had no personal My Learning entry, had management links in both relevant navigation surfaces, and opened the management page with editing capability and zero student obligations. Essay Smoke Student retained My Learning, one student course, progress, and the two learner due items (including the overdue essay). The previously hidden no-access template error was fixed and its message now describes student enrolment accurately. The local module registration was updated through the native installer.

My Learning, student due-item, course visibility, navigation audience and canonical Home contracts pass; PHP/JavaScript syntax and diff whitespace checks pass. The existing configurable extra blocks remain shared at page level. My Teaching and My Administration are the next dashboard implementations; their data and wording must use lecturer and administrator responsibilities respectively.

### My Learning schedule outcome wording

A completed learner submission now has one current state in Coming Up. An unmarked submission says **Awaiting marking**; a released result says **Marked (90%)** using its actual percentage. It does not simultaneously say Submitted, Overdue or show a second percentage badge. Submission satisfies the learner's deadline obligation even when the due date has passed. Pending marking uses the standard primary treatment, while a released result uses the completed treatment.

Added a behaviour regression test that renders both states and rejects conflicting labels. My Learning contracts and PHP syntax pass, and the local module registration was updated through the native installer.

## Future innovation: block audience and placement safety

Park this for later implementation. Blocks need machine-readable audience metadata so an administrator cannot accidentally place a privileged or irrelevant block on a learner-facing page. A block may support more than one audience—for example learner and general.

Provisional audiences, using names to be aligned with Chisimba's existing role vocabulary:

- learner/read-only user
- author or lecturer
- site administrator
- root/superuser, if Chisimba still distinguishes this meaningfully
- general/all authenticated audiences

Treat these as placement and rendering constraints, not cosmetic categories. The administrator block picker should list only blocks compatible with the page audience, explain why an incompatible block is unavailable, and retain a server-side check so a stale or crafted request cannot bypass the restriction. Rendering should fail closed if a block is already configured in an invalid location. Multi-audience declarations should be explicit; `general` must not silently grant administrative capability.

The model must distinguish a page's intended audience from the current editor's privileges. A site administrator editing My Learning is configuring a learner page, so their own elevated access must not make administrator-only blocks eligible. Existing Chisimba block context tags and permission conventions should be inventoried before choosing final names, storage or migration behaviour. This is recorded as a future innovation and is not part of the current My Learning implementation.

## My Teaching dashboard — 4 September 2026

Added a separate My Teaching dashboard based on the My Learning page structure. The user-facing name is **My Teaching**. Chisimba's current data model stores course authors in each course's `Lecturers` group; the modern `contextauthorservice` calls those members authors while using that same group. My Teaching therefore uses `getContextWhereLecturer()` as the existing authoritative course-author relationship. Derek observed that conflating author and lecturer appears to be a historical modelling mistake; changing that role model is explicitly parked for later.

The personal page shows only courses where the account is in that relationship, with published/unpublished state and a Manage course action that preserves course entry before opening its control panel. It contains no learner deadlines, submissions or results. Its block regions use the separate `myteaching` page key, so My Learning and My Teaching layouts can be configured independently.

Personal My Teaching appears under Teaching and in the account block only for users with author/lecturer courses. Site administrators receive a distinct **Manage My Teaching page** entry under Administration and in the account block. The management route retains Turn Editing On and identifies that block changes affect the shared author/lecturer experience. Administrators who are themselves course authors also retain the personal journey.

Chrome verified Site Administrator management navigation and editing access; the administrator's four author relationships appeared in the management preview. Essay Smoke Lecturer, a mixed-role account, retained both My Learning and My Teaching; My Teaching showed only `testing106`, and Manage course reached its control panel. Essay Smoke Student had no teaching navigation and received the correct no-access response from a direct URL. The module was installed locally through the native module catalogue.

Audience behaviour and structural contracts pass, including unique course-author relationships, learner exclusion, separate block storage and course-entry management intent. Toolbar audience and canonical Home contracts plus changed-file PHP syntax and whitespace checks pass. No teaching workload/Coming Up block has been invented yet; its responsibilities should be agreed before implementation.

### Author terminology abstraction

Derek identified a critical hosted-customer requirement: the first customer may use **Instructor** rather than Lecturer. Chisimba's abstraction model already provides `[-author-]` and `[-authors-]` system-text tokens, while `Lecturers` is the stable internal permission-group identifier. Renaming that group now would break permissions and compatibility; visible labels must resolve through the terminology service instead.

Corrected the immediate dashboard path. The chisimba-reborn role badge now resolves the singular configured role through `word_lecturer`/`[-author-]`. Course membership and ownership actions use `[-authors-]`. My Teaching avoids hard-coded role nouns in its visible copy and describes the teaching team. Context and My Teaching registrations were updated locally through the native installer.

A regression contract verifies the role badge and course-management labels retain system-text tokens. Existing membership banner and My Teaching audience checks pass. This is a targeted fix for the dashboard/customer demonstration path, not a claim that every historical module is clean: the audit found additional older modules with literal Lecturer/Lecturers text. A broader terminology audit remains necessary, but changing the underlying role model is still parked.

## Dashboard management placement and My Administration

Dashboard configuration belongs with the dashboard journey. **Manage My Learning page** is under Learning, **Manage My Teaching page** is under Teaching, and My Administration plus its management action are under Administration. The management entries are visible only to site administrators and have been removed from the Site Administration workbench. Ordinary dashboard views no longer show editing controls merely because the viewer is an administrator.

My Learning remains student-scoped for an administrator who is genuinely enrolled as a student. Administration of that shared page is a separate route and does not change the meaning of the personal view.

My Teaching course cards now show a compact featured course image in the upper-right corner when one exists. Cards without an image retain a clean text layout.

The first My Administration page is an operational site-health overview rather than another settings catalogue. It shows registered users, courses and users online now, followed by a reserved Needs attention area for administrative requests and service warnings once those services expose reliable signals. It has its own independently configurable block layout and separate view/manage routes. The module and navigation were registered and verified in Chrome on the local site.

## My Teaching course insights

My Teaching now includes initial course-by-course author indicators within the existing course cards, avoiding a second repeated list of the same courses. Each card reports the real number of students, average progress from Context Content learning journeys where that data exists, and the number of submitted assessment items awaiting marking. Registered assessment providers that declare manual marking supply the queue; each option carries stable provider and activity identifiers so a later iteration can connect the appropriate action without changing the dashboard structure.

The assessment selector currently shows the assessment name and outstanding count, or an explicit Nothing awaiting marking state. Its Open action control is deliberately disabled and visually muted until provider-specific author destinations are agreed. Missing progress is labelled Not available rather than shown as zero. Visible author and learner role names resolve through `[-author-]` and `[-readonlys-]` terminology. Course featured images retain their natural aspect ratio within the compact My Teaching card thumbnail.

The My Teaching and My Administration dashboard components now own their single visible surface. The canvas regions are transparent placement containers, removing the redundant outer frame and padding that previously produced a panel within a panel.

My Teaching course cards provide separate **Enter course** and **Manage course** actions. When a listed course is already the active context, Enter course becomes **Leave [-context-]** using configurable system terminology. Assessment dropdown options now state their count explicitly, for example “6 learner reviews awaiting action”, and Open action launches the selected provider's author workspace. Discussion supplies its exact evidence-review count, including prior marks whose evidence has changed, so its dashboard number matches the marking workspace. Accounts that are both author and student in one course are excluded from that course's learner totals and marking queue.

The course-home author status pill now passes `mod_context_lecturerview` through `code2Txt()`. This prevents the literal `[-author-] view` token from reaching the interface and lets the configured organisation term render correctly.

Chisimba.test now uses the existing **elearn** terminology set, edited so author/authors resolve to **instructor/instructors**. The default terminology set remains unchanged. The system-text session cache now records which terminology set produced it and refreshes automatically when `SYSTEM_TYPE` changes, so administrators no longer need to log out after switching sets. Chrome verification shows **Instructor** in the role badge, **instructor view** on course home, and no exposed author tokens.

The same local elearn set now maps context/contexts to **class/classes** as a deliberate abstraction test. My Teaching and My Learning were corrected so introductions, counts, Enter/Manage/Leave actions, empty states, due-work copy and learner actions resolve through `[-context-]` or `[-contexts-]`. The footer already used the abstraction and now shows `Scope: Class`. Chrome verification shows the dashboards consistently using class/classes with no raw tokens. Course titles containing the word “course” remain unchanged because they are authored content.

The first shared-navigation audit corrected the next terminology set on 4 September 2026. The Learning and Teaching menus now resolve context home, control panel, content, members, catalogue, administration and creation labels through system text. The context-home manager eyebrow and prompt, plus the sidebar settings link, also use `[-context-]`. With the local **elearn** terminology set, Chrome shows **Class Home**, **Class Content**, **Class Settings**, **Class Control Panel**, **class management**, and **Manage learning, people and class settings**. Authored descriptions and titles remain intact.

The enduring language rule is now part of the Chisimba Constitution: user-visible English belongs in the language system; source wording uses British English; configurable role and context terms use the available systext tokens; new generic learner/learners wording is avoided where `[-readonly-]` or `[-readonlys-]` applies; and urgent work is not widened merely to repair unrelated historical strings.

System-text substitution does not itself impose presentation case. When a configured term begins a sentence, phrase, heading, label or menu item, the caller must capitalise the resolved first word; within normal prose it remains lower-case. The Class administration panel now follows that rule and removes its remaining literal students/course wording from the task cards.

## Approved capability announcements

Capability installation and capability announcement are separate administrator actions. New modules and features may be installed for testing long before Derek approves them for production use. Installation must therefore never publish a notification automatically. Once a capability has been tested and approved, an administrator may publish a dated **What’s new** entry to the selected audience, such as `[-authors-]`, with a concise explanation, where the capability can be found, and links to its user guide or download.

Announcements are one publishing tool with independent content type, audience and delivery choices. Initial types should include **What’s new**, **General announcement**, and **Service notice**, while allowing further registered types later. Audience choices include everyone, administrators, `[-authors-]`, `[-readonlys-]`, and selected `[-contexts-]`. Visibility includes publication time, optional expiry, and whether the item is eligible for a Latest update block. Delivery uses Updates by default, with optional email or WhatsApp when those channels are available. The content model includes title, summary, full message, guide link and optional download link.

Publishing permission is an independent server-side rule. Site-scoped **What’s new**, **General announcement**, and **Service notice** items may be published only by a site administrator. A `[-context-]`-scoped **General announcement** may be published by a `[-author-]` of that `[-context-]` or by a site administrator. Recipient selection never grants publishing permission.

| Scope | Type | Permitted publisher |
|---|---|---|
| Site | What’s new | Site administrator |
| Site | General announcement | Site administrator |
| Site | Service notice | Site administrator |
| Selected `[-context-]` or `[-contexts-]` | General announcement | `[-author-]` for every selected `[-context-]`, or site administrator |

The publication is the durable source record. It supplies the complete announcement archive, while blocks can filter by type: for example, a compact Latest update block can show only **What’s new** items. Publishing may also create personal in-app notifications through the Notifications service so recipients see the announcement under Updates with unread/read state. Communications can later deliver the same approved publication through configured email or WhatsApp channels; the unrecovered legacy internal-mail module is not a prerequisite.

The historical Announcements module has useful site/class scope, archive and latest-block concepts, but it does not currently run: its controller eagerly loads the missing Feed module, and its optional email path depends on the legacy Mail module. Its editor, permissions, listing and delivery path also predate the current UI and notification architecture. Rehabilitation should retain the durable announcement concept while removing those dependencies and integrating Notifications. System Management may generate maintenance-specific service notices through the shared publication boundary later, while continuing to own maintenance planning and site availability.

The first rehabilitation step confirms that the module is salvageable. Feed is now loaded only when its optional RSS route is requested, legacy Mail is no longer a module dependency, and the publishing form cannot call that retired delivery path. Chrome on PHP 8.5 successfully opens both the empty announcement archive and the existing site/selected-class publishing form. The form and listing remain deliberately unchanged at this stage apart from removing the unavailable email control; no announcement or notification was generated during verification.

The next Announcements revision separates **Type**, **Audience**, **Scope**, **Presentation**, and **Updates delivery** in the publishing form. It stores What’s new, General announcement and Service notice types; everyone, administrator, `[-author-]` and `[-readonly-]` audiences; site or selected-class scope; summary and optional guide/download URLs; publication/expiry fields; and Latest-block eligibility. Site publishing is server-restricted to administrators. Selected-class publishing requires administration privilege or `[-author-]` membership in every selected class, and class announcements are currently restricted to the General type.

Updates delivery occurs only when the publisher explicitly selects it. Announcements resolves active recipient user IDs by audience and selected class, excludes the publisher, and publishes one idempotent event through Notifications. No legacy email is sent. The new **What’s new for `[-authors-]`** sidebar block is visible only to administrators and people who teach at least one class; it shows up to three currently published, non-expired site items targeted to `[-authors-]`, including date, summary and archive access. Existing announcements receive compatible General/Everyone defaults through the schema migration.
