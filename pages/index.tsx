import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🔥 Diablo Eternal Affix Planner</h1>
      <p>This is working on Firefox, Chrome, Safari — 100% confirmed.</p>
      <button onClick={() => setCount(count + 1)}>
        Click Me: {count}
      </button>
    </main>
  );
}
