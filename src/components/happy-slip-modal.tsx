'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import happySlipsData from '@/config/happy-slips.json'

type HappySlip = {
	id: number
	type: 'text' | 'image' | 'mixed'
	content: string
	imageUrl?: string
}

type HappySlipModalProps = {
	open: boolean
	onClose: () => void
}

export default function HappySlipModal({ open, onClose }: HappySlipModalProps) {
	const [slip, setSlip] = useState<HappySlip | null>(null)
	const shownIdsRef = useRef<Set<number>>(new Set())
	const slips = useRef<HappySlip[]>(happySlipsData.slips as HappySlip[])
	const slipRef = useRef<HTMLDivElement>(null)

	// 每次打开时抽一条 — 只依赖 open，用 ref 追踪已看 id
	useEffect(() => {
		if (!open) return
		const allSlips = slips.current
		if (allSlips.length === 0) return

		const shown = shownIdsRef.current
		const remaining = allSlips.filter(s => !shown.has(s.id))
		if (remaining.length === 0) shownIdsRef.current = new Set<number>() // 全看完一轮，重置

		const pool = remaining.length > 0 ? remaining : allSlips
		const random = pool[Math.floor(Math.random() * pool.length)]
		shownIdsRef.current.add(random.id)
		setSlip(random)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	// 点击遮罩关闭
	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (slipRef.current && !slipRef.current.contains(e.target as Node)) {
				onClose()
			}
		},
		[onClose]
	)

	// ESC 关闭
	useEffect(() => {
		if (!open) return
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleKey)
		return () => window.removeEventListener('keydown', handleKey)
	}, [open, onClose])

	return (
		<AnimatePresence>
			{open && slip && (
				<motion.div
					className='fixed inset-0 z-[100] flex items-center justify-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					onClick={handleBackdropClick}>
					{/* 遮罩 */}
					<motion.div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />

					{/* 卷轴纸条 */}
					<motion.div
						ref={slipRef}
						className='relative z-10 overflow-hidden'
						style={{ maxWidth: '85vw' }}
						initial={{ width: 0, opacity: 0, borderRadius: 200 }}
						animate={{ width: 320, opacity: 1, borderRadius: 16 }}
						exit={{ width: 0, opacity: 0, borderRadius: 200 }}
						transition={{
							width: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
							opacity: { duration: 0.6 },
							borderRadius: { duration: 0.8 }
						}}>
						{/* 卷轴顶部装饰 */}
						<div className='flex h-7 shrink-0 items-center justify-center'>
							<div className='h-1 w-[70%] rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-60' />
						</div>

						{/* 内容区 */}
						<div className='mx-4 min-h-[120px] min-w-0 overflow-hidden p-5'>
							{/* 类型标签 */}
							<div className='mb-3 flex shrink-0 items-center gap-2'>
								<span className='inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700'>
									💊 开心胶囊 #{slip.id}
								</span>
							</div>

							{/* 纯文字 */}
							{slip.type === 'text' && (
								<p
									className='capsule-text leading-relaxed font-medium'
									style={{
										background: 'linear-gradient(to right, #f59e0b, #fde047, #fb923c)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										color: 'transparent'
									}}>
									{slip.content}
								</p>
							)}

							{/* 仅图片 */}
							{slip.type === 'image' && slip.imageUrl && (
								<div className='flex justify-center'>
									<img
										src={slip.imageUrl}
										alt='开心纸条'
										className='max-h-48 rounded-lg object-contain'
									/>
								</div>
							)}

							{/* 图文混合 */}
							{slip.type === 'mixed' && (
								<div className='space-y-3'>
									{slip.imageUrl && (
										<div className='flex justify-center'>
											<img
												src={slip.imageUrl}
												alt='开心纸条'
												className='max-h-36 rounded-lg object-contain'
											/>
										</div>
									)}
									<p className='capsule-text leading-relaxed text-sm font-medium'
										style={{
											background: 'linear-gradient(to right, #f59e0b, #fde047, #fb923c)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
											color: 'transparent'
										}}>
										{slip.content}
									</p>
								</div>
							)}
						</div>

						{/* 底部提示 + 关闭 */}
						<div className='mx-4 mb-4 flex shrink-0 items-center justify-between px-1'>
							<span className='text-xs text-gray-400'>点击外部区域关闭</span>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className='rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'>
								<X size={16} />
							</motion.button>
						</div>

						{/* 卷轴底部装饰 */}
						<div className='flex h-7 shrink-0 items-center justify-center'>
							<div className='h-1 w-[70%] rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-60' />
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
