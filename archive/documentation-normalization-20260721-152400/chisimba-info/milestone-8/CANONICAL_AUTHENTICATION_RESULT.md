# Milestone 8: canonical authentication result

## Status

Implemented and tested, but not connected to the running login flow.

## Purpose

Authentication providers should answer one question:

> Did authentication succeed, and which identity was authenticated?

They should not independently establish Chisimba session state.

The canonical result provides one provider-neutral representation that can be
created from the current LiveUser/database path or from the new native path.

## Contract

A result contains:

- status: success, failure, inactive, or error;
- provider identifier;
- Chisimba user ID and username;
- identity fields needed by the traditional session;
- groups, roles, and permissions when available;
- non-secret metadata;
- failure or error reason.

Passwords and password hashes are never copied into the result.

## Compatibility

`toLegacyUserRecord()` reconstructs the record shape currently consumed by
`storeUserSession()`:

- username
- userid
- title
- firstname
- surname
- creationdate
- emailaddress
- logins
- isactive
- accesslevel

This gives us a controlled seam for later adapting `storeInSession()` without
changing its externally visible behaviour.

## Adapters

- `LegacyAuthenticationResultAdapter` converts the existing `tbl_users` record.
- `NativeAuthenticationResultAdapter` converts native repository output.

## Not changed

- LiveUser
- `auth_database`
- `user::authenticateUser()`
- `user::storeUserSession()`
- `user::storeInSession()`
- login controllers
- sessions
- database records

## Next step

Create a disabled shadow adapter in the existing database authentication path.
After LiveUser reports success, it will build a canonical result from the same
already-loaded user record and compare it with the expected legacy session
record. It will not yet influence the login decision or session.
