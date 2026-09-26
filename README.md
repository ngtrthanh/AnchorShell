# AnchorShell

**Windows-first remote operations workspace.**

AnchorShell combines WinSCP-class file management, SSH terminals, tunnels, server operations, and PowerShell automation in one native desktop application.

## Product contract

AnchorShell is not a cross-platform-everything client. Windows is the primary product.

Core principles:

1. **Files first** — dual-pane local/remote file operations must be fast and dependable.
2. **Intent != protocol** — a GUI action may execute through SFTP, a native remote command, tar-over-SSH, or rsync.
3. **PowerShell is the automation surface** — the GUI and PowerShell expose the same operation planner.
4. **Rust owns execution** — connection lifecycle, SSH/SFTP, transfer scheduling, tunnels, persistence, vault, and safety stay in Rust.
5. **LEAN + KISS** — no plugin marketplace, Kubernetes IDE, RDP/VNC suite, mobile parity, or collaboration layer until the Windows core is excellent.
6. **GitHub is canonical** — builds and releases are produced by GitHub Actions from tagged commits.

## Initial target

- Windows 11 x64
- Windows 10 x64 where practical
- Windows Server 2022/2025
- Tauri 2 + Rust
- React + TypeScript
- xterm.js
- SQLite
- SSH/SFTP engine in Rust
- PowerShell 7 integration

## End-state workspace

```text
SERVER
├─ Files
│  ├─ Local Windows filesystem
│  ├─ Remote SFTP
│  ├─ Smart copy/move/delete planner
│  ├─ Transfer queue
│  └─ Sync
├─ Terminal
│  ├─ SSH
│  ├─ PowerShell 7
│  ├─ Windows PowerShell 5.1
│  ├─ CMD
│  └─ WSL
├─ Tunnels
│  ├─ Local
│  ├─ Remote
│  └─ SOCKS
├─ Ops
│  ├─ Overview
│  ├─ Processes
│  ├─ Services
│  ├─ Ports
│  ├─ Storage
│  ├─ Network
│  ├─ Docker
│  └─ Logs
└─ Automation
   ├─ PowerShell
   ├─ SSH commands
   ├─ Scripts
   └─ Reusable workflows
```

## Build gates

See [docs/GATES.md](docs/GATES.md).

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Smart File Engine

See [docs/SMART_FILE_ENGINE.md](docs/SMART_FILE_ENGINE.md).

## Release policy

See [docs/RELEASE.md](docs/RELEASE.md).
