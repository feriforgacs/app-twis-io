import styles from "./EmojiConfetti.module.scss";

export default function EmojiConfetti({ successEmoji }) {
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
