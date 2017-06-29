declare module essex.visuals.gantt {
    export interface Category {
        id: number;
        name: string;
    }

    export interface CategoryData {
        category: number;
        date: Date;
        value: number;
    }

    export interface GanttData {
        categories: Category[];
        timeSeries: CategoryData[];
    }


    export interface ValueSlice {
        start: Date;
        end: Date;
        value: number;
    }

    export interface VisualOptions {
        positiveColor: string;
        negativeColor: string;
        fontSize: number;
        rowHeight: number;
        categoryTextPercent: number;
        axisHeight: number;
    }

    export interface RenderOptions extends VisualOptions {
        onClick: (category: string, index: number) => void;
    }
}