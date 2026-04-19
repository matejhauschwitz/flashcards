import { FiCheckCircle, FiMinusCircle, FiXCircle } from "react-icons/fi";

/*
 * Komponenta ConfidenceInput
 *
 * Zobrazuje 3 tlačítka hodnocení: Neumím / Téměř / Umím.
 * Po kliknutí zavolá callback `onRate(hodnota)`. 
 */

const OPTIONS = [
  { value: 1, label: "Neumím", icon: FiXCircle },
  { value: 2, label: "Téměř", icon: FiMinusCircle },
  { value: 3, label: "Umím", icon: FiCheckCircle },
];

function ConfidenceInput({ onRate }) {
  return (
    <div className="confidence-input">
      <p className="confidence-label">Jak jsi to věděl/a?</p>
      <div className="confidence-buttons">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              className={`confidence-btn confidence-${opt.value}`}
              onClick={() => onRate(opt.value)}
            >
              <span className="confidence-icon">
                <Icon aria-hidden="true" />
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConfidenceInput;
