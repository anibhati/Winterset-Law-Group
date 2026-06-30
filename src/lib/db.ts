// DEPRECATED: kept only so any stray import doesn't hard-crash the build.
// All code should import { prisma } from "@/lib/prisma" instead.
// Having two separate PrismaClient instances doubles your DB connection
// pool usage, which is a real problem under load with a pooled connection
// limit (e.g. Supabase pgbouncer). Do not reintroduce a second client here.
export { prisma as db } from "./prisma";
