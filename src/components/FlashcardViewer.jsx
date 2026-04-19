import { useState } from "react";
import ConfidenceInput from "./ConfidenceInput";

/**
 * Komponenta FlashcardViewer
 * – prochází kartičky jednu po druhé.
 * – zobrazí otázku, po kliknutí na "Otočit" zobrazí odpověď + ConfidenceInput.
 * – po ohodnocení přes ConfidenceInput aktualizuje kartu a přejde na další.
 */
function FlashcardViewer({ cards, onUpdateCard, onBack }) {
  // Index aktuální karty v poli
  const [index, setIndex] = useState(0);
  // Je karta otočená na odpověď?
  const [flipped, setFlipped] = useState(false);
  // Příznak, že jsme prošli celý balíček
  const finished = index >= cards.length;

  // Callback volaný z ConfidenceInput po kliknutí na hodnocení
  const handleRate = (value) => {
    const current = cards[index];

    // Aktualizujeme skóre a datum posledního procvičení
    const updated = {
      ...current,
      score: value,
      lastReviewed: new Date().toISOString(),
    };

    // Pošleme aktualizovanou kartu nahoru do App
    onUpdateCard(updated);

    // Přepneme na další kartu a resetujeme otočení
    setFlipped(false);
    setIndex((prev) => prev + 1);
  };

  // --- Všechny karty projity ---
  if (finished) {
    return (
      <div className="viewer">
        <h2>🎉 Hotovo!</h2>
        <p>Prošel jsi všech {cards.length} karet.</p>
        <button className="btn-primary" onClick={() => { setIndex(0); setFlipped(false); }}>
          Znovu od začátku
        </button>
        <button className="btn-secondary" onClick={onBack}>
          ← Zpět na balíčky
        </button>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="viewer">
      {/* Průběh */}
      <p className="progress">
        Karta {index + 1} / {cards.length}
      </p>

      {/* Samotná kartička */}
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>  
        {!flipped ? (
          <div className="card-face card-front">
            <span className="card-label">Otázka</span>
            <h2>{card.question}</h2>
          </div>
        ) : (
          <div className="card-face card-back">
            <span className="card-label">Odpověď</span>
            <h2>{card.answer}</h2>
          </div>
        )}
      </div>

      {/* Tlačítko Otočit / hodnocení */}
      {!flipped ? (
        <button className="btn-primary" onClick={() => setFlipped(true)}>
          Otočit 🔄
        </button>
      ) : (
        <ConfidenceInput onRate={handleRate} />
      )}

      <button className="btn-secondary" onClick={onBack}>
        ← Zpět na balíčky
      </button>
    </div>
  );
}

export default FlashcardViewer;