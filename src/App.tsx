import { FormEvent, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type Theme = "system" | "dark" | "light";
type View = "hosts" | "workspace" | "settings";

type Host = {
  id: string;
  name: string;
  hostname: string;
  username: string;
  port: number;
};

type PowerShellInfo = {
  executable: string | null;
  edition: string;
};

const VERSION = "0.1.0-alpha.2";

function readHosts(): Host[] {
  try {
    return JSON.parse(localStorage.getItem("anchorshell-hosts") || "[]") as Host[];
  } catch {
    return [];
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("anchorshell-theme") as Theme) || "system");
  const [view, setView] = useState<View>("hosts");
  const [hosts, setHosts] = useState<Host[]>(readHosts);
  const [selectedId, setSelectedId] = useState<string | null>(() => localStorage.getItem("anchorshell-selected-host"));
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState("Ready");
  const [ps, setPs] = useState<PowerShellInfo | null>(null);

  const selected = useMemo(() => hosts.find((h) => h.id === selectedId) || null, [hosts, selectedId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("anchorshell-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("anchorshell-hosts", JSON.stringify(hosts));
  }, [hosts]);

  useEffect(() => {
    if (selectedId) localStorage.setItem("anchorshell-selected-host", selectedId);
    else localStorage.removeItem("anchorshell-selected-host");
  }, [selectedId]);

  async function probePowerShell() {
    try {
      const info = await invoke<PowerShellInfo>("powershell_probe");
      setPs(info);
      setNotice(info.executable ? `${info.edition} found` : "PowerShell not found");
    } catch (error) {
      setNotice(String(error));
    }
  }

  async function launchPowerShell() {
    try {
      await invoke("launch_powershell");
      setNotice("PowerShell launched as an independent child process");
    } catch (error) {
      setNotice(String(error));
    }
  }

  function addHost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const host: Host = {
      id: crypto.randomUUID(),
      name: String(data.get("name") || "").trim(),
      hostname: String(data.get("hostname") || "").trim(),
      username: String(data.get("username") || "").trim(),
      port: Number(data.get("port") || 22),
    };
    if (!host.name || !host.hostname || !host.username || !Number.isFinite(host.port)) {
      setNotice("Complete all host fields");
      return;
    }
    setHosts((current) => [...current, host]);
    setSelectedId(host.id);
    setShowAdd(false);
    setView("workspace");
    setNotice(`Saved ${host.name}`);
  }

  function removeHost(id: string) {
    setHosts((current) => current.filter((host) => host.id !== id));
    if (selectedId === id) setSelectedId(null);
    setNotice("Host removed");
  }

  async function copySshCommand() {
    if (!selected) return;
    const command = `ssh -p ${selected.port} ${selected.username}@${selected.hostname}`;
    await navigator.clipboard.writeText(command);
    setNotice("SSH command copied");
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>AnchorShell</strong>
            <span>Windows remote workspace</span>
          </div>
        </div>

        <nav className="nav">
          <button className={view === "hosts" ? "active" : ""} onClick={() => setView("hosts")}>Hosts</button>
          <button className={view === "workspace" ? "active" : ""} onClick={() => setView("workspace")}>Workspace</button>
          <button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}>Settings</button>
        </nav>

        <div className="sidebar-foot">
          <span>{notice}</span>
          <code>v{VERSION}</code>
        </div>
      </aside>

      <section className="content">
        {view === "hosts" && (
          <>
            <header className="page-head">
              <div><span className="eyebrow">CONNECTIONS</span><h1>Hosts</h1></div>
              <button className="primary" onClick={() => setShowAdd(true)}>Add host</button>
            </header>
            <div className="host-grid">
              {hosts.length === 0 ? (
                <section className="empty">
                  <div className="empty-mark">A</div>
                  <h2>No saved hosts</h2>
                  <p>Add the first server. G1 stores host definitions locally; SSH connection arrives in G2.</p>
                  <button className="primary" onClick={() => setShowAdd(true)}>Add first host</button>
                </section>
              ) : hosts.map((host) => (
                <article className="host-card" key={host.id}>
                  <div>
                    <h3>{host.name}</h3>
                    <code>{host.username}@{host.hostname}:{host.port}</code>
                  </div>
                  <div className="actions">
                    <button onClick={() => { setSelectedId(host.id); setView("workspace"); setNotice(`Opened ${host.name}`); }}>Open</button>
                    <button className="danger" onClick={() => removeHost(host.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {view === "workspace" && (
          <>
            <header className="page-head">
              <div><span className="eyebrow">WORKSPACE</span><h1>{selected?.name || "No host selected"}</h1></div>
            </header>
            {!selected ? (
              <section className="empty">
                <h2>Select a host first</h2>
                <p>Open a saved host from the Hosts page.</p>
                <button onClick={() => setView("hosts")}>Go to hosts</button>
              </section>
            ) : (
              <div className="workspace-grid">
                <section className="panel">
                  <span className="eyebrow">HOST</span>
                  <h2>{selected.name}</h2>
                  <dl>
                    <div><dt>Address</dt><dd>{selected.hostname}</dd></div>
                    <div><dt>User</dt><dd>{selected.username}</dd></div>
                    <div><dt>Port</dt><dd>{selected.port}</dd></div>
                  </dl>
                  <div className="actions">
                    <button onClick={copySshCommand}>Copy SSH command</button>
                    <button onClick={() => setView("hosts")}>Change host</button>
                  </div>
                </section>
                <section className="panel">
                  <span className="eyebrow">LOCAL POWERSHELL</span>
                  <h2>Independent process test</h2>
                  <p>Launching PowerShell must never own or terminate AnchorShell.</p>
                  <div className="ps-status">
                    <code>{ps?.executable || "Not probed"}</code>
                    <span>{ps?.edition || ""}</span>
                  </div>
                  <div className="actions">
                    <button onClick={probePowerShell}>Detect PowerShell</button>
                    <button className="primary" onClick={launchPowerShell}>Launch PowerShell</button>
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {view === "settings" && (
          <>
            <header className="page-head"><div><span className="eyebrow">PREFERENCES</span><h1>Settings</h1></div></header>
            <section className="panel settings-panel">
              <label>
                <span>Appearance</span>
                <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                  <option value="system">System</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <div className="font-preview">
                <span>Interface</span><strong>Inter / Segoe UI</strong>
                <span>Terminal & technical text</span><code>JetBrains Mono / Cascadia Code</code>
              </div>
              <button onClick={() => { localStorage.clear(); setHosts([]); setSelectedId(null); setTheme("system"); setNotice("Local settings reset"); }}>Reset local data</button>
            </section>
          </>
        )}
      </section>

      {showAdd && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <form className="modal" onSubmit={addHost}>
            <div><span className="eyebrow">NEW CONNECTION</span><h2>Add host</h2></div>
            <label>Name<input name="name" placeholder="Production web" autoFocus /></label>
            <label>Host<input name="hostname" placeholder="192.168.1.10 or server.example.com" /></label>
            <div className="form-row">
              <label>User<input name="username" placeholder="admin" /></label>
              <label>Port<input name="port" type="number" min="1" max="65535" defaultValue="22" /></label>
            </div>
            <div className="actions end">
              <button type="button" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="primary" type="submit">Save host</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
