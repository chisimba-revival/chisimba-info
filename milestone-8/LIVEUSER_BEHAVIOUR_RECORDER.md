# Milestone 8: LiveUser behaviour recorder

## Status

Recorder implemented and tested. Runtime capture is not activated.

## Purpose

The recorder creates a redacted, deterministic JSON representation of the
authentication state produced by LiveUser. These snapshots will become the
behavioural reference against which the native implementation is compared.

## Components

- `LiveUserBehaviourRecorderInterface`
- `AuthSnapshotRedactor`
- `LiveUserBehaviourRecorder`
- `LiveUserBehaviourCaptureBridge`
- standalone recorder tests
- a capture-state template
- a read-only integration-point audit script

## Security controls

- The bridge is disabled unless the constant
  `CHISIMBA_AUTH_RECORDER_ENABLED` is explicitly defined as `true`.
- Loading the recorder or bridge does not perform a capture.
- Passwords, hashes, secrets, tokens, nonces, session IDs, cookies,
  authorisation headers, and API keys are redacted recursively.
- Snapshot files are written with mode `0600`.
- The recorder accepts state supplied by a caller rather than reading globals
  implicitly.
- No authentication, authorisation, session, or database state is changed.

## Why activation is separate

A hook should be added only after the audit identifies the exact successful
login boundary and verified APIs for user identity, groups, roles, permissions,
language, context, and session state. This avoids guessing at LiveUser
internals or accidentally changing the request lifecycle.

## Next step

Run:

`dev-environment/tools/audit-liveuser-recorder-hook-points.sh`

The resulting `killme.txt` will be used to generate a small, reversible,
explicitly enabled capture hook.
