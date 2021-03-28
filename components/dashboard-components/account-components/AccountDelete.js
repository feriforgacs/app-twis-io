import { useState } from "react";
import Modal from "../Modal";

export default function AccountDelete() {
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const deleteAccount = async () => {
		/**
		 * @todo send request to backend
		 * @todo display loading state
		 * @todo log out user
		 * @todo redirect to login page
		 */
		setDeleteLoading(true);
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

			{deleteModalVisible && <Modal title="Are you sure you want to delete your account?" body="🛑 When you delete your account all the campaigns you created and all the collected participant information will be removed as well. You can't undo that." primaryAction={deleteAccount} primaryActionLabel="Yes, delete my account" secondaryAction={() => setDeleteModalVisible(false)} secondaryActionLabel="Keep my account" onClose={() => setDeleteModalVisible(false)} loading={deleteLoading} />}
		</div>
	);
}
