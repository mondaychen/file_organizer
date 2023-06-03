export interface File {
  id: string;
  name: string;
  status: "failed" | "analyzing" | "analyzed" | null;
  destination?: string;
}
