export type NavigateOptions = {
  keepScrollPosition?: boolean;
};

export interface RouterPort {
  navigate(url: string, options?: NavigateOptions): Promise<void>;
  onHashChange(cb: (hash: string) => void): () => void;
}
