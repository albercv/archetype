import { PrismaClient, type Prisma, type Session } from '@prisma/client'

// Singleton PrismaClient
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function createSession(answers: Prisma.InputJsonValue): Promise<string> {
  const session = await prisma.session.create({
    data: { answers, status: 'PENDING' },
    select: { id: true },
  })
  return session.id
}

export async function getSession(id: string): Promise<Session | null> {
  return prisma.session.findUnique({ where: { id } })
}

export async function updateSession(id: string, data: Prisma.SessionUpdateInput): Promise<Session> {
  return prisma.session.update({ where: { id }, data })
}
