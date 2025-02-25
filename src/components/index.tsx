import TimeIntervals from "./timeInterval";
import React, {useCallback, useState} from 'react';
import { HistoricalDatesProps, HistoricalEvent, YearsIntervalProps } from "../types";

const ROTATION_DURATION = 1;

function HistoricalDates({ data }: HistoricalDatesProps) {
    const [currentEvent, setCurrentEvent] = useState<HistoricalEvent>(data[0]);
    const [years, setYears] = useState<YearsIntervalProps>(data[0].yearsInterval);
    const [arrowDirection, setArrowDirection] = useState<null | 'left' | 'right'>(null);
    const [isUpdating, setUpdating] = useState<boolean>(false);

    const pointsData = data.map(({ index, label }) => ({
        index,
        label: label.charAt(0).toUpperCase() + label.slice(1),
    }));

    const updateYears = useCallback((newIndex: number) => {
        const newEvent = data.find(e => e.index === newIndex);
        if (!newEvent || isUpdating) return;

        setUpdating(true);
        const startDelta = newEvent.yearsInterval.start - years.start;
        const endDelta = newEvent.yearsInterval.end - years.end;
        const steps = Math.max(Math.abs(startDelta), Math.abs(endDelta));
        const delay = (ROTATION_DURATION * 500) / steps;

        const interval = setInterval(() => {
            setYears(prev => ({
                start: prev.start + (startDelta / steps),
                end: prev.end + (endDelta / steps)
            }));
        }, delay);

        setTimeout(() => {
            clearInterval(interval);
            setYears(newEvent.yearsInterval);
            setCurrentEvent(newEvent);
            setUpdating(false);
        }, ROTATION_DURATION * 500);

    }, [years, data, isUpdating]);

    const handleBulletClick = (index: number) => {
        if (!isUpdating) {
            updateYears(index);
        }
    };

    if (data.length < 2 || data.length > 6) {
        return null;
    }

    return (
        <div className="historical-dates">
            <div className="title">
                Исторические <br /> даты
            </div>
            <TimeIntervals
                currentPointIndex={currentEvent.index}
                start={Math.round(years.start)}
                end={Math.round(years.end)}
                pointsData={pointsData}
                rotationDuration={ROTATION_DURATION}
                bulletClickHandler={handleBulletClick}
                arrowDirection={arrowDirection}
                arrowDirectionSetter={setArrowDirection}
            />
        </div>
    );
}

export default HistoricalDates;
