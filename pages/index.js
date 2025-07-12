import { useState } from "react";

const data = {
  "Blood Knight": {
    "Whirling Strike": ["Off Hand", "Helm", "Chest"],
    "Skewer": ["Off Hand", "Helm", "Shoulder", "Pants"],
    "Transfusion": ["Off Hand", "Chest", "Pants"],
    "Abomination": ["Main Hand", "Shoulder", "Pants"]
  }
};

const slots = [
  "Main Hand 1",
  "Main Hand 2",
  "Off Hand 1",
  "Off Hand 2",
  "Helm",
  "Shoulder",
  "Chest",
  "Pants"
];

export default function Home() {
  const [selectedClass, setSelectedClass] = useState("Blood Knight");
  const [priorities, setPriorities] = useState([]);
  const affixOptions = Object.keys(data[selectedClass]);

  const handlePriorityChange = (affix) => {
    setPriorities((prev) =>
      prev.includes(affix)
        ? prev.filter((a) => a !== affix)
        : [...prev, affix]
    );
  };

  const computeAssignments = () => {
    const affixMap = {};
    const usedSlots = {};
    slots.forEach(slot => usedSlots[slot] = []);

    priorities.forEach((affix) => {
      let assigned = 0;
      data[selectedClass][affix].forEach((slot) => {
        if (assigned >= 4) return;
        slots.filter(s => s.startsWith(slot)).forEach((realSlot) => {
          if (assigned >= 4) return;
          if (usedSlots[realSlot].length < 2) {
            usedSlots[realSlot].push(affix);
            affixMap[affix] = affixMap[affix] || [];
            affixMap[affix].push(realSlot);
            assigned++;
          }
        });
      });
    });

    return usedSlots;
  };

  const assignments = computeAssignments();

  return (
    <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1rem" }}>🔥 Diablo Eternal Affix Planner</h1>

      <label>Choose Class:</label>
      <select
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setPriorities([]);
        }}
        style={{ marginBottom: "1rem", display: "block", padding: "0.5rem" }}
      >
        {Object.keys(data).map((cls) => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      <label>Select Affix Priorities (Top = Higher Priority):</label>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {affixOptions.map((affix) => (
          <button
            key={affix}
            onClick={() => handlePriorityChange(affix)}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid #333",
              backgroundColor: priorities.includes(affix) ? "#000" : "#eee",
              color: priorities.includes(affix) ? "#fff" : "#000",
              cursor: "pointer"
            }}
          >
            {affix}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Result:</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {slots.map((slot) => (
          <div key={slot} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
            <strong>{slot}</strong>
            <ul>
              {assignments[slot].length > 0 ? (
                assignments[slot].map((affix) => <li key={affix}>{affix}</li>)
              ) : (
                <li>—</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
