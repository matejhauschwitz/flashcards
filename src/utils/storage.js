export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function parseCsvDeck(csvText) {
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