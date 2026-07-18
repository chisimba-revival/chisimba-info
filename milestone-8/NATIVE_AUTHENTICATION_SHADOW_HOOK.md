# Milestone 8: native authentication shadow hook

## Status

Installed in `user::authenticateUser()` but disabled by default.

## Activation

The hook executes only when this constant is explicitly defined as boolean
`TRUE` before authentication:

`CHISIMBA_NATIVE_AUTH_SHADOW`

No activation is added by the installer script.

## Behaviour

After the existing authentication path returns `TRUE`, the hook:

1. loads the same `tbl_users` record;
2. converts it to `CanonicalAuthenticationResult`;
3. derives the session values expected from `storeInSession()`;
4. compares them with the session established by the existing path;
5. writes a redacted JSON snapshot only when explicitly enabled.

The hook never changes:

- the authentication decision;
- the session;
- groups or permissions;
- the database;
- redirect behaviour.

All exceptions are caught and sent to the PHP error log. A recorder failure
cannot turn a successful login into a failure.

## Snapshot location

`framework/usrfiles/auth-shadow/`

Snapshot files are created with mode `0600`.

## Scope

Only local database authentication is being evaluated. Obsolete LDAP providers
are out of scope.
