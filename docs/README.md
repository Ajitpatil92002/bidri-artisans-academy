# bidriart.com — Project Docs

Everything about the project is recorded here. Read these before starting any work.

| File | What it holds |
|---|---|
| [project-overview.md](project-overview.md) | What we're building, for whom, and the feature scope |
| [architecture.md](architecture.md) | How the app is built: services, routes, data model, checkout flow |
| [decisions.md](decisions.md) | Every decision made, with date and reason |
| [features/](features/README.md) | One folder per feature: scope, tasks, progress |
| [tasks.md](tasks.md) | Index of tasks and what's waiting on the owner |
| [changelog.md](changelog.md) | A dated log of what was actually done |
| [design/](design/README.md) | The design, once it's provided |

## How these docs stay current

- A new decision goes into `decisions.md` before the code that depends on it.
- A task's status in its feature's `tasks.md` changes when the work starts and when it's done, and each change gets a line in that feature's progress log.
- Every working session adds an entry to `changelog.md`.
