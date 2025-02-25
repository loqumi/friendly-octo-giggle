import {RefObject} from "react";

export type ArrowDirection = 'left' | 'right' | null;

interface PointData {
    index: number;
    label: string;
}

export interface PointProps {
    index: number;
    label: string;
    prevPointRef?: RefObject<HTMLDivElement>;
    prevPointNumberRef?: RefObject<HTMLSpanElement>;
    bulletClickHandler: (id: number) => void;
}

export interface YearsIntervalProps {
    start: number;
    end: number;
}

export interface HistoricalEvent {
    index: number;
    label: string;
    yearsInterval: YearsIntervalProps;
    details: {
        year: number;
        description: string;
    }[];
}

export interface HistoricalDatesProps {
    data: HistoricalEvent[];
}

export interface TimeIntervalsProps {
    currentPointIndex: number;
    start: number;
    end: number;
    pointsData: PointData[];
    rotationDuration: number;
    bulletClickHandler: (id: number) => void;
    arrowDirection: ArrowDirection;
    arrowDirectionSetter: (status: ArrowDirection) => void;
}