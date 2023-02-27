export function array<T>(length: number, createElement: (index: number) => T) {
  return Array(length)
    .fill(null)
    .map((_, index) => createElement(index));
}
