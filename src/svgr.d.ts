declare module "*.svg" {
  const value: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
