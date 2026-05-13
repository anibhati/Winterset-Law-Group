declare module "next-auth" {
  export interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  }

  export interface Session {
    user: User;
    expires?: string;
  }

  export interface JWT {
    id: string;
    role?: string;
    [key: string]: any;
  }

  export interface NextAuthOptions {
    [key: string]: any;
  }

  export function getServerSession(options: NextAuthOptions): Promise<Session | null>;
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
    role?: string;
    [key: string]: any;
  }
}

declare module "next-auth/providers/credentials" {
  function CredentialsProvider(options: any): any;
  namespace CredentialsProvider {}
  export default CredentialsProvider;
}
