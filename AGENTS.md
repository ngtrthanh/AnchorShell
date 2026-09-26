# AGENTS.md

## Mission

Build AnchorShell as a Windows-first remote operations workspace.

Read before coding:

1. `README.md`
2. `docs/PRODUCT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/GATES.md`
5. `docs/SMART_FILE_ENGINE.md`
6. `docs/RELEASE.md`

## Non-negotiable rules

- LEAN + KISS.
- Work only inside the active gate.
- Do not import later-gate scope because it is convenient.
- GUI intent must not be coupled directly to SFTP.
- PowerShell automation must call the same operation layer as the GUI.
- Rust owns connection lifecycle, operation planning, transfer execution, tunnels, persistence, vault and safety.
- Do not duplicate business logic in PowerShell.
- Do not claim runtime PASS from static checks.
- Official Windows binaries come from GitHub Actions.
- No local developer binary is an official release.
- Destructive remote-native file operations require canonical-path safety checks.
- Do not interpolate raw user paths into shell command strings.
- Performance claims require benchmark evidence.

## Current gate

G1 — Bootable Windows shell + GitHub installer.

Do not begin G2 until G1 CI/build acceptance is recorded.
