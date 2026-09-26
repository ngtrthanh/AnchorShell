# AnchorShell Build Gates

A gate is PASS only when every acceptance item is evidenced.

Static inspection is not runtime proof.

## G0 — Constitution and repository baseline

Scope:

- product contract
- architecture contract
- Smart File Engine contract
- release policy
- issue-driven gate plan

PASS:

- [x] Windows-first scope documented
- [x] LEAN/KISS non-goals documented
- [x] Smart File Engine documented
- [x] PowerShell automation boundary documented
- [x] GitHub-native release policy documented

No binary release at G0.

## G1 — Bootable Windows shell

Build the minimum native application.

Scope:

- Tauri 2
- React + TypeScript
- Rust backend
- app boots on Windows x64
- basic navigation shell
- Settings page
- dark/light/system theme
- GitHub Actions Windows CI
- unsigned NSIS installer artifact

PASS:

- [ ] `npm ci`
- [ ] frontend production build
- [ ] Rust compile/check
- [ ] Tauri Windows build
- [ ] installer artifact uploaded by GitHub Actions
- [ ] application physically starts on Windows
- [ ] version visible in UI

Release target: `v0.1.0-alpha.1`

## G2 — Host + SSH + terminal

Scope:

- saved hosts
- password auth
- private-key auth
- host-key verification
- SSH terminal
- reconnect
- terminal resize
- local PowerShell 7 launch
- local CMD
- local WSL when present

PASS:

- [ ] connect to Linux host
- [ ] host-key first-use flow
- [ ] reconnect test
- [ ] key import test
- [ ] 30-minute terminal soak
- [ ] large-output terminal test without UI freeze

Release target: `v0.1.0-alpha.2`

## G3 — Files + Smart File Engine v1

Scope:

- dual-pane Commander UI
- local Windows browser
- remote SFTP browser
- upload/download
- rename
- mkdir
- remote edit
- transfer queue
- native same-host move
- native recursive delete
- tar-over-SSH upload/download
- planner preview

PASS:

- [ ] SFTP small-file correctness
- [ ] 100k-file remote delete benchmark
- [ ] 100k-file download benchmark
- [ ] tar stream correctness
- [ ] cancellation tests
- [ ] protected-path destructive test
- [ ] no raw path interpolation vulnerability in generated commands

Release target: `v0.1.0-alpha.3`

## G4 — Sync + transfer resilience

Scope:

- retry/resume where protocol permits
- conflict policy
- folder compare
- rsync capability detection
- rsync backend
- fallback sync
- bandwidth/progress statistics

PASS:

- [ ] interrupted transfer recovery
- [ ] conflict cases
- [ ] symlink cases
- [ ] timestamp cases
- [ ] rsync unavailable fallback
- [ ] repeated sync benchmark

Release target: `v0.1.0-alpha.4`

## G5 — Tunnels + workspace

Scope:

- local forward
- remote forward
- SOCKS
- saved tunnels
- autostart
- live status
- connection counters
- split terminal
- saved workspace
- multi-host tabs

PASS:

- [ ] tunnel reconnect
- [ ] port-in-use handling
- [ ] local/remote/SOCKS smoke
- [ ] workspace persistence

Release target: `v0.1.0-alpha.5`

## G6 — PowerShell automation surface

Scope:

- PowerShell module
- same operation API used by GUI
- host query
- upload/download
- invoke command
- delete/move
- sync
- tunnels
- operation status
- **Copy as PowerShell** for supported GUI operations

PASS:

- [ ] PowerShell 7 import
- [ ] no duplicate business logic in PowerShell layer
- [ ] pipeline-friendly objects
- [ ] error semantics documented
- [ ] GUI operation and PowerShell equivalent produce same planner result

Release target: `v0.1.0-beta.1`

## G7 — Lightweight Ops

Scope:

- overview
- processes
- services
- ports
- disks
- network
- Docker list/logs/stats/exec

PASS:

- [ ] capability detection
- [ ] Linux distro compatibility matrix
- [ ] no privileged action without explicit user action
- [ ] bounded refresh timers
- [ ] hidden/inactive panels stop polling

Release target: `v0.2.0-beta.1`

## G8 — Windows productization

Scope:

- signed installer
- auto-update
- winget submission
- Explorer integration where justified
- Windows notifications
- taskbar transfer progress
- installer upgrade/uninstall tests

PASS:

- [ ] signed binary
- [ ] clean install
- [ ] upgrade install
- [ ] uninstall
- [ ] auto-update rollback/failure behavior
- [ ] fresh Windows VM smoke

Release target: `v0.9.0-rc.1`

## G9 — Stable release

PASS requires:

- [ ] no known critical security issue
- [ ] no known data-loss issue
- [ ] Smart File Engine benchmark published
- [ ] Windows 11 x64 acceptance
- [ ] Windows Server acceptance
- [ ] migration/import path documented
- [ ] release artifact signed
- [ ] checksum published
- [ ] release notes published

Release target: `v1.0.0`
