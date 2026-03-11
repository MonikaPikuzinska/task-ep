/**
 * Calculates x-offsets for rune positioning based on the parts present.
 * This ensures proper layout for merged SVG runes.
 * @param {number} thousands - Thousands value (0 or multiple of 1000)
 * @param {number} hundreds - Hundreds value (0 or multiple of 100)
 * @param {number} tens - Tens value (0 or multiple of 10)
 * @param {number} ones - Ones value (0-9)
 * @returns {number[]} Array of x-offsets for each rune part
 */
export function calculateXOffsets(thousands, hundreds, tens, ones) {
  const parts = [];
  if (thousands) parts.push("thousands");
  if (hundreds) parts.push("hundreds");
  if (tens) parts.push("tens");
  if (ones) parts.push("ones");

  const count = parts.length;
  let xOffsets = [];

  if (count === 1) {
    xOffsets = [0];
  } else if (count === 2) {
    const p0 = parts[0];
    const p1 = parts[1];
    if (
      (p0 === "hundreds" && p1 === "ones") || // 101 pattern
      (p0 === "thousands" && p1 === "tens" && !hundreds && !ones) // 1020
    ) {
      xOffsets = [0, 0];
    } else if (p0 === "hundreds" && p1 === "tens") {
      // 120
      xOffsets = [35, 0];
    } else {
      xOffsets = [0, 35];
    }
  } else if (count === 3) {
    const p0 = parts[0];
    const p1 = parts[1];
    const p2 = parts[2];
    if (
      p0 === "thousands" &&
      !hundreds &&
      tens > 0 &&
      ones > 0 &&
      p1 === "tens" &&
      p2 === "ones" // 1044
    ) {
      xOffsets = [0, 0, 30];
    } else if (
      p0 === "thousands" &&
      !tens &&
      hundreds > 0 &&
      ones > 0 &&
      p1 === "hundreds" &&
      p2 === "ones" // 1032
    ) {
      xOffsets = [0, 30, 30];
    } else if (p0 === "thousands") {
      // 1320
      xOffsets = [0, 30, 0];
    } else {
      xOffsets = [25, 0, 25];
    }
  } else {
    xOffsets = parts.map((_, idx) => (idx % 2 === 0 ? 0 : 30));
  }

  return xOffsets;
}
