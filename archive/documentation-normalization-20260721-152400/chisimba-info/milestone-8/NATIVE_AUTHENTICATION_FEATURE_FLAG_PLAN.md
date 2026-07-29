# Native authentication feature-flag integration plan

## Principle

The native path must remain absent from production behaviour until it has demonstrated
parity. The flag is a rollout and rollback control, not a substitute for testing.

## Proposed states

1. `legacy` — LiveUser only. This remains the default.
2. `shadow` — LiveUser decides; native code performs a non-session comparison and logs
   redacted differences. Password material must not be logged.
3. `native_selected_users` — native path only for an explicit test allow-list.
4. `native` — native path authoritative, with immediate rollback to `legacy`.

## Integration sequence

1. Confirm the current service creation point and login controller call graph.
2. Implement schema-backed adapters behind the scaffold interfaces.
3. Add unit tests for each adapter and result object.
4. Capture LiveUser session keys, redirects, groups, and permissions in integration tests.
5. Implement `shadow` comparison without creating a second authenticated session.
6. Review difference logs and resolve every unexplained mismatch.
7. Enable selected-user testing in the PHP 7.4 environment.
8. Repeat the same suite in PHP 8.2.
9. Document rollback and database implications.
10. Only then consider changing the default.

## Safety constraints

- The flag must default to `legacy` when missing, unreadable, or invalid.
- A runtime error in native authentication must fail closed or return to the explicitly
  configured legacy path; it must never silently authenticate.
- Shadow mode must not mutate password hashes, login counters, sessions, or audit records.
- Rollback must require no database downgrade.
- Logs must contain stable user identifiers only where access controls permit them.

## Files intentionally not changed by this scaffold

- Existing login controllers and templates.
- Existing LiveUser classes and configuration.
- Chisimba object-factory registrations.
- Database schema and installer SQL.
- Runtime assembler and Docker images.
