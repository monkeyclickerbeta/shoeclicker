import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PASSWORD = "adminozzyonly1122";

export default function AdminPanel() {
  const [inputPassword, setInputPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [clicks, setClicks] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      // Load current Clicks from localStorage
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem("shoeclicker-state");
        if (saved) {
          try {
            const { clicks } = JSON.parse(saved);
            setClicks(clicks ?? 0);
          } catch {
            setClicks(0);
          }
        } else {
          setClicks(0);
        }
      }
    }
  }, [authenticated]);

  function handleLogin(e) {
    e.preventDefault();
    if (inputPassword === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  }

  function handleSave(e) {
    e.preventDefault();
    if (isNaN(Number(clicks)) || Number(clicks) < 0) {
      setError("Clicks must be a non-negative number.");
      return;
    }
    if (typeof window !== "undefined") {
      let saved = window.localStorage.getItem("shoeclicker-state");
      let data = { clicks: Number(clicks) };
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          data = {
            ...parsed,
            clicks: Number(clicks),
          };
        } catch {}
      }
      window.localStorage.setItem("shoeclicker-state", JSON.stringify(data));
      setError("Clicks updated! Refresh the main page.");
    }
  }

  if (!authenticated) {
    return (
      <main className="container">
        <h1>Admin Panel</h1>
        <form onSubmit={handleLogin} style={{ marginTop: 32 }}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={inputPassword}
            onChange={e => setInputPassword(e.target.value)}
            style={{
              padding: "10px 20px",
              fontSize: "1.1rem",
              borderRadius: 9,
              border: "1px solid #2563eb",
              minWidth: 260,
              marginBottom: 16,
              outline: "none"
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "10px 36px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
        {error && <div style={{ color: "#ef4444", marginTop: 20 }}>{error}</div>}
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSave} style={{ marginTop: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <label>
            <b>Clicks:</b>
            <input
              type="number"
              min="0"
              value={clicks}
              onChange={e => setClicks(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "8px 18px",
                fontSize: "1.1rem",
                borderRadius: 9,
                border: "1px solid #2563eb",
                outline: "none",
                width: 120
              }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "10px 36px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Save
        </button>
        {error && <div style={{ color: error === "Clicks updated! Refresh the main page." ? "#16a34a" : "#ef4444", marginTop: 20 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 42 }}>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 30px",
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: 10,
            cursor: "pointer"
          }}
        >
          Go Back to Game
        </button>
      </div>
    </main>
  );
}
