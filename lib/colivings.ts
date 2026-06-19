import type { Coliving } from "@/lib/types";
import data from "@/data/colivings.json";

// The mock dataset stands in for an Output.ai agent's structured output. The
// JSON's inferred type is structurally compatible with `Coliving`, so we assert
// once here and hand typed data to the rest of the app.
const colivings = data as Coliving[];

/** Returns all colivings in the dataset. */
export function getColivings(): Coliving[] {
  return colivings;
}

/** Returns a single coliving by id, or `undefined` if not found. */
export function getColivingById(id: string): Coliving | undefined {
  return colivings.find((c) => c.id === id);
}
