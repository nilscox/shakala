declare module '*.png' {
  const image: string;
  export default image;
}

declare module '*.svg' {
  const component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default component;
}
