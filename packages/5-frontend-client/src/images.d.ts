declare module '*.png' {
  const png: string;
  export default png;
}

declare module '*.svg' {
  const svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default svg;
}
