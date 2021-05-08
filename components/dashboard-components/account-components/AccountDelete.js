import { useState } from "react";
import { signOut, useSession } from "next-auth/client";
import Modal from "../Modal";
import Toast from "../Toast";

export default function AccountDelete() {
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [session] = useSession();

	const deleteAccount = async () => {
		setDeleteLoading(true);

		try {
			const accountDeleteRequest = await fetch(`/api/account/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: session.user.id,
				}),
			});

			const accountDeleteResult = await accountDeleteRequest.json();

			setDeleteLoading(false);

			if (accountDeleteResult.success !== true) {
				// error
				setDeleteModalVisible(false);
				setToastMessage("Can't delete account. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
				return;
			} else {
				signOut({ callbackUrl: `${process.env.APP_URL}/?logout=1` });
				return;
			}
		} catch (error) {
			setDeleteLoading(false);
			setDeleteModalVisible(false);
			setToastMessage("Can't delete account. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
	};

	return (
		<div className="account__delete">
			<h3 className="section-title">Delete account</h3>
			<p>You can delete your account by clicking the button below.</p>
			<p>
				<strong>When you delete your account all the campaigns your created and all the participant information you collected will be permanently removed as well.</strong>
			</p>

			<button className="button button--slim button--outline" onClick={() => setDeleteModalVisible(true)}>
				Delete my account
			</button>

			{deleteModalVisible && <Modal title="Are you sure you want to delete your account?" body="🛑 When you delete your account all the campaigns you created and all the collected participant information will be removed as well. You can't undo that. If you have an active subscription, that'll be cancelled as well. If you have overages on your account, that'll be charged before deleting your account." primaryAction={deleteAccount} primaryActionLabel="Yes, delete my account" secondaryAction={() => setDeleteModalVisible(false)} secondaryActionLabel="Keep my account" onClose={() => setDeleteModalVisible(false)} loading={deleteLoading} />}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
