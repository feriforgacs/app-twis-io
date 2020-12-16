import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import mail from "@sendgrid/mail";
import SendAdminNotification from "../../../lib/AdminNotification";

const options = {
	site: process.env.NEXTAUTH_URL,

	providers: [
		Providers.Email({
			server: `smtp://${process.env.EMAIL_SMTP_USER}:${process.env.SENDGRID_KEY}@${process.env.EMAIL_SMTP_HOST}`,
			from: process.env.LOGIN_EMAIL_FROM,
			sendVerificationRequest: ({ identifier: email, url }) => {
				return new Promise((resolve, reject) => {
					const site = process.env.SITE_NAME;

					const content = {
						to: email,
						from: `${process.env.LOGIN_EMAIL_FROM_NAME} <${process.env.LOGIN_EMAIL_FROM}>`,
						subject: `Sign in to ${site}`,
						text: verificationEmailText({ url, site, email }),
						html: verificationEmailHTML({ url, site, email }),
					};

					mail.setApiKey(process.env.SENDGRID_KEY);

					(async () => {
						try {
							await mail.send(content);
							return resolve();
						} catch (error) {
							console.log("ERROR", error);
							return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR", error));
						}
					})();
				});
			},
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Providers.Facebook({
			clientId: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
		}),
	],

	pages: {
		verifyRequest: "/check-your-inbox",
		error: "/",
	},

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
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});

			/**
			 * Error
			 */
			if (res.status !== 200) {
				// send alert to admin
				SendAdminNotification(`🔴 ERROR - Create User Error`, `User email: ${JSON.stringify(message)}`);
			} else {
				// send notification about new user to the admin
				SendAdminNotification(`🥳 New user registration`, `User email: ${message.email}`);
			}
		},
		error: async (message) => {
			// auth error
			// send alert to admin
			SendAdminNotification(`🔴 ERROR - Auth Error`, `User email: ${JSON.stringify(message)}`);
		},
	},
};

const verificationEmailHTML = ({ url, site, email }) => {
	const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
	const escapedSite = `${site.replace(/\./g, "&#8203;.")}`;

	const backgroundColor = "#f9f9f9";
	const textColor = "#444444";
	const mainBackgroundColor = "#ffffff";
	const buttonBackgroundColor = "#346df1";
	const buttonBorderColor = "#346df1";
	const buttonTextColor = "#ffffff";

	return `
		<body style="background: ${backgroundColor};">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
						<strong>${escapedSite}</strong>
					</td>
				</tr>
			</table>
			<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
				<tr>
					<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
						Sign in as <strong>${escapedEmail}</strong>
					</td>
				</tr>
				<tr>
					<td align="center" style="padding: 20px 0;">
						<table border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">👉 Sign in 👈</a></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
						If you did not request this email you can safely ignore it.
					</td>
				</tr>
			</table>
		</body>
		`;
};

const verificationEmailText = ({ url, site }) => `Sign in to ${site}\n${url}\n\n`;

export default (req, res) => NextAuth(req, res, options);
