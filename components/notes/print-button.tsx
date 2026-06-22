"use client";

/** Screen-only affordance for the browser's print / "Save as PDF" dialog. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      Save as PDF
    </button>
  );
}
