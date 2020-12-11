import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
	// Configure one or more authentication providers
	providers: [],

	// A database is optional, but required to persist accounts in a database
	database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
