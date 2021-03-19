import { useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { format } from "date-fns";
import Link from "next/link";
import NProgress from "nprogress";
import Image from "next/image";
import Modal from "../Modal";

export default function CampaignCard({ _id, name, url, type, status, participantCount, visibleFrom, visibleTo, reloadCampaigns, setToastMessage, setToastVisible, setToastType, setToastDuration }) {
	const [navigationVisible, toggleNavigationVisible] = useState(false);
	const [selectedCampaignId, setSelectedCampaignId] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [duplicateLoading, setDuplicateLoading] = useState(false);

	let expired = false;
	const visibleToDate = format(new Date(visibleTo), "yyyy.MM.dd.");
	const today = format(new Date(Date.now()), "yyyy.MM.dd.");

	if (visibleToDate < today) {
		expired = true;
	}

	const componentRef = useRef(null);

	useEffect(() => {
		const handleClickOutSide = (event) => {
			if (componentRef.current && !componentRef.current.contains(event.target)) {
				if (navigationVisible) {
					toggleNavigationVisible(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutSide);

		return () => {
			document.removeEventListener("mousedown", handleClickOutSide);
		};
	}, [componentRef, navigationVisible]);

	/**
	 * Delete campaign
	 */
	const deleteCampaign = async () => {
		NProgress.start();
		setDeleteLoading(true);

		try {
			const campaignDeleteRequest = await fetch(`/api/campaigns/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: selectedCampaignId,
				}),
			});

			const campaign = await campaignDeleteRequest.json();

			setDeleteLoading(false);
			NProgress.done();

			if (campaign.success !== true) {
				// error
				setModalVisible(false);
				setToastMessage("Can't delete campaign. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
				return;
			} else {
				setModalVisible(false);
				setToastMessage("Campaign has been deleted");
				setToastType("default");
				setToastDuration(3000);
				setToastVisible(true);
				reloadCampaigns(true);
				return;
			}
		} catch (error) {
			setDeleteLoading(false);
			NProgress.done();
			setModalVisible(false);
			setToastMessage("Can't delete campaign. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
	};

	/**
	 * Display confirm modal before deleting a campaign
	 * @param {string} campaignId Selected campaign id
	 */
	const displayConfirmDelete = (campaignId) => {
		toggleNavigationVisible(false);
		setSelectedCampaignId(campaignId);
		setModalVisible(true);
	};

	/**
	 * Duplicate selected campaign
	 * @param {string} id Selected campaign id
	 */
	const duplicateCampaign = async (id) => {
		NProgress.start();
		setDuplicateLoading(true);

		try {
			const campaignDuplicateRequest = await fetch(`/api/campaigns/duplicate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const duplicatedCampaign = await campaignDuplicateRequest.json();

			setDuplicateLoading(false);
			toggleNavigationVisible(false);
			NProgress.done();

			if (duplicatedCampaign.success !== true) {
				// error
				setToastMessage("Can't duplicate campaign. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
				return;
			}

			reloadCampaigns(true);
		} catch (error) {
			console.log(error);
			setDuplicateLoading(false);
			toggleNavigationVisible(false);
			NProgress.done();
			setToastMessage("Can't duplicate campaign. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
	};

	return (
		<>
			<div className="campaign-card">
				<div className="campaign-card__header campaign-card__section">
					<h4 className="campaign-card__title">
						<Link href={`/editor/${_id}`} title={`Edit ${name}`}>
							<a>
								{name.substring(0, 22)}
								{name.length > 22 && "..."}
							</a>
						</Link>
					</h4>

					<button className="button button--card-navigation" onClick={() => toggleNavigationVisible(!navigationVisible)}>
						{!navigationVisible && <span>&hellip;</span>}

						{navigationVisible && (
							<svg viewBox="0 0 20 20">
								<path d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
							</svg>
						)}
					</button>

					{navigationVisible && (
						<div className="campaign-card__navigation campaign-card__navigation--dropdown" ref={componentRef}>
							<a href={`${process.env.CAMPAIGN_URL_PREFIX}${url}`} target="_blank" rel="noopener noreferrer" className="button button--dropdown color--action">
								<span className="button__icon">
									<Image src="/images/icons/icon-link.svg" width={20} height={20} />
								</span>
								View campaign
							</a>
							<button className="button button--dropdown color--action" disabled={duplicateLoading} onClick={() => duplicateCampaign(_id)}>
								<span className="button__icon">
									<Image src="/images/icons/icon-duplicate.svg" width={20} height={20} />
								</span>
								{duplicateLoading ? "Duplicating" : "Duplicate Campaign"}
							</button>
							<button className="button button--dropdown color--tertiary" onClick={() => displayConfirmDelete(_id)}>
								<span className="op-5 button__icon">
									<Image src="/images/icons/icon-delete.svg" width={20} height={20} />
								</span>
								Delete Campaign
							</button>
						</div>
					)}
				</div>
				<div className="campaign-card__body campaign-card__section">
					<div className="campaign-card__meta">
						<span className="badge badge--info badge--campaign-type">{type}</span>
						<span className={`campaign-status badge ${status === "active" ? "badge--active badge--success" : "badge--inactive"} ${expired ? "badge--expired" : ""}`}>
							{status === "active" ? "active" : "inactive"}
							{expired ? " - expired" : ""}
						</span>
						<Link href={`/campaigns/participants/${_id}`}>
							<a className="campaign-participant-count" data-for="participantCountTooltip" data-tip="Unique by email address">
								<span>
									<Image src="/images/icons/icon-participants.svg" width={15} height={15} alt={`${name} - Participants`} />
								</span>
								Unique participants:&nbsp; <strong>{participantCount}</strong>
							</a>
						</Link>

						<ReactTooltip id="participantCountTooltip" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
					</div>

					<div className="campaign-card__info">
						<div className="campaign-info campaign-url">
							<input type="text" value={`${process.env.CAMPAIGN_URL_PREFIX}${url}`} readOnly={true} onFocus={(e) => e.target.select()} />
						</div>
						<div className="campaign-visible-from campaign-info">
							<span className="mr-5">
								<Image src="/images/icons/icon-calendar.svg" width={15} height={15} alt="Camapign visible from" />
							</span>
							Visible from: <strong>{format(new Date(visibleFrom), "yyyy.MM.dd.")}</strong>
						</div>
						<div className="campaign-visible-to campaign-info">
							<span className="mr-5">
								<Image src="/images/icons/icon-calendar.svg" width={15} height={15} alt="Camapign visible to" />
							</span>
							Visible to: <strong>{format(new Date(visibleTo), "yyyy.MM.dd.")}</strong>
						</div>
					</div>
				</div>
				<div className="campaign-card__footer campaign-card__section">
					<Link href={`/editor/${_id}`} title={`Edit ${name}`}>
						<a className="button button--outline-primary">Edit Campaign</a>
					</Link>
				</div>
			</div>

			{modalVisible && <Modal title="Are you sure you want to delete the campaign?" body="⚠️ When you delete a campaign, all the collected participant information will be removed as well. ⚠️" primaryAction={deleteCampaign} primaryActionLabel="Yes, delete campaign" secondaryAction={() => setModalVisible(false)} secondaryActionLabel="Cancel" onClose={() => setModalVisible(false)} loading={deleteLoading} />}
		</>
	);
}
