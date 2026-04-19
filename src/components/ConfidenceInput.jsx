/*
 * Komponenta ConfidenceInput
 *
 * Zobrazuje 3 tlačítka hodnocení: Neumím / Téměř / Umím.
 * Po kliknutí zavolá callback `onRate(hodnota)`. 
 */

const OPTIONS = [
  { value: 1, label: "Neumím",  emoji: "❌" },
  { value: 2, label: "Téměř",   emoji: "🟡" },
  { value: 3, label: "Umím",    emoji: "✅" },
];

function ConfidenceInput({ onRate }) {
  return (
    <div className="confidence-input">
      <p className="confidence-label">Jak jsi to věděl/a?</p>
      <div className="confidence-buttons">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`confidence-btn confidence-${opt.value}`}
            onClick={() => onRate(opt.value)}
          >
            <span className="confidence-emoji">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ConfidenceInput;