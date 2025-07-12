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
  const [priorities, setPriorities] = useState<string[]>([]);
  const affixOptions = Object.keys(data[selectedClass]);

  const handlePriorityChange = (affix: string) => {
    setPriorities((prev) =>
      prev.includes(affix) ? prev.filter((a) => a !== affix) : [...prev, affix]
    );
  };

  const computeAssignments = () => {
    const affixMap: Record<string, string[]> = {};
    const usedSlots: Record<string, string[]> = {};
    for (const slot of slots) usedSlots[slot] = [];

    for (const affix of priorities) {
      let assigned = 0;
      for (const slot of data[selectedClass][affix]) {
        for (const realSlot of slots.filter((s) => s.startsWith(slot))) {
          if (assigned >= 4) break;
          if (usedSlots[realSlot].length < 2) {
            usedSlots[realSlot].push(affix);
            affixMap[affix] = affixMap[affix] || [];
            affixMap[affix].push(realSlot);
            assigned++;
            break;
          }
        }
      }
    }
    return usedSlots;
  };

  const assignments = computeAssignments();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Diablo Eternal Affix Planner</h1>
      <label className="block mb-2">Choose Class:</label>
      <select
        className="mb-4 p-2 border"
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setPriorities([]);
        }}
      >
        {Object.keys(data).map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>
      <label className="block mb-2">Select Affix Priorities (Top = Higher Priority):</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {affixOptions.map((affix) => (
          <button
            key={affix}
            className={\`px-3 py-1 border rounded-full \${priorities.includes(affix) ? "bg-black text-white" : "bg-gray-200"}\`}
            onClick={() => handlePriorityChange(affix)}
          >
            {affix}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2">Result:</h2>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <div key={slot} className="p-2 border rounded">
            <strong>{slot}</strong>
            <ul className="list-disc list-inside">
              {assignments[slot]?.map((affix) => (
                <li key={affix}>{affix}</li>
              )) || <li>—</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}