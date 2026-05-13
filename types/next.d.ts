declare module "next/navigation" {
  export function redirect(url: string): never;
}

declare module "next/link" {
  type ReactNode = any;

  interface LinkProps {
    href: string;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  const Link: (props: LinkProps) => any;
  export default Link;
}
