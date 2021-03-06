// tslint:disable no-var-requires
import { ICategory } from '@essex/react-heat-streams'
import buildDomainScrub from './data/buildDomainScrub'
const get = require('lodash/get')
const logger = require('./logger')

export default class Interactions {
	constructor(
		private host: powerbi.extensibility.visual.IVisualHost,
		private selectionManager: powerbi.extensibility.ISelectionManager,
	) {} // tslint:disable-line no-empty

	public async clearSelections() {
		logger.info('Handle Clear')
		await this.selectionManager.clear()
		this.applyFilter(null)
		this.persistSelectedCategories([])
	}

	public async selectCategory(
		category: ICategory,
		multiselect: boolean,
		dataView: powerbi.DataView,
	) {
		logger.info('Handle Cat Click', category, multiselect)
		const selection = this.selectionIdForCategory(category, dataView)
		await this.selectionManager.select(selection, multiselect)
		const selectedCategories = this.selectionManager.hasSelection()
			? [category.id]
			: []
		this.persistSelectedCategories(selectedCategories)
	}

	public async scrub(bounds: Array<Date | number>, dv: powerbi.DataView) {
		logger.info('Handle Scrub', bounds)
		if (bounds === null || bounds === undefined || +bounds[0] === +bounds[1]) {
			this.applyFilter(null)
			return
		}
		const column = dv.metadata.columns.find(col => col.roles.grouping)
		const filter = buildDomainScrub(bounds, column.identityExprs[0])
		this.applyFilter(filter)
	}

	/**
	 * Event that gets fired when selection should be restored to the given ids.
	 * @param listener The listener for the event
	 */
	public onRestoreSelection(
		listener: (ids: powerbi.visuals.ISelectionId[]) => any,
	) {
		this.selectionManager.registerOnSelectCallback(listener)
	}

	private selectionIdForCategory(category: ICategory, dv: powerbi.DataView) {
		const categoryColumn = get(dv, 'categorical.categories[0]', [])
		return this.host
			.createSelectionIdBuilder()
			.withCategory(categoryColumn, category.id)
			.createSelectionId()
	}

	private applyFilter(filter) {
		logger.info(
			'Date scrubbing not supported yet in tandem w/ category selection. 🤷‍',
		)
		// this.host.applyJsonFilter(filter, 'data', 'filter')
	}

	private persistSelectedCategories(categories) {
		// This isn't used yet, but PersistProperties fires the update cycle, which lets selections pipe through
		this.host.persistProperties({
			merge: [
				{
					objectName: 'data',
					properties: {
						selectedCategories: JSON.stringify(categories),
					},
					selector: null,
				},
			],
		})
	}
}
