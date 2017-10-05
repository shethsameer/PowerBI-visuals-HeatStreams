import * as React from 'react'

export interface IOverlayProps {
	height: number
	width: number
	x: number
	xScale: any
	highlightColor: string
	onDrag: (bounds: Array<number | Date>) => void
	onClick: (x: number, y: number, ctrl: boolean) => void
	timeScrub: any
}

const CLICK_TIME_CUTOFF = 200
const CLICK_DISTANCE_CUTOFF = 15

export interface IOverlayState {
	dragging: boolean
	dragStart: number
	dragEnd: number
	dragEndTime: number
	dragStartTime: number
}

const INITIAL_STATE = Object.freeze({
	dragEnd: null,
	dragEndTime: null,
	dragStart: null,
	dragStartTime: null,
	dragging: false,
})

class Overlay extends React.Component<IOverlayProps, IOverlayState> {
	constructor(...args) {
		super(...args)
		this.state = INITIAL_STATE
	}

	public render() {
		const {
			height,
			width,
			x,
			xScale,
			highlightColor,
			timeScrub: timeScrubProps,
		} = this.props

		const timeScrub = this.state.dragging
			? [this.dragStart, this.dragEnd]
			: timeScrubProps
		return (
			<g className="overlay">
				<rect
					x={x}
					height={height}
					width={width}
					fill="transparent"
					cursor="crosshair"
					onMouseDown={evt => this.onMouseDown(evt)}
					onMouseMove={evt => this.onMouseMove(evt)}
					onMouseUp={evt => this.onMouseUp(evt)}
					onMouseLeave={evt => this.onMouseLeave(evt)}
				/>
				{timeScrub ? (
					<rect
						className="selection"
						height={height}
						width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
						x={xScale(timeScrub[0])}
						fill="transparent"
						stroke={highlightColor}
						strokeWidth={1}
					/>
				) : null}
			</g>
		)
	}

	private onMouseDown(evt) {
		if (this.state.dragging) {
			this.cutDrag(evt)
		} else {
			this.setState({
				dragEnd: evt.clientX,
				dragStart: evt.clientX,
				dragStartTime: +Date.now(),
				dragging: true,
			})
		}
	}

	private onMouseUp(evt) {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	private onMouseMove(evt) {
		if (this.state.dragging) {
			this.setState({
				...this.state,
				dragEnd: evt.clientX,
			})
		}
	}

	private onMouseLeave(evt) {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	private cutDrag(evt) {
		const { xScale } = this.props
		if (this.isDragAction) {
			const bounds = [
				xScale.invert(this.dragStart),
				xScale.invert(this.dragEnd),
			]
			this.setState(INITIAL_STATE)
			this.props.onDrag(bounds)
		} else {
			this.setState(INITIAL_STATE)
			this.props.onClick(evt.clientX, evt.clientY, evt.ctrlKey || evt.metaKey)
		}
	}

	private get isDragAction() {
		const dragEndTime = +Date.now()
		const timeDiff = dragEndTime - this.state.dragStartTime
		const distDiff = this.dragEnd - this.dragStart
		return timeDiff > CLICK_TIME_CUTOFF || distDiff > CLICK_DISTANCE_CUTOFF
	}

	private get dragStart() {
		return Math.min(this.state.dragStart, this.state.dragEnd)
	}

	private get dragEnd() {
		return Math.max(this.state.dragStart, this.state.dragEnd)
	}
}

export default Overlay
