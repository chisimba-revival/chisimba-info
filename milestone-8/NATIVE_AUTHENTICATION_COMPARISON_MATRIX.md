# Native authentication comparison test matrix

Each scenario must be executed first against the current LiveUser path and then against
the default-off native path. Results must match unless an intentional, reviewed security
improvement is documented.

| Area | Scenario | Legacy observation to capture | Native acceptance criterion |
|---|---|---|---|
| Login | Valid active local user | Redirect, session keys, audit data | Exact behavioural parity |
| Login | Unknown username | Message, response, audit data | No user enumeration |
| Login | Wrong password | Message, response, audit data | Same external result as unknown user |
| Login | Empty username/password | Validation and redirect | Equivalent safe rejection |
| Account | Inactive user | Message and session state | No authenticated session |
| Account | Deleted/missing backing record | Failure handling | Fail closed without warnings |
| Password | Current production hash | Successful verification | Equivalent success |
| Password | Legacy hash eligible for upgrade | Existing behaviour | Successful login plus safe rehash |
| Password | Failed legacy verification | Existing behaviour | Hash remains unchanged |
| Session | Session fixation attempt | Identifier before/after login | Identifier regenerated |
| Session | Logout | Cookies and session keys removed | No authenticated residue |
| Session | Inactivity timeout | Timing and redirect | Equivalent expiry |
| Routing | Requested protected page before login | Return destination | Equivalent post-login routing |
| Groups | User in one group | Effective groups | Same group set |
| Groups | User in nested/multiple groups | Resolution order | Same effective membership |
| Permissions | Direct user permission | Allow/deny result | Exact parity |
| Permissions | Group-derived permission | Allow/deny result | Exact parity |
| Permissions | Administrator behaviour | Special-case semantics | Exact parity |
| Security | SQL metacharacters in username | Error/log behaviour | Parameterised, generic rejection |
| Security | HTML/script in username | Rendering/log behaviour | No reflected executable content |
| Reliability | Repository/database unavailable | Current failure mode | Fail closed; protected diagnostic |
| Compatibility | PHP 7.4 | Full suite | Pass |
| Compatibility | PHP 8.2 | Full suite | Pass |
