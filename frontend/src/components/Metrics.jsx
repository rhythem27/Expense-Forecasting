import React from 'react';
import { DollarSign, Activity, TrendingDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const Card = ({ title, value, subtitle, icon: Icon, color, children }) => (
    <div className="card" style={{ padding: '24px', flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{title}</p>
                <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</h2>
            </div>
            {Icon && (
                <div style={{ padding: '10px', backgroundColor: color ? `rgba(${color}, 0.1)` : 'var(--bg-primary)', borderRadius: '10px', color: color ? `rgb(${color})` : 'var(--text-secondary)' }}>
                    <Icon size={20} />
                </div>
            )}
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '16px', height: '60px', width: '100%' }}>
            {children}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>{subtitle}</p>
    </div>
);

const Metrics = ({ metrics }) => {
    if (!metrics) return null;

    const { average_monthly_burn, runway_months, runway_days, historical, forecast, current_balance } = metrics;

    // Safety checks for chart data
    const historicalData = historical && historical.length > 0 ? historical.slice(-6) : [{ historical_expense: average_monthly_burn }];
    const forecastData = forecast && forecast.length > 0 ? forecast : [{ predicted_expense: 0 }, { predicted_expense: 0 }];

    // Runway progress calculation (cap at 24 months for visual scale)
    const MAX_RUNWAY_MONTHS = 24;
    const isInfinite = typeof runway_months === 'string';
    const runwayValue = isInfinite ? MAX_RUNWAY_MONTHS : Math.min(runway_months, MAX_RUNWAY_MONTHS);
    const progressPct = (runwayValue / MAX_RUNWAY_MONTHS) * 100;

    // Determine runaway color: Red if < 3 months, Orange if < 6, Green otherwise
    let progressColor = 'var(--success)';
    if (!isInfinite) {
        if (runway_months < 3) progressColor = 'var(--error)';
        else if (runway_months < 6) progressColor = '#F59E0B'; // Amber
    }

    return (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Card
                title="Current Monthly Burn Rate"
                value={`$${average_monthly_burn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                subtitle="Based on recent historical data"
                icon={TrendingDown}
                color="239, 68, 68" // Red
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
                        <Bar dataKey="historical_expense" fill="var(--error)" opacity={0.8} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card
                title="Projected Cash Runway"
                value={isInfinite ? "Infinite" : `${runway_months}m ${runway_days}d`}
                subtitle={`Current Cash: $${current_balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                icon={Activity}
                color="13, 148, 136" // Teal
            >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                        <span>Remaining</span>
                        <span>{isInfinite ? '> 24 months' : `${runway_months} months target`}</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: progressColor, borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
                    </div>
                </div>
            </Card>

            <Card
                title="6-Month Cash Flow"
                value="Projection"
                subtitle="SMA forecasting model"
                icon={DollarSign}
                color="16, 185, 129" // Emerald
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line type="monotone" dataKey="predicted_expense" stroke="var(--accent)" strokeWidth={3} dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default Metrics;
