# Milestone 8: read-only native authentication implementation

## Status

Implemented but not integrated. The LiveUser login path remains authoritative.

## Components

- `NativeDatabaseAdapterInterface`: parameterised database boundary.
- `NativeUserRepository`: reads and normalises the retained `tbl_users` schema.
- `NativePasswordVerifier`: verifies modern `password_hash()` values and recognised
  legacy MD5, SHA-1, and `crypt()` values.
- isolated array-backed tests that require no running Chisimba installation;
- a JSON snapshot comparator for later LiveUser/native behavioural comparison.

## Safety decisions

- Repository writes are disabled unless the constructor receives an explicit
  `true` value.
- The supplied test suite uses the default read-only mode and asserts that zero
  database writes occurred.
- Unknown or plaintext password formats fail closed.
- No password rehash is performed.
- No login controller, engine, object factory, session class, or feature flag is
  changed.
- No database adapter is registered in the Chisimba runtime yet.

## Next evidence required

1. Inspect the actual `auth_database` password calculation and confirm whether
   deployed local accounts use plain MD5, salted MD5, SHA-1, or another format.
2. Build an adapter around the current Chisimba database abstraction.
3. Capture redacted LiveUser snapshots for selected test accounts.
4. Run equivalent native repository/group/permission snapshots.
5. Resolve all mismatches before shadow-mode integration.
