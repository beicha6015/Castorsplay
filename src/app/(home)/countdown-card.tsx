'use client'

import { useState, useEffect } from 'react'
import { Hourglass } from 'lucide-react'
import { motion } from 'motion/react'

// ========== 固定配置 ==========
const BIRTH_YEAR = 2003
const BIRTH_MONTH = 6
const BIRTH_DAY = 1
const TARGET_AGE = 60

// ========== 位置常量 ==========
const RIGHT_MARGIN = 24
const TOP_MARGIN = 8
const CARD_WIDTH = 200
const CARD_HEIGHT = 80

// ========== 计算核心 ==========
function calcBirthDateDiff() {
	const now = new Date()
	const by = BIRTH_YEAR
	const bm = BIRTH_MONTH - 1 // Date 月份从 0 开始
	const bd = BIRTH_DAY

	// 出生那天结束的瞬间（方便计算）
	const birth = new Date(by, bm, bd, 23, 59, 59)

	// 当前年龄（已满多少岁）
	let currentAge = now.getFullYear() - by
	const birthThisYear = new Date(now.getFullYear(), bm, bd)
	if (now < birthThisYear) {
		currentAge--
	}

	// 目标年龄的生日那天
	const targetBirthDate = new Date(by + TARGET_AGE, bm, bd)

	// 距离目标生日的日期差
	const diffMs = targetBirthDate.getTime() - now.getTime()

	if (diffMs <= 0) {
		return { years: 0, months: 0, days: 0, totalDays: 0, reached: true }
	}

	// 精确年月日计算
	function diffYMD(from: Date, to: Date) {
		let y = to.getFullYear() - from.getFullYear()
		let m = to.getMonth() - from.getMonth()
		let d = to.getDate() - from.getDate()

		if (d < 0) {
			m--
			const prev = new Date(to.getFullYear(), to.getMonth(), 0)
			d += prev.getDate()
		}
		if (m < 0) {
			y--
			m += 12
		}
		return { y, m, d }
	}

	const { y, m, d } = diffYMD(now, targetBirthDate)

	return {
		years: y,
		months: m,
		days: d,
		totalDays: Math.ceil(diffMs / 86400000),
		reached: false,
	}
}

export default function CountdownCard() {
	// SSR 默认隐藏，等 client 渲染后用 useEffect 设置实际 x
	const [x, setX] = useState(-CARD_WIDTH)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const updateX = () => {
			setX(window.innerWidth - CARD_WIDTH - RIGHT_MARGIN)
		}
		updateX()
		setMounted(true)
		window.addEventListener('resize', updateX)
		return () => window.removeEventListener('resize', updateX)
	}, [])

	const countdown = calcBirthDateDiff()

	return (
		<motion.div
			className='card squircle'
			style={{
				position: 'fixed',
				left: x,
				top: TOP_MARGIN,
				width: CARD_WIDTH,
				height: CARD_HEIGHT,
				cursor: 'pointer',
				opacity: mounted ? 1 : 0,
			}}
			animate={{ opacity: mounted ? 1 : 0 }}
			transition={{ duration: 0.3 }}
			onClick={() => {
				window.location.href = '/countdown.html'
			}}
			onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.85' }}
			onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}>
			<div className='flex h-full flex-col items-center justify-center gap-0.5 p-2'>
				{/* 标题 */}
				<div className='flex items-center gap-1'>
					<Hourglass className='text-brand h-3 w-3' />
					<span className='text-secondary text-[10px] font-medium'>60岁倒计时</span>
				</div>

				{/* 倒计时数字 */}
				<div className='grid grid-cols-3 gap-1'>
					<div className='bg-secondary/10 flex flex-col items-center rounded py-0.5'>
						<span className='text-brand text-sm font-bold'>{countdown.years}</span>
						<span className='text-secondary text-[9px]'>年</span>
					</div>
					<div className='bg-secondary/10 flex flex-col items-center rounded py-0.5'>
						<span className='text-brand text-sm font-bold'>{countdown.months}</span>
						<span className='text-secondary text-[9px]'>月</span>
					</div>
					<div className='bg-secondary/10 flex flex-col items-center rounded py-0.5'>
						<span className='text-brand text-sm font-bold'>{countdown.days}</span>
						<span className='text-secondary text-[9px]'>日</span>
					</div>
				</div>

				{/* 总计日数 */}
				<div className='text-secondary text-[9px]'>
					共 <span className='text-brand font-medium'>{countdown.totalDays.toLocaleString()}</span> 天
				</div>
			</div>
		</motion.div>
	)
}
