import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';

const ScenarioSimulator = ({ onSimulate }) => {
    const [marketingIncrease, setMarketingIncrease] = useState(0);
    const [newEmployeeCost, setNewEmployeeCost] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSimulate({
            marketing_increase_pct: Number(marketingIncrease),
            new_employee_cost: Number(newEmployeeCost)
        });
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Settings2 size={24} color="var(--accent)" />
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>'What If?' Scenarios</h2>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Increase Marketing Spend (%)
                    </label>
                    <input
                        type="number"
                        value={marketingIncrease}
                        onChange={(e) => setMarketingIncrease(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'white', boxSizing: 'border-box' }}
                        min="0"
                    />
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Hire New Employee ($/month)
                    </label>
                    <input
                        type="number"
                        value={newEmployeeCost}
                        onChange={(e) => setNewEmployeeCost(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'white', boxSizing: 'border-box' }}
                        min="0"
                    />
                </div>
                <button
                    type="submit"
                    style={{ padding: '0 24px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', height: '43px', transition: 'opacity 0.2s', '&:hover': { opacity: 0.9 } }}
                >
                    Run Simulation
                </button>
            </form>
        </div>
    );
};

export default ScenarioSimulator;
