exports.name = "extract_keywords";
exports.description = "Extracts simple keywords from text (offline, no APIs).";

function tokenize(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

exports.run = async ({ text, topK = 12 }) => {
    const words = tokenize(text);
    const stop = new Set(["the","a","an","and","or","but","to","of","in","on","for","with","is","are","was","were","be","been","it","that","this","as","at","by","from"]);
    const counts = new Map();

    for (const w of words) {
        if (w.length < 3) continue;
        if (stop.has(w)) continue;
        counts.set(w, (counts.get(w) || 0) + 1);
    }

    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, Math.max(1, Math.min(100, Number(topK)))).map(([word, count]) => ({ word, count }));

    return { keywords: ranked };
};