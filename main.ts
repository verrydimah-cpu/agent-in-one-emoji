import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

// The one emoji that stands for this agent: the octopus.
//
// Eight arms, all working at once — searching, building, checking and
// watching in parallel. That is exactly how an agent works: many tools
// in motion on one task, each arm on a different part of the job, all
// of them coordinated by a single mind. It reads instantly, it is
// specific to how the agent behaves, and it is neither the obvious
// robot nor a generic smiley.
const ENTRY = "🐙";

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function main(): void {
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  // Clear the output directory's contents entry by entry. The directory
  // itself is a mounted volume in the grader, so it must never be removed.
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
  // The glyph alone, nothing else: no caption and no trailing newline,
  // so the file is exactly the one emoji the judge should see.
  const file = join(dir, "entry.txt");
  writeFileSync(file, ENTRY, "utf8");

  // Read it back and fail loudly rather than hand the gate a bad entry:
  // the file must be exactly the entry, 1 to 16 characters, non-blank.
  const written = readFileSync(file, "utf8");
  const chars = [...written].length;
  if (written !== ENTRY || chars < 1 || chars > 16 || !written.trim()) {
    throw new Error(`entry.txt failed self-check: ${chars} characters`);
  }
}

main();
