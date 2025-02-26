import React, { useEffect, useRef } from 'react';
import {
  changePointZPosition,
  hidePoint,
  rotatePoints,
  showPoint,
  showPointLabel
} from '../utils/gsap';
import {
  matrixToDegrees,
  getNearestPointIndex,
  getActualPointIndex
} from '../utils';

import { PointProps, TimeIntervalsProps, YearsIntervalProps } from "../types";

function YearsInterval({ start, end }: YearsIntervalProps) {
  return (
      <div className="time-intervals__years-interval">
        <span className="years-interval__start-year">{start}</span>
        &nbsp;&nbsp;
        <span className="years-interval__final-year">{end}</span>
      </div>
  );
}

function Point({
   index,
   label,
   prevPointRef,
   prevPointNumberRef,
   bulletClickHandler: handleBulletClick,
}: PointProps) {
  return (
      <div className={`time-intervals__point point${index}`} ref={prevPointRef}>
      <span
          className="point-number"
          ref={prevPointNumberRef}
          onClick={() => handleBulletClick(index)}
      >
        {index}
      </span>
        <span className="point-label">{label}</span>
      </div>
  );
}

function TimeIntervals({
  currentPointIndex,
  arrowDirection,
  start,
  end,
  pointsData,
  rotationDuration,
  bulletClickHandler: handleBulletClick,
  arrowDirectionSetter: setArrowDirection,
}: TimeIntervalsProps) {
  const ancestorRef = useRef<HTMLDivElement | null>(null);
  const activePointNumberRef = useRef<HTMLSpanElement | null>(null);
  const activePointRef = useRef<HTMLDivElement | null>(null);
  const prevPointNumberRef = useRef<HTMLSpanElement | null>(null);
  const prevPointRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    prevPointRef.current = ancestorRef.current?.querySelector(
      '.time-intervals__point',
    ) as HTMLDivElement;
    prevPointNumberRef.current =
      prevPointRef.current?.querySelector('.point-number');

    showPoint({
      point: prevPointRef.current as HTMLDivElement,
      pointNumber: prevPointNumberRef.current as HTMLSpanElement,
      animate: false,
    });
    showPointLabel({
      label: prevPointRef.current?.querySelector(
        '.point-label',
      ) as HTMLSpanElement,
      animate: false,
    });

    const pointsQuantity = pointsData.length;

    const circle = ancestorRef.current as HTMLSpanElement;
    let circleCoords = circle?.getBoundingClientRect();
    let circleRadius = circleCoords.width / 2;
    let circleX = circleCoords.x + circleRadius + window.scrollX;
    let circleY = circleCoords.y + circleRadius + window.scrollY;

    function handleWindowResize() {
      circleCoords = circle?.getBoundingClientRect();
      circleRadius = circleCoords.width / 2;
      circleX = circleCoords.x + circleRadius + window.scrollX;
      circleY = circleCoords.y + circleRadius + window.scrollY;
    }

    function handleMouseMove(e: MouseEvent) {
      const currentElement = e.target as HTMLSpanElement;

      const isPointNumber = currentElement.classList.contains('point-number');

      if (isPointNumber) {
        if (
          currentElement !== prevPointNumberRef.current &&
          currentElement !== activePointNumberRef.current
        ) {
          activePointNumberRef.current = currentElement as HTMLSpanElement;
          showPoint({
            point: activePointRef.current as HTMLDivElement,
            pointNumber: activePointNumberRef.current,
          });
        }

        return;
      }

      if (activePointRef.current) {
        changePointZPosition({
          point: activePointRef.current,
          direction: 'down',
        });
      }

      activePointRef.current = null;

      const nearestPointIndex = getNearestPointIndex({
        ax: circleX,
        ay: circleY,
        bx: e.pageX,
        by: e.pageY,
      });

      const actualNearestPointIndex = getActualPointIndex({
        index: nearestPointIndex,
        pointsQuantity: pointsQuantity,
        firstPointNumber: Number(prevPointNumberRef.current?.innerText),
      });

      const actualPoint = ancestorRef.current?.querySelector(
        `.point${actualNearestPointIndex}`,
      ) as HTMLDivElement;

      changePointZPosition({ point: actualPoint, direction: 'up' });

      activePointRef.current = actualPoint;

      if (activePointNumberRef.current !== null) {
        hidePoint({
          point: activePointRef.current as HTMLDivElement,
          pointNumber: activePointNumberRef.current,
        });
        activePointNumberRef.current = null;
      }
    }

    function handleClick() {
      if (
        activePointNumberRef.current !== null &&
        activePointRef.current !== null
      ) {
        const chosenPosition = matrixToDegrees(
          window.getComputedStyle(activePointRef.current).transform,
        );
        const points = ancestorRef.current?.querySelectorAll(
          '.time-intervals__point',
        ) as NodeListOf<Element>;

        rotatePoints({
          chosenPosition: chosenPosition,
          activePointNumber: activePointNumberRef.current,
          prevPoint: prevPointRef.current as HTMLDivElement,
          prevPointNumber: prevPointNumberRef.current as HTMLSpanElement,
          points: points,
          pointsQuantity: points.length,
          duration: rotationDuration,
        });

        prevPointNumberRef.current = activePointNumberRef.current;
        prevPointRef.current = activePointRef.current;
        activePointRef.current = null;
        activePointNumberRef.current = null;

        setTimeout(() => {
          const pointLabel = prevPointRef.current?.querySelector(
            '.point-label',
          ) as HTMLSpanElement;

          showPointLabel({
            label: pointLabel,
          });
        }, rotationDuration * 1000);
      }
    }

    ancestorRef.current?.addEventListener('mousemove', (e) =>
      handleMouseMove(e),
    );
    ancestorRef.current?.addEventListener('click', handleClick);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      ancestorRef.current?.removeEventListener('mousemove', handleMouseMove);
      ancestorRef.current?.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [pointsData.length, rotationDuration]);

  useEffect(() => {
    if (arrowDirection !== null) {
      activePointRef.current = ancestorRef.current?.querySelector(
        `.point${currentPointIndex}`,
      ) as HTMLDivElement;

      activePointNumberRef.current =
        activePointRef.current?.querySelector('.point-number');

      showPoint({
        point: activePointRef.current as HTMLDivElement,
        pointNumber: activePointNumberRef.current as HTMLSpanElement,
      });
      activePointNumberRef.current?.click();

      setTimeout(() => {
        setArrowDirection(null);
      }, rotationDuration * 1000 + 300);
    }
  }, [arrowDirection, currentPointIndex, rotationDuration, setArrowDirection]);

  return (
    <>
      <div className="time-intervals" ref={ancestorRef}>
        <YearsInterval start={start} end={end} />
        {pointsData.map(({ index, label }) => (
          <Point
            key={index}
            index={index}
            label={label}
            bulletClickHandler={() => handleBulletClick(index)}
          />
        ))}
      </div>
    </>
  );
}

export default TimeIntervals;