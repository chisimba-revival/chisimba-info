# Registration protection: administrator guide

## Find the controls

Sign in as a site administrator and open **My Administration**. Under **New
registrations**, choose **Registration protection**. Its **Help with this page**
button opens the contextual guide; Escape closes it and returns focus to the
button. Other users cannot access the management page or dismiss requests.

## Review an unusual name

A long name with many changes between upper and lower case may be labelled
**Unusual name pattern: review**. This is a hint, not proof of a fake account.
International names are accepted; the name hint never automatically removes an
account. For a completed registration, **Unusual name: review account** opens
User Administration, where the existing account review and archive controls apply.
Check the person's activity and relationships before using those controls.

## Dismiss an unwanted unconfirmed request

1. Find the request under **Waiting for confirmation**. This dashboard list shows
   requests older than 24 hours that are still within their confirmation period.
2. Choose the bin icon beside **Send reminder**.
3. Check the name and email on the confirmation page. Choose **Dismiss
   registration** to confirm, or **Cancel** to leave it unchanged.
4. A success message confirms dismissal. Reloading does not repeat the action.

Dismissal cancels the pending request and its verification links and clears its
saved password. It does not delete a canonical user account. The applicant can
register again if the dismissal was a mistake; there is no Restore button for
the old request. Identifying details remain for the configured retention period,
then scheduled cleanup redacts them. A minimal audit record remains.

Requests that became verified or linked to an account/payment cannot be dismissed
through this control. A stale page may therefore report that dismissal is no
longer available. Reopen the page and review its current state.

## Reminders and limits

**Send reminder** queues a supportive message with a fresh verification link. It
does not extend the request's confirmation deadline. A recent reminder blocks
another administrator reminder for 24 hours, and shared verification-email limits
also apply. Communications must have a running worker for queued mail to be sent.
Already queued messages may still arrive after dismissal, but their links cannot
activate the dismissed request.

Signup/recovery limits count requests across changing browser sessions and email
addresses, using independent network-address, email-address and site budgets.
Verification emails have separate shared limits, including resends. Existing form
timing and honeypot checks also remain active. No Cloudflare subscription or AI
service is required for these protections.

## Understand automatic cleanup

The default confirmation period for new requests is **7 days**. Existing requests
retain the deadline assigned when they were created. Expired requests are marked
expired, their saved passwords are cleared, and their verification links stop
working. After a further **30 days**, cleanup redacts the pending record's names,
username, contact details and identity-document information.

Verified requests, linked accounts, selected payment products and existing
canonical username/email matches are held for review. Cleanup does not delete
accounts, payments, enrolments or learning materials. Minimal audit events, opaque
references and timestamps remain. Separate email and legal-acceptance records
follow their own retention policies.

**Cleanup preview** changes nothing. It shows a bounded set of up to 200 candidates
with proposed expiry/redaction actions and protected counts. A large backlog can
require multiple runs. The enabled message describes the configuration; the
server administrator must also verify that a schedule is running.

## Change the policy

Choose **Change registration settings**. Adjust the confirmation period, retention
period or request budgets through the normal System Configuration editor and
save the relevant setting. New confirmation periods affect new requests;
retention changes affect eligibility on the next cleanup run. Shortening retention
can make existing dismissed/expired details immediately eligible for redaction.

Leave trusted-proxy settings to the server administrator. Incorrectly trusting
forwarded addresses can undermine limits; failing to configure a real proxy can
cause unrelated visitors to share its network-address budget. Shared schools or
organisations may need larger limits for legitimate registration sessions.

If a legitimate person reaches a limit, ask them to try later or review the site
budgets. If their request expired or was dismissed, they can register again.
Stopping cleanup does not undo expiry or restore redacted information.

## Server installation and operations

For a new Chisimba installation, use the
[complete worker checklist](../../dev-environment/docs/workers.md) and the
[registration cleanup setup guide](../../dev-environment/docs/registration-cleanup-worker-production.md).
These explain preview-first activation, cron/systemd alternatives, logs, batching,
verification, stopping and recovery. Registration cleanup is a separate worker
from email and AI processing.

## Closing new account registration

The installation's **Allow self registration** setting (`KEWL_ALLOW_SELFREGISTER`)
controls new public login accounts. Set it to `FALSE` to close registration; set it
to `TRUE` to reopen it. The registration page and direct submissions both enforce
this setting. Existing users can still sign in or reset passwords, and existing
pending requests can still confirm their email. Webinar bookings and newsletter
subscriptions use separate settings.
