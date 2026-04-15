import HappyCapsuleButton from '@/components/happy-capsule-button'
import HappySlipModal from '@/components/happy-slip-modal'
import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import { motion } from 'motion/react'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'
import { useState } from 'react'

export default function HappyCapsulePosition() {
	const center = useCenterStore()
	const { cardStyles } = useConfigStore()
	const styles = cardStyles.happyCapsulePosition
	const hiCardStyles = cardStyles.hiCard
	const socialButtonsStyles = cardStyles.socialButtons
	const musicCardStyles = cardStyles.musicCard
	const shareCardStyles = cardStyles.shareCard
	const likeStyles = cardStyles.likePosition

	const [modalOpen, setModalOpen] = useState(false)

	// 默认位置：在点赞按钮右边
	const likeX =
		likeStyles.offsetX !== null
			? center.x + likeStyles.offsetX
			: center.x + hiCardStyles.width / 2 - socialButtonsStyles.width + shareCardStyles.width + CARD_SPACING
	const likeY =
		likeStyles.offsetY !== null
			? center.y + likeStyles.offsetY
			: center.y + hiCardStyles.height / 2 + CARD_SPACING + socialButtonsStyles.height + CARD_SPACING + musicCardStyles.height + CARD_SPACING

	const x = styles.offsetX !== null ? center.x + styles.offsetX : likeX + CARD_SPACING + likeStyles.width
	const y = styles.offsetY !== null ? center.y + styles.offsetY : likeY

	return (
		<>
			<HomeDraggableLayer cardKey='happyCapsulePosition' x={x} y={y} width={styles.width} height={styles.height}>
				<motion.div className='absolute max-sm:static' initial={{ left: x, top: y }} animate={{ left: x, top: y }}>
					<HappyCapsuleButton
						delay={cardStyles.shareCard.order * ANIMATION_DELAY * 1000}
						onOpen={() => setModalOpen(true)}
					/>
				</motion.div>
			</HomeDraggableLayer>

			<HappySlipModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	)
}
