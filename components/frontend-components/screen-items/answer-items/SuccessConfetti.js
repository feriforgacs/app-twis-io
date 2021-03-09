import styles from "./SuccessConfetti.module.scss";

export default function SuccessConfetti({ successEmoji }) {
	return (
		<div className={styles.emojiConfetti}>
			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}></div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>

			<div className={styles.emojiConfettiItem}>
				<span className={styles.emoji}>{successEmoji}</span>
			</div>
		</div>
	);
}
