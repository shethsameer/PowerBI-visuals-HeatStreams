// tslint:disable  no-var-requires
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'
import { ICategory } from '@essex/react-heat-streams'
import DataViewConverter from '../data/DataViewConverter'
import VisualSettings from '../settings/VisualSettings'
import {
	IChartData,
	IChartOptions,
	IVisualDataOptions,
	IVisualRenderingOptions,
} from './interfaces'

export default class ChartOptions implements IChartOptions {
	public dataOptions: IVisualDataOptions
	public renderOptions: IVisualRenderingOptions
	public data: IChartData
	public selections: { [key: string]: ICategory }
	public timeScrub: Array<Date | number>
	public colorizer: Colorizer

	constructor(
		private converter: DataViewConverter,
		public element: HTMLElement,
	) {} // tslint:disable-line no-empty

	public loadFromDataView(
		dataView: powerbi.DataView,
		settings: VisualSettings,
	) {
		this.dataOptions = settings.data
		this.renderOptions = settings.rendering
		this.timeScrub = this.converter.unpackDomainScrub(dataView)
		this.data = this.converter.convertDataView(dataView, settings.data)
		const { colorScheme } = this.renderOptions
		const { isLogScale } = this.dataOptions
		const { valueMin, valueMax, valueMid } = this
		const scaler = isDivergingColorScheme(colorScheme)
			? new DivergingScaler(valueMin, valueMid, valueMax, isLogScale)
			: new LinearScaler(valueMin, valueMax, isLogScale)

		this.colorizer = new Colorizer(scaler, colorScheme)

		this.loadSelections(dataView)
	}

	/**
	 * Loads the selections from the given dataView
	 */
	public loadSelections(dataView: powerbi.DataView) {
		this.selections = this.converter.unpackSelectedCategories(dataView)
	}

	public get width(): number {
		return this.element.getBoundingClientRect().width
	}

	public get height(): number {
		return this.element.getBoundingClientRect().height
	}

	public get valueMin(): number {
		const valueMin = this.dataOptions.valueMin
		return valueMin !== null && valueMin !== undefined
			? valueMin
			: this.data.valueDomain[0]
	}

	public get valueMax(): number {
		const valueMax = this.dataOptions.valueMax
		return valueMax !== null && valueMax !== undefined
			? valueMax
			: this.data.valueDomain[1]
	}

	public get valueMid() {
		const scoreSplit = this.dataOptions.scoreSplit
		return scoreSplit !== null && scoreSplit !== undefined
			? scoreSplit
			: (this.valueMax + this.valueMin) / 2
	}
}
