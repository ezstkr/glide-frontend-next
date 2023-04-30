import NextAuth from "next-auth"

export const authOptions = {
  site: process.env.NEXT_PUBLIC_API_URL,

  providers: [
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)