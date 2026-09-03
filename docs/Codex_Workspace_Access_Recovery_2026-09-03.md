# Workspace access recovery — 3 September 2026

The previous standalone Codex task remained rooted in a Documents/Codex directory despite UI folder changes. Repository reads worked, but edits outside its project were rejected. Permission requests returned null grants without a usable approval screen.

Creating this continuation task directly in `/run/media/derek/main/chisimba-revival` restored tested read/write access. Before implementation, harmless uniquely named files were created with `apply_patch` in the project root and `modules`, read back, and removed. All operations succeeded. Existing project files were untouched and the four pending Discussion modifications remained present.

For a similar blocker, check the task's actual working directory and writable roots. Start a continuation task attached directly to the intended repository if the old task is rooted elsewhere; transfer the handover, then prove access with harmless create/read/remove probes before resuming. This worked in this instance; it does not establish the underlying app defect or guarantee every permission issue is fixed.

Do not request filesystem permissions on the Docker socket. That previously caused the sandbox to treat `/run/docker.sock/.git` and `.codex` as directories and broke commands. Do not repeatedly request unchanged permissions or modify Codex configuration to bypass the problem.

Source task: `01a0665c-8a73-7403-bc8b-09b5b97b8a64`. Successful continuation: `01a067b5-f82e-7793-8130-30415f49a1d8`.

Follow-up evidence: local Docker commands work with ordinary command escalation; no socket filesystem permission was requested. This does not grant writes to every descendant directory: creating a diagnostic in `dev-environment/runtime/php85-ch` failed, and that directory is owned by `nobody:nogroup`. The diagnostic was instead created in the writable Discussion scripts directory, executed through its existing container mount, and removed. The in-app browser still rejects the local HTTPS certificate with `ERR_CERT_AUTHORITY_INVALID`; workspace recovery did not resolve certificate trust.

Browser follow-up: at Derek's request, the Chrome plugin successfully controlled an existing Chrome tab at the local HTTPS site. Lecturer saves, learner replies and fresh AI re-marking were then verified in Chrome without bypassing a certificate warning. Prefer this tested Chrome route for continuing local browser work when the in-app browser rejects this private certificate.
