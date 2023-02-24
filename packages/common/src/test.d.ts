declare module 'node:test' {
  export function beforeEach(fn?: () => void | Promise<void>): void;
  export function afterEach(fn?: () => void | Promise<void>): void;
}
