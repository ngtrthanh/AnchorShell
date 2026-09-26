# AnchorShell Product Specification

## 1. Product statement

AnchorShell is a Windows-first remote operations workspace for people who manage Linux and Windows servers from Windows every day.

It combines:

- WinSCP-class file management
- SSH terminals
- port forwarding
- lightweight server operations
- PowerShell 7 automation

The product goal is not maximum feature count. The goal is to make common remote operations faster, safer, and reproducible.

## 2. Primary user

Developers, SREs, sysadmins, DevOps engineers, and technical operators who work mainly from Windows and frequently perform:

- file transfer
- remote file editing
- recursive copy/move/delete
- shell work
- deployment
- tunnel setup
- service inspection
- Docker operations
- repeatable maintenance tasks

## 3. Core UX model

One saved host opens one workspace.

```text
Host Workspace
├─ Files
├─ Terminal
├─ Transfers
├─ Tunnels
├─ Ops
├─ Commands
└─ Notes
```

Multiple host workspaces can be open at once.

## 4. Product differentiators

### 4.1 Smart File Engine

The UI expresses intent. The backend chooses the execution mechanism.

Examples:

- small interactive file action -> SFTP
- same-host recursive delete -> remote native command
- same-host move -> remote native `mv`
- large recursive transfer -> tar-over-SSH
- repeated tree synchronization -> rsync when available
- fallback -> optimized SFTP

### 4.2 PowerShell-first automation

Every important GUI operation should map to an automation primitive.

Target examples:

```powershell
Connect-Anchor host01
Get-AnchorFile host01 /var/log/app.log .
Send-AnchorFile host01 .\dist /opt/app -Recursive
Remove-AnchorItem host01 /var/cache/app -Recursive
Invoke-Anchor host01 "docker ps"
Start-AnchorTunnel host01 -LocalPort 5433 -RemotePort 5432
Sync-AnchorFolder host01 .\site /var/www/site
```

GUI actions should eventually support **Copy as PowerShell**.

### 4.3 Windows-native workflow

AnchorShell should integrate naturally with:

- PowerShell 7
- Windows OpenSSH
- Windows filesystem
- Windows shell drag/drop
- Windows Terminal where external terminal launch is useful
- WSL
- ssh-agent
- Windows notifications
- taskbar progress
- Explorer context actions where justified

## 5. Non-goals for v1

Deferred until the Windows core is mature:

- Android
- iOS/iPadOS
- macOS parity
- Linux desktop parity
- RDP/VNC
- Kubernetes IDE
- cloud storage browser
- plugin marketplace
- team collaboration
- hosted SaaS sync
- elaborate monitoring/alerting platform

## 6. Quality bar

A feature is not complete because the UI exists.

Completion requires:

- functional behavior
- failure behavior
- cancellation behavior
- progress visibility
- persistence where applicable
- automated test coverage for critical logic
- Windows build PASS in GitHub Actions
- physical smoke validation for features that cannot be proven statically

## 7. Version strategy

Before first usable alpha:

```text
0.1.0-alpha.1
0.1.0-alpha.2
...
```

After the file, terminal, transfer, and tunnel core is usable:

```text
0.1.0-beta.1
```

First stable release is `1.0.0` only after the release gate in `docs/GATES.md` is satisfied.
