import type { SyntheticEvent } from "react";

/** If a photo fails to load, hide the broken-image icon and let the dark frame show instead. */
export const hideBroken = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};
