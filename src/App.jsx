import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { mergePngUrlsToSvg } from "./utils/mergePngUrlsToSvg";
import { calculateXOffsets } from "./utils/runeOffsets";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const [thousands, setThousands] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);

  const runeParts = useMemo(
    () => [thousands, hundreds, tens, ones].filter(Boolean),
    [thousands, hundreds, tens, ones],
  );

  const [mergedSvg, setMergedSvg] = useState(null);

  const handleDownload = () => {
    if (!mergedSvg) return;
    const blob = new Blob([mergedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-runes.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConvert = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError("Please enter a number.");
      resetParts();
      return;
    }

    const num = Number(trimmed);

    if (!Number.isInteger(num) || num < 1 || num > 9999) {
      setError("Enter a natural number between 1 and 9999.");
      resetParts();
      return;
    }

    setError("");

    const t = Math.floor(num / 1000) * 1000;
    const h = Math.floor((num % 1000) / 100) * 100;
    const te = Math.floor((num % 100) / 10) * 10;
    const o = num % 10;

    setThousands(t);
    setHundreds(h);
    setTens(te);
    setOnes(o);
  };

  const resetParts = () => {
    setThousands(0);
    setHundreds(0);
    setTens(0);
    setOnes(0);
    setMergedSvg(null);
  };

  useEffect(() => {
    const makeMergedSvg = async () => {
      const urls = runeParts.map((value) => `src/runes/${value}.png`);

      if (!urls.length) {
        setMergedSvg(null);
        return;
      }

      // Compute x offsets per rune to match desired layouts
      const xOffsets = calculateXOffsets(thousands, hundreds, tens, ones);

      const svg = await mergePngUrlsToSvg(urls, xOffsets);
      setMergedSvg(svg);
    };

    makeMergedSvg();
  }, [runeParts, thousands, hundreds, tens, ones]);

  return (
    <div className="app">
      <h1>Number to rune</h1>

      <div className="card">
        <label htmlFor="number-input">Enter a natural number:</label>
        <input
          style={{ marginLeft: "10px", marginRight: "10px" }}
          id="number-input"
          type="number"
          min={1}
          max={9999}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleConvert}>Convert</button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="runes">
        <h2>Rune images</h2>
        {runeParts.length === 0 ? (
          <p>No runes to display yet.</p>
        ) : (
          <div className="rune-list">
            {mergedSvg && (
              <>
                <div dangerouslySetInnerHTML={{ __html: mergedSvg }} />
                <button type="button" onClick={handleDownload}>
                  Download rune SVG
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
