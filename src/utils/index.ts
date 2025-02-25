function getClockAngle(ax: number, ay: number, bx: number, by: number) {
    const dy = by - ay;
    const dx = bx - ax;
    let theta = Math.atan2(dy, dx);

    theta *= 180 / Math.PI;
    theta += 90;

    if (theta < 0) {
        theta += 360;
    }

    return theta;
}

export function getActualPointIndex({
    index,
    pointsQuantity,
    firstPointNumber,
}: {
    index: number;
    pointsQuantity: number;
    firstPointNumber: number;
}): number {
    const totalPoints = pointsQuantity + 1;

    return index > totalPoints - firstPointNumber
        ? (index + firstPointNumber) % totalPoints
        : index + firstPointNumber - 1;
}

const REFERENCE_ANGLES = [
    { angle: 30, index: 1 },
    { angle: 90, index: 2 },
    { angle: 150, index: 3 },
    { angle: 210, index: 4 },
    { angle: 270, index: 5 },
    { angle: 330, index: 6 },
];

export function getNearestPointIndex(params: {
    ax: number;
    ay: number;
    bx: number;
    by: number;
}): number {
    const angle = getClockAngle(params.ax, params.ay, params.bx, params.by);

    const { index } = REFERENCE_ANGLES.reduce((closest, current) => {
        const currentDiff = Math.abs(((angle - current.angle) + 180) % 360 - 180);
        const closestDiff = Math.abs(((angle - closest.angle) + 180) % 360 - 180);
        return currentDiff < closestDiff ? current : closest;
    }, { angle: 0, index: 0 });

    return index;
}

export function matrixToDegrees(matrix: string): number {
    const [a, b] = matrix.split(/[(),]+/).slice(1, 3).map(Number);
    return (360 + Math.round(Math.atan2(b, a) * 180 / Math.PI)) % 360;
}
