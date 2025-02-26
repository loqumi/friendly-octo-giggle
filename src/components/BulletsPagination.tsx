import React, { memo, useCallback } from 'react';

interface BulletsPaginationProps {
    currentPointIndex: number;
    pointsLength: number;
    bulletClickHandler: (id: number) => void;
}

const BulletsPagination = memo(({
    currentPointIndex,
    pointsLength,
    bulletClickHandler: handleBulletClick,
}: BulletsPaginationProps) => {
    const createBullet = useCallback((index: number) => (
        <span
            key={index}
            role="tab"
            aria-label={`Go to point ${index}`}
            aria-selected={index === currentPointIndex}
            className={`historical-dates__bullets-pagination__bullet ${
                index === currentPointIndex ?
                    'historical-dates__bullets-pagination__bullet_active' : ''
            }`}
            onClick={() => handleBulletClick(index)}
        ></span>
    ), [currentPointIndex, handleBulletClick]);

    return (
        <div
            className="historical-dates__bullets-pagination"
            role="tablist"
        >
            {Array.from({ length: pointsLength }, (_, i) => createBullet(i + 1))}
        </div>
    );
});

export default BulletsPagination;