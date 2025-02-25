import React from 'react';

type Data = {
    label: string;
    yearsInterval: {
        start: number;
        end: number;
    };
    details: {
        year: number;
        description: string;
    }[];
}[];

interface HistoricalDatesProps {
    data: Data;
}

function HistoricalDates({ data }: HistoricalDatesProps) {
    console.log(data);
    return (
        <>
            <div>
                Исторические даты
            </div>
        </>
    );
}

export default HistoricalDates;
