import { useState } from "react";

/**
 * Komponenta Login
 * – jednoduchý formulář pro zadání jména.
 * – po odeslání volá callback `onLogin` z rodiče (App).
 */
function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return; // prázdné jméno nepustíme
    onLogin(trimmed);
  };

  return (
    <div className="login-card">
      <h1>📚 Flashcards</h1>
      <p className="subtitle">Quizlet pro chudé</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tvoje jméno…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn-primary">
          Přihlásit se
        </button>
      </form>
    </div>
  );
}

export default Login;