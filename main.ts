// One Line, One Laugh -- make.fun entry, harness program/v1.
//
// The whole entry is a single funny line. This program holds that line,
// checks it against the competition gate before writing anything, and
// then writes it to the output file the judge reads.
//
// Gate (from RULES.txt): /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space. The line below is plain
// ASCII on one line, well inside that window, so the character count
// and the byte count agree exactly.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The winning line from the local head-to-head race (V5 of five).
// It won every pair in both label orders, including against the
// plain generic benchmark recorded in the build log.
const LINE =
  "I finally beat my insomnia: now I lie awake celebrating how well I am sleeping.";

// Refuse to write anything the sealed gate would reject. Failing
// loudly here is better than shipping a silent invalid entry.
function assertGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`gate: ${chars} characters, need 1..200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: text is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("gate: leading or trailing white space");
  }
  // Exact ties on win rate fall to the smaller text in bytes, so the
  // entry keeps bytes and characters identical: plain ASCII only,
  // which makes the byte count predictable and minimal.
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes !== chars) {
    throw new Error(`gate: ${bytes} bytes for ${chars} characters, need ASCII`);
  }
}

function main(): void {
  assertGate(LINE);
  const target = "/output/entry.txt";
  // Create the output folder first, then write straight to the
  // final path: no temporary file, no rename, no dotfile.
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, LINE, "utf8");
}

main();
