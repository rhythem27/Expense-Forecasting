import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Metrics from './Metrics';
import CashFlowChart from './CashFlowChart';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Default UUID for demo purposes, you might want to fetch this dynamically based on auth
    const [currentCompanyId, setCurrentCompanyId] = useState('123e4567-e89b-12d3-a456-426614174000');

    const fetchMetrics = async (companyId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/forecast/${companyId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch metrics data. Ensure the company exists and has data.');
            }
            const data = await res.json();
            setMetrics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initially try loading metrics for the default company ID
    useEffect(() => {
        fetchMetrics(currentCompanyId);
    }, [currentCompanyId]);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>
                        Expense Forecast
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                        Gain real-time insights into your burn rate, cash runway, and 6-month projected flow.
                    </p>
                </div>
            </header>

            <main>
                <FileUpload onUploadSuccess={(id) => {
                    setCurrentCompanyId(id);
                    fetchMetrics(id);
                }} />

                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px' }}>
                        <Loader2 size={32} className="animate-spin" color="var(--accent)" />
                        <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>Calculating Forecasts...</span>
                    </div>
                ) : error ? (
                    <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', border: '1px solid #EF4444' }}>
                        {error}
                    </div>
                ) : metrics ? (
                    <>
                        <Metrics metrics={metrics} />
                        <CashFlowChart metrics={metrics} />
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default Dashboard;
