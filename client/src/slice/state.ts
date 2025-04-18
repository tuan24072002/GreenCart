export interface BasicSliceState {
  status: "idle" | "loading" | "completed" | "failed";
  error?: string;
  success?: string;
  action: actions;
}
export interface ActionSliceState {
  status: "idle" | "loading" | "completed" | "failed";
  error?: string;
  success?: string;
  statusAction: "idle" | "loading" | "completed" | "failed";
  action: actions;
}
