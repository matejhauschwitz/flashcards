import { FiAlertTriangle, FiArrowRight } from "react-icons/fi";

// Vrátí hezký název balíčku ze jména souboru (bez .csv a s velkým počátečním písmenem)
function formatDeckName(fileName) {
  const nameWithoutExt = fileName.replace(/\.csv$/i, "");
  const normalized = nameWithoutExt.replace(/[-_]+/g, " ");
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Komponenta DeckList
 * – zobrazuje dostupné balíčky načtené z index.json.
 * – po kliknutí na balíček volá callback `onSelectDeck`.
 */
function DeckList({ decks, isLoading, error, onSelectDeck }) {
  return (
    <div className="deck-list">
      <h2>Dostupné balíčky</h2>

      {isLoading && <p>Načítám balíčky…</p>}
      {!isLoading && error && (
        <p className="deck-error">
          <FiAlertTriangle aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {!isLoading && !error && decks.length === 0 && (
        <p>Zatím nejsou dostupné žádné balíčky.</p>
      )}

      {!isLoading && !error && decks.length > 0 && (
        <div className="deck-grid">
          {decks.map((deckFile) => (
            <button
              type="button"
              key={deckFile}
              className="deck-card"
              onClick={() => onSelectDeck(deckFile)}
            >
              <h3>{formatDeckName(deckFile)}</h3>
              <p>Soubor: {deckFile}</p>
              <span className="deck-cta">
                <span>Spustit</span>
                <FiArrowRight aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckList;
