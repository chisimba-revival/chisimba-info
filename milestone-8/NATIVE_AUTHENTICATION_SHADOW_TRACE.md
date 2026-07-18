# Milestone 8: native-auth shadow breadcrumb trace

## Purpose

This temporary trace identifies which authentication and comparison boundaries
are reached during a real local database login.

## Breadcrumb sources

- `user.authenticateUser`
- `auth_database.authenticate`
- `shadow.compare`

## Safety

- tracing uses the existing `auth-shadow/ENABLED` marker;
- passwords and session-like values are redacted;
- trace failures are swallowed;
- no authentication result, session value, or database row is changed.

## Workflow

1. Run this installer.
2. Rebuild the PHP 8.2 runtime.
3. Run `enable-native-auth-shadow.sh`.
4. Log in once using the normal local database login.
5. Run `collect-native-auth-shadow-trace.sh`.
6. Upload `killme.txt`.
