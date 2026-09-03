# Permanent deletion of test users and courses: administrator guide

## Purpose

Chisimba normally preserves operational information by archiving users and courses. Permanent deletion is provided only for removing disposable test accounts and test courses before they become operational data.

Permanent deletion cannot be undone. It removes the selected record together with associated memberships and disposable dependent data. Chisimba therefore keeps the feature disabled by default and blocks deletion when protected operational evidence exists.

## Recommended operating rule

Use this sequence:

1. Back up the Chisimba database and user-content storage.
2. Confirm that the target is test data and is no longer required.
3. Enable permanent deletion temporarily.
4. Review the deletion preview carefully.
5. Delete only the confirmed test users or test courses.
6. Disable permanent deletion immediately after the cleanup session.

Prefer **Archive** for real users and operational courses. Archiving is the normal administrative action because it preserves history, reporting and audit evidence.

## Enabling and disabling permanent deletion

Only a site administrator can use permanent deletion. The site-wide safety setting is:

```text
Module: security
Parameter: ALLOW_USER_AND_COURSE_DELETE
Safe/default value: false
Temporary cleanup value: true
```

In the Administration workbench, open **Configure site** and locate the `security` module parameter `ALLOW_USER_AND_COURSE_DELETE`.

Set it to the exact value `true` only for an authorised cleanup session. Set it back to `false` when finished. A missing value, an empty value, or any value other than `true` leaves permanent deletion disabled.

When disabled:

- permanent-delete actions are not shown;
- deletion previews cannot be opened;
- direct attempts to submit a deletion are refused.

The switch controls both user and course deletion. It is intentionally one shared emergency-style control so an administrator can verify that all permanent deletion has been turned off.

## Permanently deleting a test user

1. Sign in as a site administrator.
2. Open **User Administration**.
3. Locate the test account.
4. If the account may be needed later, choose **Archive** instead.
5. Select **Delete permanently**.
6. Review the impact preview, including memberships, directly owned records and protected evidence.
7. Type the displayed username exactly into the confirmation field.
8. Select **Permanently delete user**.
9. Confirm that the user no longer appears in User Administration.

An administrator cannot permanently delete the account they are currently using.

For an eligible test account, Chisimba removes the account, its authentication/permission identity, group and course memberships, managed uploaded files, profile image, and disposable user-owned records.

### When user deletion is blocked

Chisimba blocks permanent user deletion when the account has protected operational evidence, including:

- a course owned by the user;
- certificate issuances;
- CPD ledger entries;
- entitlement grants;
- payment intents;
- membership periods;
- financial-operator responsibilities;
- membership of the Site Admin group.

Do not work around a block by deleting database rows manually. Determine whether the account is operational data and archive it, or resolve the protected records through the responsible business process.

## Permanently deleting a test course

1. Sign in as a site administrator.
2. Enter the test course and open its **Course Control Panel**.
3. Select **Permanently delete course**.
4. Review the impact preview, including course memberships, directly owned records and protected evidence.
5. Type the displayed course code exactly into the confirmation field.
6. Select **Permanently delete course**.
7. Confirm that the course no longer appears in course administration or course lists.

For an eligible test course, Chisimba removes the course record, canonical course groups and memberships, course content relationships, disposable learning records, module configuration, stored course files and course images.

### When course deletion is blocked

Chisimba blocks permanent course deletion when the course has protected operational evidence, including:

- CPD ledger entries;
- financial payouts;
- certificate issuances;
- entitlement grants;
- payment intents associated with a course payment product.

Archive the course when this evidence belongs to real operation. Protected financial, certification, entitlement and CPD evidence must remain available for reconciliation and audit.

## Understanding the deletion preview

The preview is a safety checkpoint, not permission to delete later. Chisimba checks the safety switch and dependencies again when the final form is submitted.

The preview shows:

- **memberships** that will be removed;
- **directly owned records** that are disposable dependencies;
- **protected evidence** that prevents permanent deletion.

If Chisimba cannot complete its dependency scan, it refuses deletion. A database or module error must never be interpreted as “zero dependencies.”

The typed username or course code prevents accidentally deleting a neighbouring record. The confirmation is case-sensitive and must match the displayed value exactly.

## Before each cleanup session

Confirm all of the following:

- the latest application release containing guarded deletion is installed;
- module upgrades have completed successfully;
- a current database backup exists;
- user-content storage is included in normal backup or snapshot coverage;
- the target usernames and course codes have been agreed as test data;
- no learner, lecturer, payment, certificate or CPD process is using the target;
- another administrator knows that permanent deletion is temporarily enabled.

For a large cleanup, delete one representative test user and one representative test course first. Verify the result before continuing with the remainder.

## After each cleanup session

1. Return `ALLOW_USER_AND_COURSE_DELETE` to `false`.
2. Reload User Administration and a Course Control Panel; permanent-delete actions should no longer appear.
3. Confirm that expected operational users and courses remain available.
4. Record who performed the cleanup, when it was performed, and which test usernames or course codes were removed.
5. Retain the pre-cleanup backup according to the site's backup policy.

## Troubleshooting

### The permanent-delete action is not visible

Confirm that you are signed in as a site administrator and that the security parameter is exactly `true`. If the setting was just changed, reload the administration page.

### Deletion is blocked by protected records

This is expected safety behaviour. Review the non-zero protected categories in the preview. Archive operational data rather than attempting to bypass the protection.

### The confirmation is rejected

Copy the displayed username or course code exactly. Do not use the person's display name or the course title.

### Deletion reports a dependency or cleanup failure

Stop the cleanup session and disable `ALLOW_USER_AND_COURSE_DELETE`. Do not manually remove related rows. Check the application and PHP logs, confirm the database and content storage are available, and ask a technical administrator to investigate. Transactional database cleanup is rolled back when a dependency deletion fails, but a storage problem still requires inspection before retrying.

### A deleted item is needed again

Permanent deletion has no in-application undo. Restore from the verified pre-cleanup database and content backup using the site's recovery procedure. This is why archive remains the preferred action for operational data.

## Safety summary

- Disabled by default.
- Restricted to site administrators.
- Hidden and refused while disabled.
- Requires a dependency preview.
- Blocks protected financial, entitlement, certification, CPD and membership evidence.
- Requires an exact typed confirmation.
- Rechecks the switch at the final deletion boundary.
- Uses transactional database cleanup and removes associated stored content.
- Intended for disposable test data, not normal records management.
