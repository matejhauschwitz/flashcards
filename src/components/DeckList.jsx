/**
 * Komponenta DeckList
 * – zobrazuje dostupné balíčky (v našem případě jeden).
 * – po kliknutí volá callback `onSelectDeck` z rodiče.
 * – přes props `cards` počítá statistiky.
 */
function DeckList({ cards, onSelectDeck }) {
  // Spočítáme průměrné skóre všech karet
  const avg =
    cards.length > 0
      ? (cards.reduce((sum, c) => sum + c.score, 0) / cards.length).toFixed(1)
      : 0;

  // Kolik karet bylo alespoň jednou procvičeno
  const reviewed = cards.filter((c) => c.lastReviewed).length;

  return (
    <div className="deck-list">
      <h2>Tvoje balíčky</h2>

      <div className="deck-card" onClick={onSelectDeck}>
        <h3>🇬🇧 Slovíčka AJ</h3>
        <p>{cards.length} karet · {reviewed} procvičeno</p>
        <p>Průměrné skóre: <strong>{avg}</strong> / 4</p>
        <span className="deck-cta">Spustit →</span>
      </div>
    </div>
  );
}

export default DeckList;