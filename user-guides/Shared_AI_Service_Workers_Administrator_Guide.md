# Shared AI service workers: administrator guide

## Purpose

Some Chisimba AI features put durable work into a queue so a browser request does not wait for the AI provider. The workers currently covered by this guide are:

- AI-assisted marking of Online Worksheets;
- AI-assisted marking of Essays;
- whole-course chapter-quiz generation in MCQ Tests.

The browser queues work and shows progress. A host scheduler starts the workers. Provider credentials remain in Chisimba's protected shared-AI configuration inside the PHP container; never copy a provider key into a script, crontab or service file.

## Supplied operations script

Use:

```text
/run/media/derek/main/chisimba-revival/shellscripts/run-chisimba-ai-workers.sh
```

It checks that the PHP container and all three worker entry points exist, discovers the current bind-mounted module layout, prevents overlapping runs, and processes the three queues sequentially. It does not copy or synchronise module code into a runtime directory.

## Local PHP 8.5 development environment

From `/run/media/derek/main/chisimba-revival`:

```sh
shellscripts/run-chisimba-ai-workers.sh check
shellscripts/run-chisimba-ai-workers.sh run
```

The local default is `chisimba-php85-web`. If the name changes, pass it explicitly:

```sh
shellscripts/run-chisimba-ai-workers.sh check --container NEW_CONTAINER_NAME
```

An idle successful run resembles:

```text
worksheet: {"selected":0,"completed":0,"failed":0}
essay: {"selected":0,"completed":0,"failed":0}
chapter-quiz: {"selected":0,"completed":0}
```

`selected` is work claimed during that invocation. `completed` is work completed. Worksheet output also reports `failed`. An idle result is healthy; it means there was no queued work.

## Prerequisites

Before scheduling workers, confirm:

1. The shared AI service is configured and available in Chisimba.
2. The PHP application container has a stable name and is running.
3. Online Worksheets, Essays and MCQ Tests have been installed or upgraded so their queue tables exist.
4. The scheduling account is allowed to run `docker exec` for that container.
5. The script passes its `check` command.

Do not extend web-server or PHP request timeouts to compensate for a worker problem. The queue exists specifically to keep provider calls outside browser requests.

## Production scheduling with cron

Copy or deploy the repository script to a stable release-independent path if the production checkout path changes between releases. Keep it executable and owned by the deployment administrator.

Create a log directory writable by the deployment account. Then edit that account's crontab:

```sh
crontab -e
```

Example, every minute:

```cron
* * * * * /srv/chisimba/current/shellscripts/run-chisimba-ai-workers.sh run --container YOUR_WEB_CONTAINER --lock-file /srv/chisimba/ai-workers.lock >> /srv/chisimba/logs/ai-workers.log 2>&1
```

Use the real, verified checkout and container paths. The script's default batches are five worksheet submissions, five Essay submissions and twenty chapter-quiz steps per run. They can be adjusted within the worker limits:

```text
--worksheet-batch 1..20
--essay-batch 1..20
--quiz-batch 1..50
```

One scheduled invocation is sufficient for all three queues. Do not also schedule the individual PHP workers or the older single-worker systemd timer, because duplicate schedulers make incidents harder to diagnose.

## Starting, stopping and verifying

Start processing by installing or uncommenting the cron line. Run one manual check and one manual processing pass before relying on the schedule:

```sh
/srv/chisimba/current/shellscripts/run-chisimba-ai-workers.sh check --container YOUR_WEB_CONTAINER
/srv/chisimba/current/shellscripts/run-chisimba-ai-workers.sh run --container YOUR_WEB_CONTAINER
```

Verify the schedule and recent results:

```sh
crontab -l
tail -n 50 /srv/chisimba/logs/ai-workers.log
```

To stop new processing, comment out or remove only this script's cron line. This does not delete queued requests or saved previews. Reinstalling the schedule allows durable queued work to continue.

## Routine maintenance

After each Chisimba deployment:

1. Confirm the PHP container is running.
2. Run the script's `check` command.
3. Run it once manually and inspect both JSON summaries.
4. Confirm scheduled output continues to arrive in the log.
5. Submit a small non-production worksheet suggestion, Essay suggestion or quiz-generation job when the release changes AI integration code.

Rotate `ai-workers.log` with the host's normal log-rotation policy. Never log prompts, student answers, generated feedback or provider credentials. The supplied script retains the workers' compact summaries during normal operation, while an error includes diagnostic output for the administrator.

Review provider usage and success through the shared AI audit facilities. Normal audit information records matters such as feature, provider, model, duration, token use and success without storing the learner response in the audit record.

## Troubleshooting

### Container is not running

The script exits with `PHP container is not running`. Start or repair the application deployment, then rerun `check`. Do not change the configured name until `docker ps` confirms the correct container.

### Worker was not found

Run `check` after the deployment. The helper recognises the supported `ch/packages`, `packages` and `ch/modules` layouts. If neither worker exists, deploy or upgrade the relevant modules; do not copy an individual module into a separate runtime directory in the bind-mounted PHP 8.5 environment.

### Queued work remains waiting

1. Run the helper manually and inspect its exit status and output.
2. Confirm the cron entry belongs to an account with Docker permission.
3. Check the shared AI configuration and provider audit for failures or rate limits.
4. Confirm the database queue tables exist and the application can reach its database.
5. Check system time and container logs if jobs appear stuck in an unexpected state.

Lecturers can continue marking worksheets and Essays manually while AI is unavailable. Chapter-quiz generation previews remain queued or resumable rather than becoming published quizzes.

### Another run is active

The helper uses a non-blocking host lock. A skipped overlapping invocation is normal when the previous provider request is still running. Repeated skips for many minutes warrant checking the active process, Docker and provider responsiveness. Do not delete the lock file while a worker process is active.

### Provider request failed

Confirm configuration and provider availability before retrying. Avoid repeatedly requeueing the same work. Worksheet failures retain the manual marking route; AI suggestions do not save student marks automatically.

## Security and recovery rules

- Never store provider keys in cron, command-line arguments, logs or this helper script.
- Restrict Docker access to trusted deployment administrators; Docker control is privileged host access.
- Back up the Chisimba database as part of normal operations. Queued jobs live in that database.
- Stopping a scheduler is safer than deleting job rows. Do not remove queue data during diagnosis unless a specific recovery procedure has been agreed.
- A lecturer's reviewed save is the authoritative worksheet or Essay mark. Worker output is transient guidance only.
