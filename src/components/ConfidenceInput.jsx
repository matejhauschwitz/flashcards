/*
 * Komponenta ConfidenceInput (custom formulářový input)
 *
 * NEPOUŽÍVÁ klasický <input> – místo toho zobrazuje 4 tlačítka,
 * z nichž každé reprezentuje jinou úroveň sebejistoty.
 *
 * Po kliknutí zavolá callback `onRate(hodnota)` předaný z rodiče
 * (FlashcardViewer), čímž se data posílají směrem nahoru.
 */

// Definice možností hodnocení
const OPTIONS = [
  { value: 1, label: "Znovu",  emoji: "🔴" },
  { value: 2, label: "Těžké",  emoji: "🟠" },
  { value: 3, label: "Dobré",  emoji: "🟢" },
  { value: 4, label: "Snadné", emoji: "🟣" },
];

function ConfidenceInput({ onRate }) {
  return (
    <div className="confidence-input">
      <p className="confidence-label">Jak jsi si vedl?</p>
      <div className="confidence-buttons">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`confidence-btn confidence-${opt.value}`}
            onClick={() => onRate(opt.value)}
          >
            <span className="confidence-emoji">{opt.emoji}</span>
            <span>{opt.label}</span>
            <span className="confidence-pts">{opt.value} b.</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ConfidenceInput;