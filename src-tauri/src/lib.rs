use serde::Serialize;
use std::process::Command;

#[derive(Serialize)]
struct PowerShellInfo {
    executable: Option<String>,
    edition: String,
}

#[cfg(target_os = "windows")]
fn find_executable(name: &str) -> Option<String> {
    let output = Command::new("where.exe").arg(name).output().ok()?;
    if !output.status.success() {
        return None;
    }
    String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(str::trim)
        .find(|line| !line.is_empty())
        .map(str::to_string)
}

#[cfg(not(target_os = "windows"))]
fn find_executable(_name: &str) -> Option<String> {
    None
}

#[tauri::command]
fn powershell_probe() -> PowerShellInfo {
    if let Some(path) = find_executable("pwsh.exe") {
        return PowerShellInfo {
            executable: Some(path),
            edition: "PowerShell 7".into(),
        };
    }
    if let Some(path) = find_executable("powershell.exe") {
        return PowerShellInfo {
            executable: Some(path),
            edition: "Windows PowerShell 5.1".into(),
        };
    }
    PowerShellInfo {
        executable: None,
        edition: "Unavailable".into(),
    }
}

#[cfg(target_os = "windows")]
#[tauri::command]
fn launch_powershell() -> Result<(), String> {
    use std::os::windows::process::CommandExt;

    const CREATE_NEW_CONSOLE: u32 = 0x00000010;
    const CREATE_NEW_PROCESS_GROUP: u32 = 0x00000200;

    let executable = find_executable("pwsh.exe")
        .or_else(|| find_executable("powershell.exe"))
        .ok_or_else(|| "PowerShell was not found on this Windows system".to_string())?;

    Command::new(executable)
        .creation_flags(CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP)
        .spawn()
        .map(|_| ())
        .map_err(|error| format!("Failed to launch PowerShell: {error}"))
}

#[cfg(not(target_os = "windows"))]
#[tauri::command]
fn launch_powershell() -> Result<(), String> {
    Err("AnchorShell G1 targets Windows".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![powershell_probe, launch_powershell])
        .run(tauri::generate_context!())
        .expect("error while running AnchorShell");
}
