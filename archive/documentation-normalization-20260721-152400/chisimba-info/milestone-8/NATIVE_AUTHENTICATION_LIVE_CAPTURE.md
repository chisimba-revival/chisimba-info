# Milestone 8: live database-authentication shadow capture

## Design

The live hook in `user::authenticateUser()` delegates to
`NativeAuthShadowComparator`.

The comparator is disabled unless either:

- `CHISIMBA_NATIVE_AUTH_SHADOW` is explicitly defined as boolean `TRUE`; or
- `<contentBasePath>/auth-shadow/ENABLED` exists.

The marker-file approach is used for development because it can be enabled and
disabled without editing configuration or changing the login decision.

## Output location

Snapshots are written below Chisimba's configured content base:

`<contentBasePath>/auth-shadow/`

In the PHP 8.2 Docker runtime this is expected to be:

`/var/www/html/ch/usrfiles/auth-shadow/`

## Workflow

1. Run this installer.
2. Rebuild the PHP 8.2 runtime so the new source files are assembled.
3. Run `dev-environment/tools/enable-native-auth-shadow.sh`.
4. Log in once with a normal local database account.
5. Run `dev-environment/tools/collect-native-auth-shadow.sh`.
6. Upload `killme.txt`.
7. Run `dev-environment/tools/disable-native-auth-shadow.sh`.

## Safety

- LiveUser remains authoritative.
- A comparator exception is caught and logged.
- The comparator cannot change the authentication return value.
- The comparator performs no session writes.
- The comparator performs no database writes.
- Password and token fields are redacted.
- Snapshots use mode `0600`.
- LDAP providers remain out of scope.
