import { useState, useEffect } from "react";

const UPGRADES = [
  { name: "Bigger Shoe", cost: 50, cps: 1, desc: "+1 click per second" },
  { name: "Shoe Factory", cost: 200, cps: 5, desc: "+5 clicks per second" },
  { name: "Golden Laces", cost: 1000, cps: 25, desc: "+25 clicks per second" }
];

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [owned, setOwned] = useState(Array(UPGRADES.length).fill(0));

  // Load state
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
      <h1>Shoe Clicker 👟</h1>
      <div className="stats">
        <div>Clicks: {clicks}</div>
        <div>Clicks/sec: {cps}</div>
      </div>
      <button className="shoe-btn" onClick={handleClick}>
        <img 
          src="https://cdn.pixabay.com/photo/2016/03/27/19/40/sneakers-1280070_1280.png" 
          alt="Shoe" width={120} height={120} 
          style={{borderRadius: "15px"}}
        />
        <div>Click Me!</div>
      </button>
      <h2>Upgrades</h2>
      <div className="upgrades">
        {UPGRADES.map((u, idx) => (
          <div key={u.name} className="upgrade-card">
            <div>
              <b>{u.name}</b> ({u.desc})
            </div>
            <div>Cost: {u.cost}</div>
            <div>Owned: {owned[idx]}</div>
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
          Made with Next.js • Hosted on Vercel
        </p>
      </footer>
    </main>
  );
}
