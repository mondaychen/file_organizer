export interface File {
  id: string;
  name: string;
  status: "pending" | "failed" | "analyzing" | "analyzed" | null;
  destination?: string;
}
