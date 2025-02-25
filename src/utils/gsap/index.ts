import gsap from 'gsap';
import { matrixToDegrees } from '../index';

const ROTATION = {
    INITIAL_OFFSET: 30,
    FULL_CIRCLE: 360,
    SPECIAL_CASE: 210,
    SHORTEST_PATH: 'short',
    DIRECTIONS: {
        CLOCKWISE: 'cw',
        COUNTER_CLOCKWISE: 'ccw'
    }
} as const;

interface RotationParams {
    chosenPosition: number;
    activePointNumber: HTMLElement;
    prevPoint: HTMLDivElement;
    prevPointNumber: HTMLElement;
    points: NodeListOf<Element>;
    pointsQuantity: number;
    duration?: number;
}

export function changePointZPosition({
    point,
    direction,
}: {
    point: HTMLDivElement | string;
    direction: 'up' | 'down';
}) {
    gsap.set(point, { zIndex: direction === 'up' ? 3 : 2 });
}

export function hidePoint({
    point,
    pointNumber,
    duration = 0.2,
}: {
    point: HTMLDivElement | string;
    pointNumber: HTMLElement | string;
    duration?: number;
}) {
    const animConfig = {
        duration,
        ease: 'power1.in',
    };

    gsap.set(point, { zIndex: 2 });
    gsap.set(pointNumber, { backgroundColor: '#42567b' });

    gsap.to(point, {
        ...animConfig,
        top: '-3.3%',
        left: '-3.3%',
        width: '106.6%',
        height: '106.6%',
    });

    gsap.to(pointNumber, {
        ...animConfig,
        width: 9,
        height: 9,
    });
}

export function hidePointLabel(label: HTMLElement | string) {
    gsap.set(label, { opacity: 0 });
}

export function showPoint({
    point,
    pointNumber,
    duration = 0,
    animate = true,
}: {
    point: HTMLDivElement | string;
    pointNumber: HTMLElement | string;
    duration?: number;
    animate?: boolean;
}) {
    const animConfig = {
        duration,
        ease: "power1.out" as const,
    };

    const pointAnimProps = {
        top: '-5%',
        left: '-5%',
        width: '110%',
        height: '110%',
    };

    const pointNumberAnimProps = {
        width: 56,
        height: 56,
    };

    if (animate) {
        gsap.to(point, { ...pointAnimProps, ...animConfig });
        gsap.to(pointNumber, { ...pointNumberAnimProps, ...animConfig });
        gsap.set(pointNumber, {
            backgroundColor: '#f5f6fa',
            cursor: 'pointer',
        });
    } else {
        gsap.set(point, { ...pointAnimProps, zIndex: 3 });
        gsap.set(pointNumber, {
            ...pointNumberAnimProps,
            backgroundColor: '#f5f6fa',
        });
    }
}

export function showPointLabel({
    label,
    duration = 0.3,
    animate = true,
}: {
    label: HTMLElement | string;
    duration?: number;
    animate?: boolean;
}) {
    const action = animate ? gsap.to : gsap.set;
    const config = { opacity: 1, ...(animate && { duration, ease: 'power1.out' }) };

    action(label, config);
}

export function rotatePoints({
    chosenPosition,
    activePointNumber,
    prevPoint,
    prevPointNumber,
    points,
    pointsQuantity,
    duration = 1,
}: RotationParams) {
    const { rotationDegrees, numberRotationDirection } = calculateRotation(chosenPosition);
    const pointRotationDirection = chosenPosition === ROTATION.SPECIAL_CASE
        ? ROTATION.DIRECTIONS.CLOCKWISE
        : ROTATION.SHORTEST_PATH;

    gsap.set(activePointNumber, { cursor: 'auto' });

    hidePoint({ point: prevPoint, pointNumber: prevPointNumber });
    hidePointLabel(prevPoint.querySelector('.point-label') as HTMLElement);

    const timeline = gsap.timeline();

    Array.from(points).slice(0, pointsQuantity).forEach(point => {
        const element = point as HTMLDivElement;
        const position = matrixToDegrees(window.getComputedStyle(element).transform);
        const newPosition = (position + rotationDegrees) % ROTATION.FULL_CIRCLE;

        changePointZPosition({ point: element, direction: 'down' });

        timeline.to(element, {
            duration,
            rotate: `${newPosition}_${pointRotationDirection}`,
            ease: 'power1.out'
        }, 0);

        const pointNumber = element.querySelector('.point-number');
        if (pointNumber) {
            timeline.to(pointNumber, {
                duration,
                rotate: `${-newPosition}_${numberRotationDirection}`,
                pointerEvents: 'none'
            }, 0);
        }
    });

    timeline.set('.point-number', {
        clearProps: 'pointerEvents'
    }, duration);
}

function calculateRotation(chosenPosition: number) {
    const isClockwise = chosenPosition < 180;

    return {
        rotationDegrees: isClockwise
            ? ROTATION.INITIAL_OFFSET - chosenPosition
            : ROTATION.FULL_CIRCLE + ROTATION.INITIAL_OFFSET - chosenPosition,
        numberRotationDirection: isClockwise
            ? ROTATION.DIRECTIONS.CLOCKWISE
            : ROTATION.DIRECTIONS.COUNTER_CLOCKWISE
    };
}