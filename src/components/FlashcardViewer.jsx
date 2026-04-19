import { useState } from "react";
import ConfidenceInput from "./ConfidenceInput";

// Mapování hodnot na barvy a popisky
const RATING_META = {
  1: { label: "Neumím", cssClass: "rating-wrong" },
  2: { label: "Téměř",  cssClass: "rating-almost" },
  3: { label: "Umím",   cssClass: "rating-correct" },
};

// Spočítá statistiky z aktuálního sezení
function computeSessionStats(ratings, totalCards) {
  const counts = { 1: 0, 2: 0, 3: 0 };
  ratings.forEach((r) => {
    if (counts[r] !== undefined) counts[r] += 1;
  });

  const average = ratings.length
    ? (ratings.reduce((sum, v) => sum + v, 0) / ratings.length).toFixed(2)
    : "0.00";

  const successCount = counts[3];
  const successPercent = totalCards > 0 ? Math.round((successCount / totalCards) * 100) : 0;

  return { counts, average, successPercent, successCount };
}

/**
 * Komponenta FlashcardViewer
 * – zobrazuje otázku i odpověď najednou.
 * – uživatel hodnotí 3 tlačítky: Neumím / Téměř / Umím.
 * – po dokončení zobrazí statistiky + přehled všech otázek.
 */
function FlashcardViewer({ cards, deckFileName, onBack }) {
  const [index, setIndex] = useState(0);
  // Hodnocení z aktuálního sezení – pole objektů { cardIndex, value }
  const [sessionRatings, setSessionRatings] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const finished = index >= cards.length;

  const handleRate = (value) => {
    setSessionRatings((prev) => [...prev, { cardIndex: index, value }]);
    setShowAnswer(false);
    setIndex((prev) => prev + 1);
  };

  // Prázdný balíček
  if (cards.length === 0) {
    return (
      <div className="viewer">
        <h2>Prázdný balíček</h2>
        <p>Ve vybraném balíčku nejsou žádné kartičky.</p>
        <button className="btn-secondary" onClick={onBack}>
          Zpět na balíčky
        </button>
      </div>
    );
  }

  // Hotovo – statistiky + přehled otázek
  if (finished) {
    const ratingValues = sessionRatings.map((r) => r.value);
    const stats = computeSessionStats(ratingValues, cards.length);

    return (
      <div className="viewer">
        <h2>Hotovo!</h2>
        <p>
          Balíček <strong>{deckFileName?.replace(/\.csv$/i, "")}</strong> je dokončený.
        </p>

        <div className="session-stats">
          <h3>Statistiky</h3>
          <div className="stats-grid">
            <span>Umím: <strong>{stats.counts[3]}</strong></span>
            <span>Téměř: <strong>{stats.counts[2]}</strong></span>
            <span>Neumím: <strong>{stats.counts[1]}</strong></span>
            <span>Celkem: <strong>{cards.length}</strong></span>
          </div>

          <div className="progress-wrap">
            <p>
              Úspěšnost: <strong>{stats.successCount}</strong> / {cards.length} ({stats.successPercent} %)
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.successPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Přehled všech otázek */}
        <div className="review-list">
          <h3>Přehled otázek</h3>
          {sessionRatings.map((r, i) => {
            const card = cards[r.cardIndex];
            const meta = RATING_META[r.value];
            return (
              <div key={i} className={`review-item ${meta.cssClass}`}> 
                <div className="review-content">
                  <p className="review-question">{card.question}</p>
                  <p className="review-answer">{card.answer}</p>
                </div>
                <span className="review-badge">{meta.label}</span>
              </div>
            );
          })}
        </div>

        <button
          className="btn-restart"
          onClick={() => {
            setIndex(0);
            setShowAnswer(false);
            setSessionRatings([]);
          }}
        >
          Znovu od začátku
        </button>
        <button className="btn-secondary" onClick={onBack}>
          Zpět na balíčky
        </button>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="viewer">
      {/* Průběh */}
      <p className="progress">
        {index + 1} / {cards.length}
      </p>

      {/* Kartička – otázka vždy viditelná */}
      <div className={`flashcard ${showAnswer ? "flipped" : ""}`}> 
        <div className="card-face card-front">
          <span className="card-label">Otázka</span>
          <h2>{card.question}</h2>
        </div>
      </div>

      {/* Odpověď + hodnocení */}
      {!showAnswer ? (
        <button className="btn-reveal" onClick={() => setShowAnswer(true)}>
          Zobrazit odpověď
        </button>
      ) : (
        <>
          <div className="answer-reveal">
            <span className="card-label">Odpověď</span>
            <p className="answer-text">{card.answer}</p>
          </div>
          <ConfidenceInput onRate={handleRate} />
        </>
      )}

      <button className="btn-secondary" onClick={onBack}> 
        Zpět na balíčky
      </button>
    </div>
  );
}

export default FlashcardViewer;