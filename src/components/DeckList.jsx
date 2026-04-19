import { useRef } from "react";
import { FiAlertTriangle, FiArrowRight, FiUpload, FiTrash2 } from "react-icons/fi";

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
 * – umožňuje nahrát vlastní CSV soubor.
 * – po kliknutí na balíček volá callback `onSelectDeck`.
 */
function DeckList({ decks, customDecks = {}, isLoading, error, onSelectDeck, onCsvUpload, onDeleteCustomDeck }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCsvUpload(file);
      // Reset input, aby šlo nahrát stejný soubor znovu
      e.target.value = "";
    }
  };

  const customDeckNames = Object.keys(customDecks);

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

      {!isLoading && !error && decks.length === 0 && customDeckNames.length === 0 && (
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

      {/* Vlastní balíčky nahrané uživatelem */}
      {customDeckNames.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem" }}>Vlastní balíčky</h2>
          <div className="deck-grid">
            {customDeckNames.map((deckName) => (
              <div key={deckName} className="deck-card" style={{ position: "relative" }}>
                <button
                  type="button"
                  style={{ all: "unset", cursor: "pointer", width: "100%", display: "block" }}
                  onClick={() => onSelectDeck(deckName)}
                >
                  <h3>{formatDeckName(deckName)}</h3>
                  <p>{customDecks[deckName].length} karet</p>
                  <span className="deck-cta">
                    <span>Spustit</span>
                    <FiArrowRight aria-hidden="true" />
                  </span>
                </button>
                <button
                  type="button"
                  className="btn-small btn-delete-deck"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomDeck(deckName);
                  }}
                  aria-label={`Smazat balíček ${deckName}`}
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    color: "#ef4444",
                    borderColor: "#ef4444",
                    padding: "0.35rem 0.5rem",
                    lineHeight: 1,
                  }}
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tlačítko pro nahrání CSV */}
      <div style={{ marginTop: "2rem" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => fileInputRef.current?.click()}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FiUpload aria-hidden="true" />
          Nahrát CSV balíček
        </button>
        <p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Formát: první řádek hlavička, pak otázka;odpověď na každém řádku
        </p>
      </div>
    </div>
  );
}

export default DeckList;