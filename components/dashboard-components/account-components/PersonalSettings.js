import { useState } from "react";
import { useSession } from "next-auth/client";
import Button from "../Button";
import Toast from "../Toast";

export default function PersonalSettings() {
	const [session] = useSession();
	const [name, setName] = useState(session.user.name || "");
	const [loading, setLoading] = useState(false);

	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	const updateAccountSettings = async () => {
		setLoading(true);

		try {
			const accountUpdateRequest = await fetch(`/api/account/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
				}),
			});

			const account = await accountUpdateRequest.json();

			if (account.success !== true) {
				setLoading(false);
				// error
				setToastMessage("Can't update account settings. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
				return;
			}

			// display success message
			setToastMessage("Settings have been saved");
			setToastType("default");
			setToastDuration(3000);
			setToastVisible(true);
		} catch (error) {
			console.log(error);
			setLoading(false);
			// error
			setToastMessage("Can't update account settings. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
		return;
	};

	return (
		<div className="personal-settings">
			<h3 className="section-title">Personal settings</h3>
			<div id="personal-settings__form" className="form">
				<div className="form__section">
					<div className="form__group">
						<label className="form__label" htmlFor="name">
							Name
						</label>
						<input type="text" id="name" className="form__input form__input--text" value={name} onChange={(e) => setName(e.target.value)} />
					</div>

					<div className="form__group">
						<label className="form__label" htmlFor="email">
							Email
						</label>
						<input type="email" className="form__input form__input--text" readOnly={true} disabled={true} value={session.user.email} />
						<p className="form__info-text">
							If you&apos;d like to update your email address, please send us a message to{" "}
							<a href="mailto:support@twis.io" target="_blank" rel="noopener noreferrer">
								support@twis.io
							</a>{" "}
							from the email address you used to create your account.
						</p>
					</div>

					<div className="form__group">
						<Button label="Save personal settings" loading={loading} disabled={loading || !name.length} type="primary" onClick={updateAccountSettings} />
					</div>
				</div>
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
