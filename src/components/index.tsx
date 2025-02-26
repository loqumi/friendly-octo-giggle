import TimeIntervals from "./timeInterval";
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { HistoricalDatesProps, HistoricalEvent, YearsIntervalProps } from "../types";
import ControlsWrapper from "./ControlsWrapper";
import FractionPagination from "./FractionPagination";
import ArrowControls from "./ArrowControls";
import Slider from "./Slider";
import BulletsPagination from "./BulletsPagination";
import { hidePointLabel } from "../utils/gsap";

const ROTATION_DURATION = 1;

function HistoricalDates({ data }: HistoricalDatesProps) {
    const [currentEvent, setCurrentEvent] = useState<HistoricalEvent>(data[0]);
    const [years, setYears] = useState<YearsIntervalProps>(data[0].yearsInterval);
    const [arrowDirection, setArrowDirection] = useState<null | 'left' | 'right'>(null);
    const [isUpdating, setUpdating] = useState<boolean>(false);
    const [isMobileScreen, setIsMobileScreen] = useState(false);

    const sliderData = data[currentEvent.index - 1].details;

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsMobileScreen(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        if (currentEvent.index === index) return;
        updateYears(index);
    };

    const handleControlClick = useCallback((e: React.MouseEvent, delta: number) => {
        if (isUpdating) return;
        hidePointLabel(currentEvent.label)

        let newIndex = currentEvent.index + delta;
        updateYears(newIndex)
        if (newIndex < 1) newIndex = data.length;
        if (newIndex > data.length) newIndex = 1;

        const newEvent = data.find(e => e.index === newIndex);
        if (!newEvent) return;

        if (isMobileScreen) {
            updateYears(newIndex);
        } else {
            setArrowDirection(delta < 0 ? 'left' : 'right');
            setCurrentEvent(newEvent);
        }
    }, [currentEvent.index, data, isUpdating, isMobileScreen, updateYears]);

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
            <hr className="historical-dates__delimiter" />
            <ControlsWrapper>
                <FractionPagination
                    currentPointIndex={currentEvent.index}
                    pointsLength={data.length}
                />
                <ArrowControls
                    controlClickHandler={handleControlClick}
                    pointsLength={data.length}
                    arrowDirection={arrowDirection}
                    currentPointIndex={currentEvent.index}
                />
            </ControlsWrapper>
            <Slider sliderData={sliderData} isMobileScreen={isMobileScreen} />
            <BulletsPagination
                currentPointIndex={currentEvent.index}
                pointsLength={data.length}
                bulletClickHandler={handleBulletClick}
            />
        </div>
    );
}

export default HistoricalDates;