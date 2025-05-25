import { useState, useEffect } from "react";

// Reliable transparent sneaker PNG from PNGimg
const SHOE_IMAGE = "https://pngimg.com/d/sneakers_PNG34.png";

const UPGRADES = [
  { name: "Bigger Shoe", cost: 50, cps: 1, desc: "+1 click/sec" },
  { name: "Shoe Factory", cost: 200, cps: 5, desc: "+5 clicks/sec" },
  { name: "Golden Laces", cost: 450, cps: 25, desc: "+25 clicks/sec" },
  { name: "Sneaker Robot", cost: 1200, cps: 60, desc: "+60 clicks/sec" },
  { name: "Ultra Boost Sole", cost: 5000, cps: 200, desc: "+200 clicks/sec" },
  { name: "Diamond Studs", cost: 20000, cps: 900, desc: "+900 clicks/sec" },
  { name: "Shoe Empire", cost: 90000, cps: 5000, desc: "+5,000 clicks/sec" },
  { name: "Galactic Sneakers", cost: 400000, cps: 18000, desc: "+18,000 clicks/sec" },
  { name: "Quantum Laces", cost: 2200000, cps: 90000, desc: "+90,000 clicks/sec" },
  { name: "Time Traveler's Kick", cost: 12000000, cps: 450000, desc: "+450,000 clicks/sec" },
  { name: "Mythical Shoemaker", cost: 70000000, cps: 1800000, desc: "+1,800,000 clicks/sec" },
  { name: "Infinite Walkers", cost: 400000000, cps: 8500000, desc: "+8,500,000 clicks/sec" },
  { name: "Godspeed Soles", cost: 2500000000, cps: 45000000, desc: "+45,000,000 clicks/sec" }
];

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [owned, setOwned] = useState(Array(UPGRADES.length).fill(0));
  const [imgError, setImgError] = useState(false);
  const [showRestartWarning, setShowRestartWarning] = useState(false);

  // Force refresh as soon as the site loads (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent infinite refresh loop by setting a sessionStorage flag
      if (!window.sessionStorage.getItem("shoeclicker-refreshed")) {
        window.sessionStorage.setItem("shoeclicker-refreshed", "1");
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("shoeclicker-state");
      if (saved) {
        const { clicks, cps, owned } = JSON.parse(saved);
        setClicks(clicks);
        setCps(cps);
        setOwned(owned);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "shoeclicker-state",
        JSON.stringify({ clicks, cps, owned })
      );
    }
  }, [clicks, cps, owned]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks((c) => c + cps);
    }, 1000);
    return () => clearInterval(interval);
  }, [cps]);

  function handleClick() {
    setClicks(clicks + 1);
  }

  function buyUpgrade(idx) {
    const upgrade = UPGRADES[idx];
    if (clicks >= upgrade.cost) {
      setClicks(clicks - upgrade.cost);
      setOwned((prev) => {
        const up = [...prev];
        up[idx]++;
        return up;
      });
      setCps((prev) => prev + upgrade.cps);
    }
  }

  function reallyRestartGame() {
    setClicks(0);
    setCps(0);
    setOwned(Array(UPGRADES.length).fill(0));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("shoeclicker-state");
      window.sessionStorage.removeItem("shoeclicker-refreshed");
    }
    setShowRestartWarning(false);
  }

  return (
    <main className="container">
      <h1>Shoe Clicker</h1>
      <div className="stats">
        <div>👟 Clicks: {clicks}</div>
        <div>⚡ CPS: {cps}</div>
      </div>
      <div className="clicker-box">
        <button className="shoe-btn" onClick={handleClick} aria-label="Click the shoe!">
          {!imgError ? (
            <img
              src={SHOE_IMAGE}
              alt="Shoe"
              width={220}
              height={220}
              loading="eager"
              draggable={false}
              style={{
                userSelect: "none",
                WebkitUserDrag: "none",
                filter: "drop-shadow(0 8px 16px #60a5fa50)"
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              width: 220,
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "6rem"
            }}>👟</div>
          )}
        </button>
      </div>
      <h2 style={{ color: "#2563eb", margin: "12px 0 16px 0", fontWeight: 700, letterSpacing: 1 }}>Upgrades</h2>
      <div className="upgrades">
        {UPGRADES.map((u, idx) => (
          <div key={u.name} className="upgrade-card">
            <div className="upgrade-info">
              <b>{u.name}</b> <span style={{ color: "#0ea5e9" }}>{u.desc}</span>
              <br />
              <span style={{ fontSize: "1rem" }}>Cost: <b>{u.cost}</b></span> &nbsp; | &nbsp; 
              <span>Owned: <b>{owned[idx]}</b></span>
            </div>
            <button
              disabled={clicks < u.cost}
              onClick={() => buyUpgrade(idx)}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      <button 
        className="reset-btn" 
        onClick={() => setShowRestartWarning(true)}
        style={{background: "#f59e42"}}
      >
        Restart Game
      </button>
      {showRestartWarning && (
        <div className="restart-popup">
          <div className="restart-popup-inner">
            <h3>Are you sure you want to restart?</h3>
            <p>
              <b>All your progress will be <span style={{color:"#ef4444"}}>permanently deleted</span>!</b><br/>
              This cannot be undone.
            </p>
            <div style={{marginTop: 18}}>
              <button 
                onClick={reallyRestartGame}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  padding: "8px 28px",
                  marginRight: "12px",
                  cursor: "pointer"
                }}
              >
                Yes, Restart
              </button>
              <button 
                onClick={() => setShowRestartWarning(false)}
                style={{
                  background: "#a3a3a3",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  padding: "8px 18px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <footer>
        <p>
          Cool shoe game! <span style={{color:"#2563eb"}}>Made with Next.js + Vercel</span>
        </p>
      </footer>
    </main>
  );
}
