export interface File {
  id: string;
  name: string;
  status: "ready" | "failed" | "analyzing" | "analyzed" | null;
  destination?: string;
}
