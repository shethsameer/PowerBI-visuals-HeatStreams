export type XDomain = [number, number] | [Date, Date]

export interface ICategory {
	id: number
	name: string
	metadata?: {
		[key: string]: number
	}
}

export interface ICategoryData {
	position: Date
	value: number
}

export interface IChartData {
	categories: ICategory[]
	categoryData: ICategoryDataMap
	categoryValues: ICategoryValueMap
	positionDomain: XDomain
	valueDomain: [number, number]
}

export type SelectionChangedHandler = (
	category: ICategory,
	multiselect: boolean,
) => void
export type SelectionClearedHandler = () => void
export type ScrubbedHandler = (bounds: Array<Date | number>) => void

export type IColorizer = (value: number) => string
export type IScaler = (value: number | Date) => number

export interface IValueSlice {
	start: Date | number
	value: number
}

export type SortBy = 'name' | 'average' | 'max' | 'density'

export interface IVisualDataOptions {
	valueMin: number
	valueMax: number
	scoreSplit: number
	numericAggregation: number
	dateAggregation: DateAggregation
	isLogScale: boolean
	sortBy: SortBy
	sortInvert: boolean
}

export interface IVisualRenderingOptions {
	highlightColor: string
	rowHeight: number
	categoryTextPercent: number
	axisHeight: number
	rowGap: boolean
	colorScheme: string
	zoomLevel: number
	numTicks: number
	showValues: boolean
	showCategories: boolean
}

export interface IChartProps {
	options: IChartOptions
}

export interface ICategoryDataMap {
	[key: string]: ICategoryData[]
}

export interface ICategoryValueMap {
	[key: string]: IValueSlice[]
}

export interface IProcessedChartsData {
	categoryValues: ICategoryValueMap
	positionDomain: [Date, Date]
}

export interface IChartOptions {
	renderOptions: IVisualRenderingOptions
	dataOptions: IVisualDataOptions
	data: IChartData
	selections: { [key: string]: ICategory }
	timeScrub: Array<Date | number>
}

export interface IndexedCategory extends ICategory {
	index: number
}
export interface IndexedValueSlice extends IValueSlice {
	catIndex: number
}

export type DateAggregation = 'hours' | 'days' | 'months' | 'years'
