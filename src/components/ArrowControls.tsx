import React, { MouseEvent } from 'react';
import {ArrowDirection} from "../types";

interface ArrowControlsProps {
  currentPointIndex: number;
  pointsLength: number;
  arrowDirection: ArrowDirection;
  controlClickHandler: (e: MouseEvent, id: number) => void;
}

function ArrowControls({
    currentPointIndex,
    pointsLength,
    arrowDirection,
    controlClickHandler: handleControlClick,
}: ArrowControlsProps) {
  return (
    <div className="arrow-controls">
      <div
        className={`arrow-controls__arrow-left ${
          (currentPointIndex === 1 || arrowDirection !== null) &&
          'arrow-controls__arrow-left_disabled'
        }`}
        onClick={(e) => handleControlClick(e, -1)}
      ></div>
      <div
        className={`arrow-controls__arrow-right ${
          (currentPointIndex === pointsLength ||
              arrowDirection !== null) &&
          'arrow-controls__arrow-right_disabled'
        }`}
        onClick={(e) => handleControlClick(e, 1)}
      ></div>
    </div>
  );
}

export default ArrowControls;
