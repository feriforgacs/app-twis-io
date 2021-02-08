import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ReactSlider from "react-slider";
import styles from "../ScreenSettings.module.scss";
import FontFamilies from "../../../../utils/FontFamilies";

export default function Font() {
	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<label className={`${styles.settingsLabel} item-settings`}>Font</label>
			<div>
				<ul>
					{FontFamilies.map((FontFamily) => (
						<li key={FontFamily.key}>
							<img src={`/images/editor/fonts/font-${FontFamily.key}.svg`} alt={FontFamily.name} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
