import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
	site: process.env.NEXTAUTH_URL,

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

	database: {
		type: "mongodb",
		useNewUrlParser: true,
		useUnifiedTopology: true,
		url: process.env.DATABASE_URL,
	},
	events: {
		createUser: async (message) => {
			/**
			 * Add user to sendgrid contacts list to start welcome automation
			 */
			const res = await fetch(`${process.env.APP_URL}/api/sendgrid/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});

			/**
			 * Error
			 */
			if (res.status !== 200) {
				// TODO
				// send alert to admin
			}
		},
		error: async (message) => {
			// TODO
			// auth error
			// send alert to admin
		},
	},
};

export default (req, res) => NextAuth(req, res, options);
