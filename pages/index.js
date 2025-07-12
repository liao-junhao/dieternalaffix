// REPLACED with updated logic
// Clear All, slot balancing, 4/4 enforcement, 2 affix max per slot

import { useState } from "react";

const data = {
  "Blood Knight": {
    "Sanguinate": ["Main Hand", "Chest", "Pants"],
    "Abomination": ["Main Hand", "Shoulder", "Pants"],
    "Siphon Blood": ["Main Hand", "Helm", "Shoulder"],
    "Umbral Lance": ["Main Hand", "Helm", "Chest"],
    "Skewer": ["Off Hand", "Helm", "Shoulder"],
    "Transfusion": ["Off Hand", "Chest", "Pants"],
    "Whirling Strike": ["Off Hand", "Helm", "Chest"],
    "Shroud of Night": ["Off Hand", "Shoulder", "Pants"],
    "Swarm of Bats": ["Off Hand", "Chest", "Pants"],
    "Spear Flurry": ["Chest", "Pants", "Main Hand"],
    "Wave of Blood": ["Helm", "Chest", "Main Hand"],
    "Tendrils of Blood": ["Shoulder", "Pants", "Off Hand"],
    "Mephitic Cloud": ["Helm", "Shoulder", "Off Hand"]
  }
};

const slots = [
  "Main Hand 1", "Main Hand 2",
  "Off Hand 1", "Off Hand 2",
  "Helm", "Shoulder", "Chest", "Pants"
];

export default function Home() {
  const [selectedClass, setSelectedClass] = useState("Blood Knight");
  const [priorities, setPriorities] = useState([]);
  const affixOptions = Object.keys(data[selectedClass]);

  const handlePriorityChange = (affix) => {
    if (priorities.includes(affix)) {
      setPriorities(prev => prev.filter(a => a !== affix));
    } else {
      if (priorities.length >= 4) return;
      setPriorities(prev => [...prev, affix]);
    }
  };

  const clearAll = () => setPriorities([]);

  const computeAssignments = () => {
    const usedSlots = {};
    const affixMap = {};
    const affixCount = {};

    slots.forEach(slot => usedSlots[slot] = []);

    for (let i = 0; i < priorities.length; i++) {
      const affix = priorities[i];
      let assigned = 0;
      const validSlots = data[selectedClass][affix];

      for (let base of validSlots) {
        const variants = slots.filter(s => s.startsWith(base));
        for (let slot of variants) {
          if (usedSlots[slot].length < 2) {
            usedSlots[slot].push(affix);
            affixMap[affix] = affixMap[affix] || [];
            affixMap[affix].push(slot);
            assigned++;
            if (assigned === 4) break;
          }
        }
        if (assigned === 4) break;
      }
      affixCount[affix] = assigned;
    }

    return { usedSlots, affixCount };
  };

  const { usedSlots, affixCount } = computeAssignments();

  return (
    <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Eternal Affix Planner
      </h1>

      <label>Choose Class:</label>
      <select
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setPriorities([]);
        }}
        style={{ marginBottom: "1rem", display: "block", padding: "0.5rem" }}
      >
        {Object.keys(data).map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Selected Affixes:</strong> {priorities.length}/4
        <button onClick={clearAll} style={{ marginLeft: "1rem", padding: "0.25rem 0.5rem" }}>
          Clear All
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {affixOptions.map((affix) => {
          const idx = priorities.indexOf(affix);
          return (
            <button
              key={affix}
              onClick={() => handlePriorityChange(affix)}
              disabled={priorities.length >= 4 && idx === -1}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid #333",
                backgroundColor: idx >= 0 ? "#000" : "#eee",
                color: idx >= 0 ? "#fff" : "#000",
                cursor: priorities.length >= 4 && idx === -1 ? "not-allowed" : "pointer"
              }}
              title={priorities.length >= 4 && idx === -1 ? "Only 4 affixes allowed" : ""}
            >
              {idx >= 0 ? `#${idx + 1} ` : ""}{affix} {affixCount[affix] ? `(${affixCount[affix]}/4)` : ""}
            </button>
          );
        })}
      </div>

      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Result:</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {slots.map(slot => (
          <div key={slot} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
            <strong>{slot}</strong>
            <ul>
              {usedSlots[slot].length > 0
                ? usedSlots[slot].map((affix, idx) => <li key={idx}>{affix}</li>)
                : <li>—</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
