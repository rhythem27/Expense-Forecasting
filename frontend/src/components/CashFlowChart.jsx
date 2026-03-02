import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CashFlowChart = ({ metrics }) => {
    if (!metrics || !metrics.historical) return null;

    // Format the data array for Recharts combining historical and forecasted elements
    const { historical, forecast } = metrics;

    // To make a continuous line chart, Recharts works best with a single timeline array
    const combinedData = [];

    // Push historical
    historical.forEach(row => {
        combinedData.push({
            month: row.month,
            Historical: row.historical_expense,
            Forecast: null // Null value ensures the forecast line doesn't draw here
        });
    });

    // If we want a connection, we map the last historical point to start the forecast logic
    if (historical.length > 0) {
        const lastIdx = combinedData.length - 1;
        combinedData[lastIdx].Forecast = combinedData[lastIdx].Historical;
    }

    // Push forecasted
    forecast.forEach(row => {
        combinedData.push({
            month: row.month,
            Historical: null,
            Forecast: row.predicted_expense
        });
    });

    return (
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', height: '400px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Cash Flow Breakdown & Forecast</h3>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={combinedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F9FAFB' }}
                        itemStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        type="monotone"
                        dataKey="Historical"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorHistorical)"
                        connectNulls={true}
                    />
                    <Area
                        type="monotone"
                        dataKey="Forecast"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorForecast)"
                        strokeDasharray="5 5"
                        connectNulls={true}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CashFlowChart;
