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
