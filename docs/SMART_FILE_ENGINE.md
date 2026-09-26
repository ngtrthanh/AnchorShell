# Smart File Engine Specification

## 1. Problem

Traditional SFTP clients can become very slow on large directory trees because recursive operations may require many protocol round trips.

AnchorShell must treat file operations as intent and choose a faster safe execution path when possible.

## 2. Planner inputs

The planner may consider:

- operation type
- source and destination location
- same host vs cross host
- file count if known
- total bytes if known
- recursive flag
- server capabilities
- availability of `tar`
- availability of `rsync`
- privilege requirements
- symlink policy
- metadata preservation requirements
- user policy
- safety classification

The planner must not require a full recursive pre-scan when that pre-scan would itself create the performance problem.

## 3. Backends

### SFTP backend

Use for:

- interactive browsing
- single files
- small selections
- chmod/chown
- remote edit
- compatibility fallback

### Native remote backend

Use for same-host operations when safe:

```text
move    -> mv
copy    -> cp
delete  -> rm
size    -> du
find    -> find
```

Do not concatenate raw user paths into shell strings.

### Tar-over-SSH backend

Large remote -> local directory transfer:

```text
remote tar stream
      |
      | SSH
      v
local streaming extractor
```

Large local -> remote transfer:

```text
local tar stream
      |
      | SSH stdin
      v
remote tar extractor
```

No temporary archive should be required for the normal streaming path.

### Rsync backend

Use when:

- rsync exists on the remote
- operation semantics match
- repeated synchronization benefits from delta transfer

Rsync is optional, not a hard dependency.

## 4. Initial selection policy

Start simple.

```text
single file / small interactive selection
  -> SFTP

same-host move
  -> native mv

same-host recursive delete
  -> native rm after safety checks

large recursive upload/download
  -> tar-over-SSH

sync
  -> rsync when available
  -> optimized fallback otherwise
```

Do not add an ML or scoring system.

## 5. Destructive-operation safety

Before native delete:

- canonicalize path
- reject empty path
- reject `/`
- reject `.`
- reject `..`
- reject protected roots by policy
- display resolved target
- require explicit confirmation for recursive destructive operation
- never expand untrusted path text through an interactive shell

Initial protected paths:

```text
/
/bin
/boot
/dev
/etc
/home
/lib
/lib64
/opt
/proc
/root
/run
/sbin
/srv
/sys
/usr
/var
```

Deleting a child under these roots is allowed when the exact resolved target is not the protected root itself.

## 6. User-visible execution plan

Before a substantial operation, AnchorShell should be able to show:

```text
Operation: Delete directory
Target: /var/cache/myapp
Method: Remote native delete
Network transfer: negligible
Cancellation: best effort once remote command starts
```

For large download:

```text
Operation: Download directory
Source: /srv/archive
Destination: D:\archive
Method: tar-over-SSH
Compression: auto/off
Metadata policy: Windows-compatible
```

## 7. Cancellation semantics

Cancellation capability differs by backend.

The UI must report actual semantics, not a generic Cancel button.

Examples:

- queued SFTP -> immediate
- active SFTP -> stop after current bounded chunk/request
- tar-over-SSH -> terminate channel and clean incomplete destination according to policy
- remote native delete -> best effort; remote process may already have completed

## 8. Benchmark gate

G3 requires a reproducible benchmark corpus:

- 10 files
- 1,000 files
- 100,000 small files
- mixed tree
- one multi-GB file

Measure:

- preparation time
- transfer/delete time
- CPU
- memory
- network bytes
- correctness
- cancellation behavior

Do not claim performance improvement without benchmark evidence.
