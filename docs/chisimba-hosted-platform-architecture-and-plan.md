# Chisimba hosted platform: architecture and implementation plan

**Date:** 26 October 2026  
**Status:** Product and technical design; implementation has not started  
**Initial product:** Hosted learning for small organisations  
**Primary address model:** `theirname.ourname.com`

## 1. Purpose

Small organisations want to offer online learning without buying and managing a standalone server. Conversations with prospective users indicate demand for a service that supplies the hosting, maintenance and technical administration, while allowing each organisation to manage its own learning operation.

The proposed service gives each organisation a branded Chisimba site on a platform subdomain. Customers do not need to understand DNS, certificates or server management. For example:

- `acme.ourname.com`
- `bunny.ourname.com`
- `roadrunner.ourname.com`

These addresses are illustrative; the production domain has not been selected.

This is a separate product initiative from the EcoTraining proposal. It builds on existing experience hosting multiple Chisimba sites, but introduces a shared application that explicitly understands and isolates organisations.

The first release will be a managed service. An operator provisions organisations through a repeatable tool. Public self-service signup can follow once the underlying service is proven.

## 2. Decisions and boundaries

### Agreed direction

- One shared Chisimba application deployment serves multiple organisations.
- Each organisation receives a subdomain on the platform's domain.
- Each organisation has its own database, restricted database account, configuration and file storage.
- Branding builds on the maintained default skin rather than customer-specific code forks.
- Tenant development uses isolated feature branches and a separate test runtime.
- Existing sites remain on their established release path until tenant support is tested and deliberately released.
- The commercial model includes tiered plans, monthly and annual subscriptions, resource controls and a free 30-day Beginner trial.
- Trial signup requires a payment method.
- Tenancy and commercial services should support other Chisimba products later, including webinar management.

### Not yet agreed or implemented

Plan names, prices, allowances, annual discounts, payment-provider choice and final billing recovery rules remain open. Beginner, Advanced, Pro and Enterprise are working names.

The detailed interpretation of automatic payment at trial expiry needs confirmation: the recommended behaviour is uninterrupted paid service after a successful charge, with suspension for a cancelled or unpaid trial. Earlier discussion also described shutting off at expiry; that must not be implemented ambiguously.

No infrastructure, tenant branches, schema changes or application changes were made during the inspection. This document is a plan, not a deployment record or security certification.

## 3. Architecture in plain language

A tenant is one customer organisation. Its subdomain tells Chisimba which organisation a request belongs to. Before starting the normal engine, Chisimba selects that organisation's database, files, settings and security context.

```text
acme.ourname.com ──────┐
bunny.ourname.com ─────┼── HTTPS proxy ── Tenant resolver
roadrunner.ourname.com ┘                       │
                                    Fixed tenant context
                                              │
                              One shared Chisimba application
                                              │
                               Selected organisation's:
                           database · files · settings · keys
```

All organisations run the same framework and module release. Enabled capabilities, content and branding differ through configuration. A shared skin fix benefits every organisation.

Separate databases do not require separate application installations. They fit Chisimba's existing installation-wide tables and make per-organisation backup and restoration more manageable than extracting tenants from shared tables.

This remains a shared application and server security boundary. A serious application compromise or server outage can affect multiple customers. Database separation reduces accidental query-level mixing; it is not equivalent to separate machines or containers.

## 4. Current code inspection

The read-only inspection used the local `release/consolidation-20260930` checkouts:

| Repository | Inspected commit | Local state |
| --- | --- | --- |
| Framework | `449f3ae09`, dated 17 October 2026 | Clean |
| Modules | `7c2935718`, dated 20 October 2026 | Existing Knowledge Map edits, left untouched |

Remote branch verification failed because of local SSH configuration. These are local-source findings, not confirmation of remote or production state. Application tests and production database inspection were not performed. Refresh this baseline before implementation.

The repository guides and Chisimba constitution govern implementation. In particular, persistence belongs behind `dbTable`, the skin renders the canvas, existing canonical security services must be reused, and normal installation/update paths must own schema changes.

| Area | Verified source foundation | Required development |
| --- | --- | --- |
| Startup | `framework/app/index.php` checks one configuration path; the engine includes fixed database configuration | Resolve tenant before these operations; block installer exposure in hosted mode |
| Database | PDO MySQL is the supported backend; shared prepared-query, transaction, savepoint and schema services exist | Supply the selected tenant connection through this boundary |
| Configuration | Configuration-document objects support explicit paths but default to `config/` | Inject tenant paths consistently for reads and writes |
| Authentication | Canonical user, permission, session and MFA services exist | Bind all authentication state and credentials to tenant identity |
| Keys | `InstallationMasterKeyProvider` defaults to one installation key file | Select a separate tenant key through the same abstraction |
| Caches | Some keys have site prefixes; engine APC keys include unqualified configuration/object names | Namespace by immutable tenant ID or disable affected caches |
| Files | Guarded delivery checks records, permissions and confined paths | Tenant-specific roots and coordinated server routing for every access path |
| URLs | Engine URI generation uses request host/script information | Canonical tenant URL generation with trusted proxy handling |
| Branding | The maintained skin and canvas contract separate presentation from identity | A reusable configurable tenant canvas |
| Workers | Communications and AI workers boot directly into one site's engine | Common tenant-aware command-line startup |
| Video | Canonical URLs, provider profiles, signed callbacks and installation hooks exist | Tenant-scoped callbacks, ownership, credentials and usage |

No complete tenant implementation was found in the inspected application source. Existing services are reusable foundations, not proof of multi-tenant readiness.

## 5. Tenant registry and startup

A small platform registry records the immutable tenant ID, unique slug, canonical hostname, lifecycle status, database/storage references, secret references, enabled product and capabilities, provisioning progress and schema versions.

The slug is an address, not a database identifier or filesystem path. Renaming a business must not require moving its data. Reserve names such as `www`, `admin`, `api`, `mail` and `support`. Initially accept a constrained lowercase slug format.

Request processing must follow this order:

1. Validate the host and trusted proxy information.
2. Resolve an exact registered hostname under the configured platform domain.
3. Check tenant status and permitted access for that status.
4. Construct an immutable tenant context.
5. Select configuration, database, storage, session and key locations.
6. Start the Chisimba engine and normal authorisation checks.

Unknown hosts must fail closed, never fall back to another organisation or open the installer. Wildcard DNS does not imply that every hostname is a valid tenant.

Registry persistence must use the shared framework database implementation. Tenant modules must not receive the registry connection or database-creation credentials. Provisioning privileges belong to a restricted operator process.

Preserve an explicit single-site mode for existing installations. Missing tenant configuration must not silently activate it. Initially, one PHP request or worker process handles one tenant; do not switch tenants inside an already constructed engine.

## 6. Isolation and administration

| Resource | Required boundary |
| --- | --- |
| Database | Separate database and credentials; fixed connection for the request |
| Sessions | Tenant-specific storage namespace and tenant binding, including manually replayed session IDs |
| Cookies | Host-only secure cookies; prefer `__Host-` names; no parent-domain login cookie |
| Authentication | Tenant-bound remembered login, MFA, recovery, verification and CSRF state |
| Storage | Separate public/private uploads, previews, temporary files, exports and search indexes |
| Caches | Immutable tenant ID in data keys, locks, generated assets and invalidation |
| Encryption | Separate tenant master keys with protected backup and recovery |
| Jobs | Explicit tenant identity, bounded work, fair scheduling and tenant-specific locks |
| External services | Tenant-aware credential selection, ownership checks, callbacks and metering |
| Logs | Tenant labels without secrets or unnecessary private content |

Subdomains do not remove the need for CSRF protection and exact origin checks. Do not permit credentialed requests merely because an origin ends in the platform domain. User-uploaded active content must not become executable application content.

Create a constrained organisation-administrator role. It may manage users, courses, approved branding and permitted settings. It must not install arbitrary code, alter database/storage paths, access platform credentials or modify other organisations. Audit existing broad administrator shortcuts before exposing management screens.

Platform operators manage provisioning, subscriptions, limits, suspension and recovery. Sensitive operator changes require an audit record. Avoid unrestricted impersonation in the initial release.

## 7. Branding and URLs

Use `chisimba-reborn` as the shared rendering system, with one reusable configurable tenant canvas. It should support organisation name, logo, favicon, validated colour tokens, selected presentation options, homepage content, footer and terminology.

Store branding values and assets in tenant data, not in a new PHP directory per customer. Do not accept arbitrary PHP, JavaScript or unrestricted CSS. Use shared UI primitives, language services, contextual Help and accessibility checks, including colour contrast.

A canonical tenant URL service must cover navigation, redirects, assets, downloads, Ajax/API routes, invitations, password resets, email links, exports and external callbacks. Command-line jobs must generate the same approved public URLs as web requests.

Shared static code assets may remain common. Private file delivery must resolve the tenant, look up its file record, enforce ownership/permissions and constrain the filesystem path. Static aliases must not bypass those checks.

## 8. DNS and HTTPS

Use centrally managed wildcard DNS for `*.ourname.com`, with HTTPS certificates managed by the operator. Customers choose an available identifier and do not configure DNS or certificates.

A wildcard certificate can cover first-level tenant subdomains. Automated wildcard issuance with Let's Encrypt uses DNS-01 validation, so DNS-provider API capability and restricted validation credentials are operational requirements. The bare platform domain needs its own certificate coverage as appropriate.

Custom domains are deferred. The registry can allow verified additional hostnames later, without changing a tenant's internal identity or data.

## 9. Local testing at chisimba.test

The saved local configuration maps port `8445` through Nginx to the PHP 8.5 application and preserves the incoming hostname. The existing application directly mounts the current framework and modules working directories.

Therefore, switching those directories to tenant branches would affect the existing test site. Use isolated feature-branch checkouts and a separate tenant runtime instead.

| Address | Intended destination |
| --- | --- |
| `https://chisimba.test:8445/ch/` | Existing single-site environment |
| `https://acme.chisimba.test:8445/ch/` | Shared tenant test runtime, Acme data |
| `https://bunny.chisimba.test:8445/ch/` | Same tenant test runtime, Bunny data |

Setup requires explicit local hostname resolution, a trusted development certificate covering the tenant names, hostname-specific proxy routing, isolated code mounts, databases, storage and workers. Local hosts-file entries must name each test hostname; they are not wildcard DNS.

The `/ch/` prefix is suitable for the initial proof. Test root-mounted sites at `/` before release too. The actual configuration was inspected, but Docker permissions prevented verifying the running container state.

## 10. Provisioning and module bundles

Begin with an operator tool that performs a resumable sequence:

1. Reserve the slug and create a provisioning record.
2. Allocate the database, restricted account, storage and keys.
3. Install a versioned baseline through shared schema/catalogue services.
4. Execute required registration and installation hooks.
5. Create the owner through canonical user-provisioning services.
6. Assign the constrained organisation-administrator role.
7. Apply the product bundle, plan entitlements and branding defaults.
8. Check database, storage, login and routing readiness.
9. Activate the site and issue the owner's activation invitation.

Use durable progress records, idempotent steps and bounded cleanup for failed provisioning. Do not copy an existing customer's database as a template. Installation hooks matter: the video service documentation specifically warns that registration alone does not execute every required hook.

Offer a small approved learning bundle first. Module availability must be enforced on direct requests and service operations, not only menus. Audit each additional module's persistence, file access, permissions, jobs and external calls before enabling it for tenants.

## 11. Products, plans and subscriptions

Keep these concepts distinct:

| Concept | Meaning |
| --- | --- |
| Tenant | Organisation, identity, address and data boundary |
| Product | Learning initially; Webinar Management or another Chisimba offering later |
| Plan | Capability and allowance package within a product |
| Entitlement | A specific permitted feature or operation |
| Quota | Enforced resource allowance or operational ceiling |
| Usage | Measured consumption over a defined period |
| Subscription | Commercial agreement, billing interval and payment state |

Use one product subscription per organisation initially. Do not build a general multi-product checkout before it is needed, but avoid embedding learning-specific assumptions in the tenant or billing services.

Beginner, Advanced, Pro and Enterprise are provisional plan names. They are configurations of the shared application, not separate code implementations. Each needs defined features, included resources, operational limits, service/support commitments and monthly/annual prices.

Monthly versus annual payment is separate from allowance renewal. An annual subscription may receive monthly AI/video allowances. Define reset periods, rollover and upgrade/downgrade behaviour explicitly. Version plans and prices so edits do not silently change existing agreements.

## 12. Cost model and pricing work

Build a cost worksheet before selecting prices. Use measured or sourced inputs rather than invented customer numbers or prices.

| Cost group | Inputs to collect |
| --- | --- |
| Shared infrastructure | Server capacity, monitoring, backups, recovery storage and maintenance |
| Usage-driven services | Storage, bandwidth, email, video processing/delivery and AI |
| Customer service | Onboarding, support, administration and incident handling |
| Commercial operations | Payment fees, refunds, failed-payment handling and applicable taxes |

For each plan, model typical use, heavy use, trial consumption and the effect of different customer counts. Allocate shared costs against realistic capacity and occupancy. Include a contingency and an explicit approach to currency changes for externally priced services.

Markup and gross margin are different:

```text
Price with markup m = cost × (1 + m)
Price for gross margin g = cost ÷ (1 − g)
```

These simple formulas assume cost is already known. Where payment fees depend on the selling price, include them in the calculation rather than applying the formulas blindly. Separate tax-inclusive customer prices from net revenue in the worksheet.

Trial costs must also be funded by the service. Annual discounts should reflect actual economics and must not undermine provision for support and usage across the whole paid term.

No prices, margin targets or Beginner allowances have been agreed yet.

## 13. Resource control and metering

Enforce resource decisions at the point of consumption. Examples include checking storage before accepting uploads and reserving an AI allowance before a paid provider request. Reconcile reserved amounts against actual usage afterwards.

Use durable usage events with tenant ID, service, quantity/unit, timestamp, request identity and accounting status. Prevent duplicate charging/accounting when callbacks or jobs repeat. Handle uncertain provider outcomes through reconciliation, not silent retries.

Define warning thresholds, hard stops and upgrade/top-up paths. The recommendation is no automatic overage billing initially. Limits should explain what is blocked and how the customer can continue without losing work.

Apply concurrent-job limits, upload limits and scheduling fairness as well as monetary allowances. Existing file quotas and AI audit records are useful foundations, but do not constitute a complete tenant quota or billing system.

AI/video secrets and platform-wide accounts must not be visible to tenant administrators. Decide whether each integration uses tenant-owned credentials or a platform account with tenant attribution. Keep customer consumption and platform cost accounting distinct from estimated dashboards.

## 14. Trial policy

The following reflects the user's stated preferences:

| Item | Policy |
| --- | --- |
| Length | 30 days |
| Demonstrated plan | Beginner |
| Limits | Beginner limits, still to be defined |
| Payment method | Required; customer cancels before expiry to avoid payment |
| Reminders | Day 14, day 21, three days before expiry and one day before expiry |
| Expiry communication | Notice at the end of the trial |
| Suspended-trial data | Retained for paid activation for 14 days |
| Trial export | No product export entitlement |
| Paid customer data | Retained for 30 days after service ends, with export available |

Recommended timing: start the 30-day period when the site is ready and the trial activates, not while provisioning is incomplete. Store an exact expiry timestamp and show it clearly to the customer. Send scheduled notices once, even if a worker retries. Stop obsolete trial reminders after conversion.

### Payment-at-expiry decision requiring confirmation

Recommended interpretation:

- Successful authorised payment at expiry converts the site to paid Beginner without interruption.
- A cancelled trial or unsuccessful payment suspends ordinary site use at expiry.
- Suspended trial data remains available for paid activation for 14 days.
- The owner retains restricted billing/reactivation access; resource-consuming jobs stop.
- A paid conversion retains the same site, branding, users and content.

The expiry notice must match the outcome: paid activation, payment processing, or suspension. The payment processor's handling of pending charges and any short reconciliation window must be specified before implementation.

Signup must clearly present the selected billing interval, first charge amount and date, and cancellation process. Storing a payment method alone is not sufficient authorisation to charge an unspecified amount. Use provider-hosted collection/tokenisation; do not store raw card details in Chisimba.

## 15. Billing and subscription lifecycle

Reuse the existing payment-service foundations for verified events, immutable prices and idempotent fulfilment where suitable. Hosting subscriptions need a distinct entitlement consumer and lifecycle model. A tenant collecting course payments from its users is separate from the platform charging that tenant for hosting.

The platform should own hosting billing records. Tenant administrators must not be able to edit them through their learning database. Never activate a subscription merely because a browser returns to a success URL; rely on verified provider evidence and reconcile ambiguous results.

Model at least trial, active, cancellation-scheduled, payment-attention, suspended and deletion-scheduled states. Record paid-through time independently of renewal status.

Recommended cancellation behaviour for paid plans is to stop renewal while preserving access until the paid term ends. The 30-day paid-data retention period then begins at service end. Renewal retries, grace periods, refunds, annual cancellations, proration and chargebacks still need explicit rules.

Scheduled deletion must account for late verified payment events so a recovered account is not accidentally erased. Cancellation and reactivation operations require stable identities, audit records and protection against duplicate requests.

## 16. Retention, export and deletion

At suspension, block ordinary customer-site use while preserving a restricted owner route for permitted billing, recovery and export actions. The paid retention window permits export; the trial window permits paid activation but no product export.

Retention/deletion workflow:

1. Record the service-end event and applicable retention deadline.
2. Stop resource-consuming work and revoke ordinary access as appropriate.
3. Provide the permitted recovery/export actions and expiry notices.
4. At the deadline, confirm that no reactivation or payment reconciliation is pending.
5. Remove live tenant data, credentials and domain mappings through an audited process.
6. Allow protected backup copies to expire under a separately documented schedule.

Decide how slugs are reserved after deletion to avoid confusing links or account ownership. Financial records may have a different retention requirement from customer content. Product export restrictions must be reviewed separately from any applicable personal-data access obligations before launch; this document is not a legal retention policy.

## 17. Trial-abuse controls

Start with verified email, payment-provider risk checks, signup rate limits, one trial per organisation and strict limits on expensive operations. Use provider-supplied payment-method identifiers where appropriate without storing card details.

Flag repeated payment methods, suspicious signup patterns and repeated organisation identities for review. Do not automatically reject organisations merely because they share an office network or public IP address. Renaming a tenant or changing its subdomain must not reset the trial.

Keep a limited, documented abuse-prevention record and provide an operator override with an audit trail. Trial activation must not immediately permit unlimited email, video or AI consumption.

## 18. Operations and operator dashboard

Provide an operator view of tenant status, product/plan, trial expiry, renewal date, paid-through time, usage, estimated cost, payment issues, provisioning progress, backup age and schema version.

Operator actions should include provisioning, plan assignment, trial extensions, suspension/reactivation, approved credits, export and recovery. Record who changed what and why.

Backups must consistently capture database, files and recoverable configuration/key material, with copies off the shared server. Test restoration into an isolated target before replacing live tenant data. Restoring old state must not automatically replay email, payments, video operations or AI jobs.

Use one release manifest for framework/modules and per-tenant migration tracking. Shared code must tolerate the migration window, or use coordinated maintenance for incompatible changes. Failed migration of one tenant must be visible and must not silently leave it serving incompatible code.

## 19. Implementation stages

| Stage | Deliverable | Completion gate |
| --- | --- | --- |
| A: Design and release isolation | Agreed specification, isolated checkouts/build and deployment guards | Existing test/release paths remain separate; unresolved policies are visible |
| B: Tenant foundation | Registry, resolver, configuration and database selection | Acme/Bunny resolve correctly; unknown hosts fail; single-site mode still works |
| C: Isolation | Sessions, keys, files, caches, permissions and tenant-aware workers | Negative cross-tenant tests pass with colliding IDs and filenames |
| D: Usable learning sites | Branding, canonical URLs, approved learning bundle and owner role | Each organisation completes course setup and learning workflows |
| E: Managed provisioning and recovery | Resumable operator tool, backup, restore and suspension | Failed provisioning resumes safely; one tenant restores without affecting another |
| F: Commercial foundations | Cost worksheet, defined Beginner plan, entitlements and metering | Limits are enforced and usage accounting handles concurrency/retries |
| G: Trial and billing | Payment signup, reminders, conversion, cancellation and retention | Provider test-mode lifecycle and failure/reconciliation tests pass |
| H: Managed pilot | Small controlled customer cohort | Support effort, costs, reliability and customer experience measured |

Work on the cost model and product rules can run alongside the technical foundation. Do not defer quota enforcement until after customers can consume paid resources. Public self-service signup and custom domains follow the managed pilot; they are not prerequisites for proving demand.

### First milestone

**Two independently branded learning sites on separate local subdomains, served by one isolated Chisimba deployment, with verified isolation and a tested per-organisation restore.**

Do not start by building a full billing portal. Prove the data boundary, then complete the commercial lifecycle before a public paid launch.

## 20. Acceptance tests

- Use identical usernames, course codes, record IDs and filenames in Acme and Bunny.
- Attempt access using another tenant's session cookie, reset token, file ID and API credential.
- Test forged/unknown hosts, proxy headers and direct backend requests.
- Alternate requests between tenants through reused PHP workers to expose leaked state.
- Verify private originals, derivatives, previews and exports return the correct bytes or deny access.
- Check owner, ordinary member, outsider, anonymous and revoked-access cases.
- Confirm disabled capabilities cannot be invoked by direct URL or background work.
- Check generated email links, callback routing and provider ownership validation.
- Exercise quota reservations under concurrent requests and duplicate callbacks.
- Test trial reminders, cancellation, successful conversion, failed/pending payment and late reconciliation.
- Verify trial and paid retention deadlines, restricted export and reactivation.
- Restore one organisation while the other remains intact.
- Run existing single-site regression checks and shared database contract tests.

Use disposable fixtures and provider test modes. No production data, paid AI calls or unsolicited email is needed for these tests.

## 21. Open decisions before launch

1. Production domain and DNS provider.
2. Final plan names, Beginner capabilities and all resource allowances.
3. Prices, annual discount, cost-allocation assumptions and margin targets.
4. Confirmation of trial conversion versus suspension behaviour.
5. Monthly/annual selection during trial and upgrade/downgrade/proration rules.
6. Payment provider, supported payment methods and renewal-failure policy.
7. Reminder channels, pending-payment window and paid grace period.
8. Provider-account ownership for AI, video and email.
9. Backup retention, restore objectives and deletion/slug-reuse policies.
10. Support commitments and initial approved module bundle.

## 22. Reference material

- Governing principles: `chisimba-info/chisimba-constitution.md`.
- Repository guidance: `framework/AGENTS.md` and `modules/AGENTS.md`.
- Database contracts: `framework/tests/database/README.md`.
- Branding: `framework/app/skins/chisimba-reborn/CANVAS_CONTRACT.md`.
- File protection: `framework/tools/file-storage/README.md` (dated deployment claims require fresh verification).
- Payments: `modules/payment-service/README.md`.
- Video integration: `modules/video-service/README.md`.
- Local routing: `dev-environment/local-https/nginx-php85.conf` and `dev-environment/compose/php85.yml`.
- [Let's Encrypt challenge types](https://letsencrypt.org/docs/challenge-types/): wildcard DNS validation.
- [MDN Set-Cookie reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie): host-only cookies and cookie prefixes.

This document should be updated as decisions are confirmed and implementation evidence replaces proposals. It does not amend the Chisimba constitution or authorise deployment onto existing sites.
