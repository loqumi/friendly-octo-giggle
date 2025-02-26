import React, { MouseEvent } from 'react';
import {ArrowDirection} from "../types";

interface ArrowControlsProps {
  currentPointIndex: number;
  pointsLength: number;
  arrowDirection: ArrowDirection;
  controlClickHandler: (e: MouseEvent, id: number) => void;
}

function ArrowControls({
    controlClickHandler: handleControlClick,
}: ArrowControlsProps) {
  return (
    <div className="arrow-controls">
      <div
        className={"arrow-controls__arrow-left"}
        onClick={(e) => handleControlClick(e, -1)}
      ></div>
      <div
        className={"arrow-controls__arrow-right"}
        onClick={(e) => handleControlClick(e, 1)}
      ></div>
    </div>
  );
}

export default ArrowControls;