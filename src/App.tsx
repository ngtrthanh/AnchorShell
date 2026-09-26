import { useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";
const VERSION = "0.1.0-alpha.1";

const nav = ["Files", "Terminal", "Transfers", "Tunnels", "Ops", "Automation"];

export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("anchorshell-theme") as Theme) || "system"
  );

  useEffect(() => {
    localStorage.setItem("anchorshell-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand">
          <div className="mark">A</div>
          <div>
            <strong>AnchorShell</strong>
            <small>Windows remote ops</small>
          </div>
        </div>

        <nav>
          {nav.map((item, index) => (
            <button className={index === 0 ? "active" : ""} key={item}>
              {item}
            </button>
          ))}
        </nav>

        <div className="rail-footer">
          <label>
            Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value="system">System</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <small>v{VERSION}</small>
        </div>
      </aside>

      <section className="workspace">
        <header>
          <div>
            <small>WORKSPACE</small>
            <h1>Files</h1>
          </div>
          <button className="connect">+ Add host</button>
        </header>

        <section className="empty-state">
          <div className="anchor">⌁</div>
          <h2>Windows-first remote operations</h2>
          <p>
            G1 shell is alive. Host connections, SSH terminal and the Smart File Engine
            arrive through gated releases.
          </p>
          <div className="principles">
            <span>Files first</span>
            <span>Rust execution</span>
            <span>PowerShell automation</span>
            <span>GitHub releases</span>
          </div>
        </section>
      </section>
    </main>
  );
}
