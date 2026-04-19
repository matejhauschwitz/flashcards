import { useState } from "react";
import ConfidenceInput from "./ConfidenceInput";

// Spočítá jednoduché statistiky z aktuálního sezení
function computeSessionStats(ratings, totalCards) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  ratings.forEach((rating) => {
    if (counts[rating] !== undefined) counts[rating] += 1;
  });

  const average = ratings.length
    ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(2)
    : "0.00";

  const successCount = counts[3] + counts[4];
  const successPercent = totalCards > 0 ? Math.round((successCount / totalCards) * 100) : 0;

  return { counts, average, successPercent, successCount };
}

/**
 * Komponenta FlashcardViewer
 * – prochází kartičky jednu po druhé.
 * – po dokončení zobrazí statistiky pouze z aktuálního průchodu.
 */
function FlashcardViewer({ cards, deckFileName, onBack }) {
  // Index aktuální karty v poli
  const [index, setIndex] = useState(0);
  // Je karta otočená na odpověď?
  const [flipped, setFlipped] = useState(false);
  // Hodnocení z aktuálního sezení
  const [sessionRatings, setSessionRatings] = useState([]);
  // Příznak, že jsme prošli celý balíček
  const finished = index >= cards.length;

  // Callback volaný z ConfidenceInput po kliknutí na hodnocení
  const handleRate = (value) => {
    setSessionRatings((prev) => [...prev, value]);
    setFlipped(false);
    setIndex((prev) => prev + 1);
  };

  // Když balíček neobsahuje žádné karty
  if (cards.length === 0) {
    return (
      <div className="viewer">
        <h2>📭 Prázdný balíček</h2>
        <p>Ve vybraném balíčku nejsou žádné kartičky.</p>
        <button className="btn-secondary" onClick={onBack}>
          ← Zpět na balíčky
        </button>
      </div>
    );
  }

  // Všechny karty projity – zobrazíme souhrn
  if (finished) {
    const stats = computeSessionStats(sessionRatings, cards.length);

    return (
      <div className="viewer">
        <h2>🎉 Hotovo!</h2>
        <p>
          Balíček <strong>{deckFileName}</strong> je hotový.
        </p>

        <div className="session-stats">
          <h3>Statistiky aktuálního sezení</h3>
          <p>Celkový počet karet: <strong>{cards.length}</strong></p>
          <p>Průměrné skóre: <strong>{stats.average}</strong> / 4</p>

          <div className="stats-grid">
            <span>Znovu (1): <strong>{stats.counts[1]}</strong></span>
            <span>Těžké (2): <strong>{stats.counts[2]}</strong></span>
            <span>Dobré (3): <strong>{stats.counts[3]}</strong></span>
            <span>Snadné (4): <strong>{stats.counts[4]}</strong></span>
          </div>

          <div className="progress-wrap">
            <p>
              Úspěšnost (3+4): <strong>{stats.successCount}</strong> / {cards.length} ({stats.successPercent}%)
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.successPercent}%` }} />
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            setSessionRatings([]);
          }}
        >
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
