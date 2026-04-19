import { useState, useEffect } from "react";
import Login from "./components/Login";
import DeckList from "./components/DeckList";
import FlashcardViewer from "./components/FlashcardViewer";
import "./App.css";

// Výchozí balíček karet – použije se, když je localStorage prázdný
const DEFAULT_CARDS = [
  { id: 1, question: "Hello",      answer: "Ahoj",       lastReviewed: null, score: 0 },
  { id: 2, question: "Goodbye",    answer: "Nashledanou", lastReviewed: null, score: 0 },
  { id: 3, question: "Thank you",  answer: "Děkuji",     lastReviewed: null, score: 0 },
  { id: 4, question: "Please",     answer: "Prosím",     lastReviewed: null, score: 0 },
  { id: 5, question: "Yes",        answer: "Ano",        lastReviewed: null, score: 0 },
  { id: 6, question: "No",         answer: "Ne",         lastReviewed: null, score: 0 },
  { id: 7, question: "Dog",        answer: "Pes",        lastReviewed: null, score: 0 },
  { id: 8, question: "Cat",        answer: "Kočka",      lastReviewed: null, score: 0 },
  { id: 9, question: "Water",      answer: "Voda",       lastReviewed: null, score: 0 },
  { id: 10, question: "Friend",    answer: "Přítel",     lastReviewed: null, score: 0 },
];

// Pomocná funkce – načti data z localStorage nebo vrať fallback
function loadFromStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function App() {
  // Stav přihlášeného uživatele (null = nepřihlášen)
  const [user, setUser] = useState(() => loadFromStorage("fc_user", null));

  // Pole karet uložené v localStorage
  const [cards, setCards] = useState(() => loadFromStorage("fc_cards", DEFAULT_CARDS));

  // Který "pohled" je aktivní: "list" nebo "viewer"
  const [view, setView] = useState("list");

  // Při změně uživatele / karet vždy synchronizuj localStorage
  useEffect(() => {
    if (user) localStorage.setItem("fc_user", JSON.stringify(user));
    else localStorage.removeItem("fc_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("fc_cards", JSON.stringify(cards));
  }, [cards]);

  // Callback pro přihlášení – voláno z komponenty Login
  const handleLogin = (name) => setUser(name);

  // Callback pro odhlášení
  const handleLogout = () => {
    setUser(null);
    setView("list");
  };

  // Callback pro aktualizaci jedné karty (po ohodnocení)
  const handleUpdateCard = (updatedCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
  };

  // --- Renderování ---

  // Nepřihlášený uživatel → zobrazíme Login
  if (!user) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Přihlášený uživatel → Dashboard
  return (
    <div className="app">
      {/* Horní lišta s pozdravem a odhlášením */}
      <header className="topbar">
        <span>👋 Ahoj, <strong>{user}</strong></span>
        <button className="btn-small" onClick={handleLogout}>Odhlásit</button>
      </header>

      {view === "list" ? (
        <DeckList
          cards={cards}
          onSelectDeck={() => setView("viewer")}
        />
      ) : (
        <FlashcardViewer
          cards={cards}
          onUpdateCard={handleUpdateCard}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
}

export default App;