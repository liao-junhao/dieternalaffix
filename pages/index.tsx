import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: 24 }}>
      <h1>Diablo Eternal Affix Planner ✅</h1>
      <p>This is the working root page using Pages Router.</p>
      <button onClick={() => setCount(count + 1)}>Click Count: {count}</button>
    </div>
  );
}
