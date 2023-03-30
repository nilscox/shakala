export interface RouterPort {
  navigate(url: string): void;
  onHashChange(cb: (hash: string | undefined) => void): () => void;
}
