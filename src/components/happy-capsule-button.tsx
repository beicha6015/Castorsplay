'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'

type HappyCapsuleButtonProps = {
	delay?: number
	className?: string
	onOpen: () => void
}

/** 药瓶图标 SVG（Lucide 没有药瓶图标，自定义） */
function PillBottleIcon({ className, size = 24 }: { className?: string; size?: number }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}>
			{/* 瓶盖 */}
			<rect x='9' y='1' width='6' height='4' rx='1' />
			{/* 瓶颈 */}
			<path d='M10 5v2a1 1 0 0 1-1 1H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1a1 1 0 0 1-1-1V5' />
			{/* 标签区域 */}
			<rect x='8' y='13' width='8' height='4' rx='0.5' />
			{/* 标签上的十字 */}
			<line x1='12' y1='14' x2='12' y2='16' />
			<line x1='11' y1='15' x2='13' y2='15' />
		</svg>
	)
}

export default function HappyCapsuleButton({ delay, className, onOpen }: HappyCapsuleButtonProps) {
	const [show, setShow] = useState(false)
	const [shaking, setShaking] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setShow(true), delay || 1000)
		return () => clearTimeout(timer)
	}, [delay])

	const handleClick = useCallback(() => {
		if (shaking) return
		setShaking(true)
		// 摇晃 600ms 后弹出纸条
		setTimeout(() => {
			setShaking(false)
			onOpen()
		}, 600)
	}, [shaking, onOpen])

	if (!show) return null

	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.6 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			aria-label='开心胶囊'
			onClick={handleClick}
			className={clsx(
				'card relative overflow-visible rounded-full p-3 cursor-pointer',
				shaking && 'shadow-lg shadow-emerald-200/50',
				className
			)}>
			<motion.div
				animate={
					shaking
						? {
								rotate: [0, -15, 15, -12, 12, -8, 8, -4, 4, 0],
								scale: [1, 1.15, 1.15, 1.1, 1.1, 1.08, 1.08, 1.05, 1.05, 1]
							}
						: {}
				}
				transition={{ duration: 0.6, ease: 'easeInOut' }}>
				<PillBottleIcon
					className={clsx(
						'heartbeat transition-colors duration-200',
						shaking ? 'text-emerald-400' : 'text-secondary'
					)}
					size={28}
				/>
			</motion.div>

			{/* 摇晃时冒出小星星 */}
			<AnimatePresence>
				{shaking && (
					<>
						{[[-12, -16], [14, -14], [-16, 8], [16, 10]].map(([dx, dy], i) => (
							<motion.span
								key={i}
								className='pointer-events-none absolute text-sm'
								initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
								animate={{
									opacity: [0, 1, 1, 0],
									scale: [0, 1.2, 1, 0.6],
									x: dx,
									y: dy
								}}
								transition={{ duration: 0.5, delay: i * 0.08 }}
								style={{ left: '50%', top: '50%' }}>
								✨
							</motion.span>
						))}
					</>
				)}
			</AnimatePresence>
		</motion.button>
	)
}
