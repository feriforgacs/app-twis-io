import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
	site: process.env.NEXTAUTH_URL,
	// Configure one or more authentication providers
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Providers.Facebook({
			clientId: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
		}),
	],

	// A database is optional, but required to persist accounts in a database
	database: {
		type: "mongodb",
		useNewUrlParser: true,
		useUnifiedTopology: true,
		url: process.env.DATABASE_URL,
	},
};

export default (req, res) => NextAuth(req, res, options);
