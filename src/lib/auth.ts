import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true
                      }
                    }
                  }
                }
              }
            },
            branch: true
          }
        })

        if (!user || user.status !== 'ACTIVE') {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Extract roles and permissions
        const roles = user.userRoles.map(ur => ur.role.name)
        const permissions = user.userRoles.flatMap(ur =>
          ur.role.rolePermissions.map(rp => `${rp.permission.module}:${rp.permission.action}`)
        )

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles,
          permissions: [...new Set(permissions)],
          branchId: user.branchId
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = (user as any).roles
        token.permissions = (user as any).permissions
        token.branchId = (user as any).branchId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.roles = token.roles as string[]
        session.user.permissions = token.permissions as string[]
        session.user.branchId = token.branchId as string | null
      }
      return session
    }
  }
})

// Helper to check permission
export function hasPermission(
  userPermissions: string[],
  module: string,
  action: string
): boolean {
  return userPermissions.includes(`${module}:${action}`) ||
         userPermissions.includes(`${module}:*`) ||
         userPermissions.includes('*:*')
}

// Helper to check role
export function hasRole(userRoles: string[], role: string): boolean {
  return userRoles.includes(role) || userRoles.includes('ADMIN')
}
