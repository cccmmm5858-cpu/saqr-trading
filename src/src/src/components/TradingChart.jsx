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
            timeScale: {
                borderColor: '#485c7b',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // بيانات تجريبية (Mock Data) لشموع السوق السعودي
        const data = [
            { time: '2024-03-10', open: 85.00, high: 87.50, low: 84.00, close: 86.20 },
            { time: '2024-03-11', open: 86.20, high: 88.00, low: 85.50, close: 87.80 },
            { time: '2024-03-12', open: 87.80, high: 89.20, low: 87.00, close: 88.20 },
            { time: '2024-03-13', open: 88.20, high: 88.50, low: 86.00, close: 86.50 },
            { time: '2024-03-14', open: 86.50, high: 87.40, low: 85.20, close: 87.10 },
            { time: '2024-03-15', open: 87.10, high: 88.80, low: 86.80, close: 88.50 },
            { time: '2024-03-16', open: 88.50, high: 89.50, low: 88.00, close: 89.10 },
            { time: '2024-03-17', open: 89.10, high: 90.00, low: 88.50, close: 89.80 },
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none">
                <span className="text-8xl font-bold text-white tracking-widest">SAQR</span>
            </div>
        </div>
    );
};

export default TradingChart;
