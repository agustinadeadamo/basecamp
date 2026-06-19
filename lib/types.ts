// Domain model for Basecamp colivings.
//
// This shape mirrors the structured output of an Output.ai research agent: each
// coliving carries not just facts (price, wifi, stay) but the *evidence* behind
// the soft signals (reviews, citations) and an explicit confidence marker so the
// UI can be honest about uncertainty rather than implying false precision.

/** ISO 4217 currency code. Kept as a string union for the currencies we model. */
export type Currency = "EUR" | "USD";

/** The dominant rhythm of a place — used for matching and honest framing. */
export type CommunityType = "focus" | "balanced" | "social";

/** Which axis a piece of qualitative evidence speaks to. */
export type ReviewAxis = "focus" | "social";

/** A single qualitative data point, attributed to a real, linkable source. */
export interface Review {
  quote: string;
  author: string;
  /** Whether this review is evidence about focus/productivity or social/community. */
  axis: ReviewAxis;
  /** Human-readable source name, e.g. "Nomad List", "Reddit r/digitalnomad". */
  source: string;
  url: string;
}

/** A factual claim backed by a citable source, so numbers aren't unsourced. */
export interface Citation {
  claim: string;
  source: string;
  url: string;
}

/**
 * How much to trust this record. Supports honest-uncertainty UI: a "thin" place
 * with few reports should be presented more tentatively than a "verified" one.
 */
export interface DataConfidence {
  level: "thin" | "verified";
  /** Number of independent reports/sources the record is built from. */
  reportsCount: number;
  /** ISO 8601 date the data was last corroborated. */
  lastUpdated: string;
}

export interface Coliving {
  id: string;
  name: string;
  city: string;
  /** Estimated all-in monthly cost (rent + utilities + coworking), in `currency`. */
  monthlyAllIn: number;
  currency: Currency;
  minStayDays: number;
  /** Typical measured download speed in Mbps. */
  wifiMbps: number;
  /** Whether the space is comfortable for frequent video calls (quiet/booths). */
  callsFriendly: boolean;
  /** 0–1, higher means more focus-oriented (quiet, deep work). */
  focusScore: number;
  communityType: CommunityType;
  /** Short, scannable descriptors, e.g. "oceanfront", "quiet", "weekly dinners". */
  vibeTags: string[];
  /** Mix of focus- and social-axis reviews so both sides are represented. */
  reviews: Review[];
  citations: Citation[];
  dataConfidence: DataConfidence;
}
