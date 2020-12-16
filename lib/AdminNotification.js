import mail from "@sendgrid/mail";

export default function SendAdminNotification(subject, message) {
	return new Promise((resolve, reject) => {
		const content = {
			to: process.env.ADMIN_NOTIFICATION_EMAIL,
			from: `notification@twis.io`,
			subject,
			text: message,
			html: message,
		};

		mail.setApiKey(process.env.SENDGRID_KEY);

		(async () => {
			try {
				await mail.send(content);
				return resolve();
			} catch (error) {
				console.log("ERROR", error);
				return reject(new Error("SEND_ADMIN_NOTIFICATION_EMAIL_ERROR", error));
			}
		})();
	});
}
