# Local authentication compatibility removal checklist

The local database provider is now the built-in canonical authentication path.
LDAP, OAuth/OIDC, Google, Twitter, Facebook, OpenID, and other external
mechanisms belong in independently installable login plugins.

## Temporary compatibility still present

`auth_database::authenticateNatively()` currently calls
`LegacyAuthSessionBridge` and `storeNativeCompatibilityPrincipal()` so unmigrated
callers continue to receive the historical `userprincipal` session value.

## Removal gate

Remove the bridge only after every consumer of the legacy authentication/session
contract has migrated to the canonical authentication and session services.

## Exact removal work

- Remove the `legacyauthsessionbridge.php` require and construction from
  `auth_database_class_inc.php`.
- Remove `storeNativeCompatibilityPrincipal()` and its call.
- Delete `security/classes/nativeauth/legacyauthsessionbridge.php` if no other
  caller remains.
- Remove tests and documentation that assert the serialized `userprincipal`
  compatibility contract.
- Verify local login, logout, inactive users, administrator authorization,
  session fixation protection, remember-me behaviour, and legacy-hash upgrade.
- Confirm `rg` finds no runtime consumer of the old LiveUser login/session API.

## External-provider extraction

Move LDAP and OAuth/OIDC/social-login implementations, configuration, callbacks,
and UI into login plugins. Core retains only provider interfaces, registry,
orchestration, canonical results, and the built-in local provider.
