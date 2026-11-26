import { useId, type MouseEventHandler } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type BackArrowButtonProps =
	| {
		to: string
		ariaLabel: string
		className?: string
		replace?: boolean
	}
	| {
		onClick: MouseEventHandler<HTMLButtonElement>
		ariaLabel: string
		className?: string
	}

const buttonClassName =
	'group inline-flex h-14 w-36 shrink-0 items-center justify-center rounded-md text-white drop-shadow-[0_3px_5px_rgba(89,0,31,0.28)] transition-[filter,transform] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:drop-shadow-[0_7px_10px_rgba(89,0,31,0.42)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d92f5d] focus-visible:ring-offset-2'

function BackArrowShape() {
	const gradientId = `back-arrow-gradient-${useId().replace(/:/g, '')}`

	return (
		<svg
			viewBox="0 0 160 60"
			className="h-full w-full overflow-visible transition-transform duration-300 group-hover:-translate-x-0.5"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#5d0ec0" />
					<stop offset="100%" stopColor="#a684ff" />
				</linearGradient>
			</defs>
			<path
				d="M48 4 4 30l44 26V44h108V16H48V4Z"
				fill={`url(#${gradientId})`}
				stroke="rgba(255,255,255,0.45)"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<text
				x="101"
				y="34"
				textAnchor="middle"
				className="fill-white text-[12px] font-semibold tracking-[0.08em]"
			>
				VOLVER
			</text>
		</svg>
	)
}

function BackArrowButton(props: BackArrowButtonProps) {
	const className = cn(buttonClassName, props.className)

	if ('to' in props) {
		return (
			<Link
				to={props.to}
				replace={props.replace}
				aria-label={props.ariaLabel}
				className={className}
			>
				<BackArrowShape />
			</Link>
		)
	}

	return (
		<button
			type="button"
			onClick={props.onClick}
			aria-label={props.ariaLabel}
			className={className}
		>
			<BackArrowShape />
		</button>
	)
}

export default BackArrowButton
