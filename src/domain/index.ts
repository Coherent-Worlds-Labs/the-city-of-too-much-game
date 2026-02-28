export type Direction = "protocol" | "carnival" | "balanced";

export interface BootstrapWorldState {
  direction: Direction;
  coherence: "low" | "medium" | "high";
}

export const createInitialWorldState = (): BootstrapWorldState => ({
  direction: "balanced",
  coherence: "medium"
});
