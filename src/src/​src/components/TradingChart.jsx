import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const TradingChart = () => {
    const chartContainerRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0b0e11' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#1f2937' },
                horzLines: { color: '#1f2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // بيانات تجريبية (Mock Data) للشموع
        const data = [
            { time: '2024-03-10', open: 85.00, high: 87.50, low: 84.00, close: 86.20 },
            { time: '2024-03-11', open: 86.20, high: 88.00, low: 85.50, close: 87.80 },
            { time: '2024-03-12', open: 87.80, high: 89.20, low: 87.00, close: 88.20 },
            { time: '2024-03-13', open: 88.20, high: 88.50, low: 86.00, close: 86.50 },
            { time: '2024-03-14', open: 86.50, high: 87.40, low: 85.20, close: 87.10 },
        ];

        candleSeries.setData(data);
        chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
};

export default TradingChart;
