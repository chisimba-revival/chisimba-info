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
