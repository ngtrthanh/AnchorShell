# Windows Signing

AnchorShell release builds must be Authenticode-signed.

The tag-driven release workflow intentionally fails when signing material is missing.

## Required GitHub Actions secrets

- `WINDOWS_CERTIFICATE` — base64-encoded PFX code-signing certificate
- `WINDOWS_CERTIFICATE_PASSWORD` — password for the PFX private key
- `WINDOWS_TIMESTAMP_URL` — optional RFC3161 timestamp service URL

The release workflow imports the PFX into the Windows runner certificate store, injects its thumbprint into the Tauri Windows bundle configuration, builds the NSIS installer, and then verifies both:

- `anchorshell.exe`
- the generated NSIS setup `.exe`

with `Get-AuthenticodeSignature`.

A release is published only if both signatures report `Valid`.

## SmartScreen reality

Authenticode signing establishes publisher identity and integrity. It does not guarantee that Microsoft SmartScreen will never show a warning for a brand-new certificate or a new binary. SmartScreen reputation can require time/reputation even for properly signed applications.

Do not use self-signed certificates for public releases.
