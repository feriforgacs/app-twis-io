import Image from "next/image";

export default function FooterHelp({ children }) {
	return (
		<div className="footer-help">
			<div className="footer-help__content">
				<div className="footer-help__icon">
					<Image src={`/images/icons/icon-help--active.svg`} width={20} height={20} alt={`Help icon`} />
				</div>
				<div className="footer-help__description">{children}</div>
			</div>
		</div>
	);
}
