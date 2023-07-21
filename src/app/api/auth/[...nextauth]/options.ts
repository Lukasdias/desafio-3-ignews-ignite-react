import { fauna } from "@/services/fauna";
import { query as q } from "faunadb";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const options: NextAuthOptions = {
        debug: process.env.NODE_ENV === "development",
        providers: [
                GitHubProvider({
                        clientId: process.env.GITHUB_CLIENT_ID!,
                        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
                        httpOptions: {
                                timeout: 15000,
                        },
                }),
        ],
        callbacks: {
                async signIn({ user, account, profile, email, credentials }) {
                        const { email: userEmail } = user;
                        try {
                                await fauna.query(
                                        q.If(
                                                q.Not(
                                                        q.Exists(
                                                                q.Match(
                                                                        q.Index(
                                                                                "user_by_email"
                                                                        ),
                                                                        q.Casefold(
                                                                                user.email!
                                                                        )
                                                                )
                                                        )
                                                ),
                                                q.Create(
                                                        q.Collection("users"),
                                                        {
                                                                data: {
                                                                        email: userEmail!,
                                                                },
                                                        }
                                                ),
                                                q.Get(
                                                        q.Match(
                                                                q.Index(
                                                                        "user_by_email"
                                                                ),
                                                                q.Casefold(
                                                                        user.email!
                                                                )
                                                        )
                                                )
                                        )
                                );
                                return true;
                        } catch {
                                return false;
                        }
                },
                async redirect({ url, baseUrl }) {
                        return baseUrl;
                },
                async session({ session, user, token }) {
                        return session;
                },
                async jwt({ token, user, account, profile, isNewUser }) {
                        return token;
                },
        },
};
