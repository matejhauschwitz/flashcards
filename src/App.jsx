import { useState, useEffect } from "react";
import { FiMoon, FiSmile, FiSun } from "react-icons/fi";
import Login from "./components/Login";
import DeckList from "./components/DeckList";
import FlashcardViewer from "./components/FlashcardViewer";
import "./App.css";

// Pomocná funkce – načti data z localStorage nebo vrať fallback
function loadFromStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

// Převede CSV text na pole karet { id, question, answer }
function parseCsvDeck(csvText) {
  const rows = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length <= 1) return [];

  return rows.slice(1).map((row, index) => {
    const [question = "", ...answerParts] = row.split(";");
    return {
      id: index + 1,
      question: question.trim(),
      answer: answerParts.join(";").trim(),
    };
  });
}

function App() {
  // Stav přihlášeného uživatele (null = nepřihlášen)
  const [user, setUser] = useState(() => loadFromStorage("fc_user", null));
  // Dostupné balíčky načtené z /public/decks/index.json
  const [decks, setDecks] = useState([]);
  // Vlastní balíčky nahrané uživatelem (z localStorage)
  const [customDecks, setCustomDecks] = useState(() => loadFromStorage("fc_custom_decks", {}));
  // Aktuálně načtené karty vybraného balíčku
  const [cards, setCards] = useState([]);
  // Název vybraného balíčku (souboru)
  const [selectedDeck, setSelectedDeck] = useState(null);
  // Který "pohled" je aktivní: "list" nebo "viewer"
  const [view, setView] = useState("list");
  // Jednoduchý stav načítání a případná chyba
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [decksError, setDecksError] = useState("");
  // Tmavý/světlý režim uložený v localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem("fc_theme") || "light");

  // Při změně uživatele synchronizuj localStorage
  useEffect(() => {
    if (user) localStorage.setItem("fc_user", JSON.stringify(user));
    else localStorage.removeItem("fc_user");
  }, [user]);

  // Synchronizuj vlastní balíčky do localStorage
  useEffect(() => {
    localStorage.setItem("fc_custom_decks", JSON.stringify(customDecks));
  }, [customDecks]);

  // Po startu aplikace načti seznam dostupných balíčků
  useEffect(() => {
    let isCancelled = false;

    const loadDeckIndex = async () => {
      setIsLoadingDecks(true);
      setDecksError("");

      try {
        const response = await fetch("/decks/index.json");
        if (!response.ok) {
          throw new Error("Nepodařilo se načíst seznam balíčků (HTTP " + response.status + ").");
        }

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Neplatný formát index.json.");

        if (!isCancelled) setDecks(data);
      } catch (error) {
        if (!isCancelled) {
          setDecks([]);
          setDecksError(error.message);
        }
      } finally {
        if (!isCancelled) setIsLoadingDecks(false);
      }
    };

    loadDeckIndex();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Ulož preferenci motivu
  useEffect(() => {
    localStorage.setItem("fc_theme", theme);
  }, [theme]);

  // Callback pro přihlášení – voláno z komponenty Login
  const handleLogin = (name) => setUser(name);

  // Callback pro odhlášení
  const handleLogout = () => {
    setUser(null);
    setView("list");
    setSelectedDeck(null);
    setCards([]);
  };  

  // Načti vybraný balíček z CSV (serverový) nebo z vlastních balíčků
  const handleSelectDeck = async (deckFileName) => {
    try {
      setDecksError("");

      // Zkontroluj, jestli je to vlastní balíček
      if (customDecks[deckFileName]) {
        setCards(customDecks[deckFileName]);
        setSelectedDeck(deckFileName);
        setView("viewer");
        return;
      }

      const safeDeckName = String(deckFileName || "").trim();
      const hasAllowedFormat = /^[a-zA-Z0-9_-]+\.csv$/i.test(safeDeckName);
      const isKnownDeck = decks.includes(safeDeckName);

      if (!hasAllowedFormat || !isKnownDeck) {
        throw new Error("Neplatný název balíčku.");
      }

      const response = await fetch("/decks/" + safeDeckName);
      if (!response.ok) throw new Error("Nepodařilo se načíst vybraný balíček.");

      const csvText = await response.text();
      const parsedCards = parseCsvDeck(csvText);

      setCards(parsedCards);
      setSelectedDeck(safeDeckName);
      setView("viewer");
    } catch (error) {
      setDecksError(error.message);
    }
  };

  // Nahrání CSV souboru uživatelem
  const handleCsvUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      const parsedCards = parseCsvDeck(csvText);

      if (parsedCards.length === 0) {
        setDecksError("Soubor neobsahuje žádné platné karty. Zkontrolujte formát (hlavička + otázka;odpověď).");
        return;
      }

      const deckName = file.name;
      setCustomDecks((prev) => ({ ...prev, [deckName]: parsedCards }));
      setDecksError("");
    };
    reader.onerror = () => {
      setDecksError("Nepodařilo se přečíst soubor.");
    };
    reader.readAsText(file);
  };

  // Smazání vlastního balíčku
  const handleDeleteCustomDeck = (deckName) => {
    setCustomDecks((prev) => {
      const next = { ...prev };
      delete next[deckName];
      return next;
    });
  };

  // Přepnutí dark mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Nepřihlášený uživatel → zobrazíme Login
  if (!user) {
    return (
      <div className={"app " + (theme === "dark" ? "dark-mode" : "")}> 
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Přihlášený uživatel → výpis balíčků / procvičování 
  return (
    <div className={"app " + (theme === "dark" ? "dark-mode" : "")}> 
      {/* Horní lišta s pozdravem, motivem a odhlášením */}
      <header className="topbar">
        <span className="topbar-greeting">
          <span><strong>{user}</strong></span>
        </span>
        <div className="topbar-actions">
          <button className="btn-small theme-toggle" onClick={toggleTheme} aria-label="Přepnout motiv">
            {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          <button className="btn-small" onClick={handleLogout}>Odhlásit</button>
        </div>
      </header>

      {view === "list" ? (
        <DeckList
          decks={decks}
          customDecks={customDecks}
          isLoading={isLoadingDecks}
          error={decksError}
          onSelectDeck={handleSelectDeck}
          onCsvUpload={handleCsvUpload}
          onDeleteCustomDeck={handleDeleteCustomDeck}
        />
      ) : (
        <FlashcardViewer
          cards={cards}
          deckFileName={selectedDeck}
          onBack={() => {
            setView("list");
            setSelectedDeck(null);
            setCards([]);
          }}
        />
      )}
    </div>
  );
}

export default App;