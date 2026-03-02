import React from 'react';
import { DollarSign, Activity, TrendingDown } from 'lucide-react';

const Card = ({ title, value, subtitle, icon: Icon, color }) => (
    <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', flex: 1, minWidth: '250px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            <div style={{ padding: '8px', backgroundColor: `rgba(${color}, 0.1)`, borderRadius: '8px', color: `rgb(${color})` }}>
                <Icon size={20} />
            </div>
        </div>
        <div style={{ marginBottom: '8px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{value}</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{subtitle}</p>
    </div>
);

const Metrics = ({ metrics }) => {
    if (!metrics) return null;

    const { current_balance, average_monthly_burn, runway_months, runway_days } = metrics;

    return (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Card
                title="Current Balance"
                value={`$${current_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                subtitle="Up to date cash on hand"
                icon={DollarSign}
                color="16, 185, 129" // Emerald-500
            />
            <Card
                title="Avg. Monthly Burn"
                value={`$${average_monthly_burn.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                subtitle="Calculated over historical data"
                icon={TrendingDown}
                color="239, 68, 68" // Red-500
            />
            <Card
                title="Cash Runway"
                value={`${runway_months} months ${runway_days ? `, ${runway_days} days` : ''}`}
                subtitle="Estimated lifespan based on burn"
                icon={Activity}
                color="59, 130, 246" // Blue-500
            />
        </div>
    );
};

export default Metrics;
