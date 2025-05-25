import { useState, useEffect } from "react";

// A cool transparent shoe PNG from PNGWing
const SHOE_IMAGE = "https://www.pngall.com/wp-content/uploads/5/Sneaker-PNG-Image.png";

const UPGRADES = [
  { name: "Bigger Shoe", cost: 50, cps: 1, desc: "+1 click/sec" },
  { name: "Shoe Factory", cost: 200, cps: 5, desc: "+5 clicks/sec" },
  { name: "Golden Laces", cost: 1000, cps: 25, desc: "+25 clicks/sec" }
];

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [owned, setOwned] = useState(Array(UPGRADES.length).fill(0));

  // Load saved state
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

  // Save state
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "shoeclicker-state",
        JSON.stringify({ clicks, cps, owned })
      );
    }
  }, [clicks, cps, owned]);

  // Auto clicker
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

  function resetGame() {
    setClicks(0);
    setCps(0);
    setOwned(Array(UPGRADES.length).fill(0));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("shoeclicker-state");
    }
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
          <img
            src={SHOE_IMAGE}
            alt="Shoe"
            width={220}
            height={220}
            draggable={false}
            style={{
              userSelect: "none",
              WebkitUserDrag: "none",
              filter: "drop-shadow(0 8px 16px #60a5fa50)"
            }}
          />
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
      <button className="reset-btn" onClick={resetGame}>Reset Game</button>
      <footer>
        <p>
          Cool shoe game! <span style={{color:"#2563eb"}}>Made with Next.js + Vercel</span>
        </p>
      </footer>
    </main>
  );
}
