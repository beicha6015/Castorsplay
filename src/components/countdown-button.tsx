import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Hourglass } from 'lucide-react'
import clsx from 'clsx'

type CountdownButtonProps = {
	delay?: number
	className?: string
}

export default function CountdownButton({ delay, className }: CountdownButtonProps) {
	const [show, setShow] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setShow(true)
		}, delay || 1000)
	}, [])

	if (show)
		return (
			<motion.button
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				aria-label='Go to countdown'
				onClick={() => window.open('/countdown.html', '_blank')}
				className={clsx('card heartbeat-container relative overflow-visible rounded-full p-3 cursor-pointer', className)}>
				<motion.div>
					<Hourglass className='heartbeat text-secondary' size={28} />
				</motion.div>
			</motion.button>
		)
}
