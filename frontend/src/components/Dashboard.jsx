import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Metrics from './Metrics';
import CashFlowChart from './CashFlowChart';
import { Loader2, AlertTriangle, User, TrendingUp } from 'lucide-react';
import ScenarioSimulator from './ScenarioSimulator';

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
                throw new Error('Ensure the company exists and has data.');
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

    const simulateMetrics = async (scenarioParams) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/simulate/${currentCompanyId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scenarioParams)
            });
            if (!res.ok) {
                throw new Error('Ensure the company exists and has data.');
            }
            const data = await res.json();
            setMetrics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <nav className="card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'var(--accent-blue)' }}>A</span>URA FINANCE
                    </h1>
                    <div style={{ display: 'flex', gap: '32px', height: '72px', alignItems: 'flex-end' }}>
                        <a className="nav-link active">Insights</a>
                        <a className="nav-link">Uploads</a>
                        <a className="nav-link">Settings</a>
                    </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <User size={20} color="var(--text-secondary)" />
                </div>
            </nav>

            <div style={{ padding: '40px 40px 0', maxWidth: '1400px', margin: '0 auto', flex: 1, width: '100%' }}>
                {/* Hero Section */}
                <header className="card" style={{ marginBottom: '40px', position: 'relative', overflow: 'hidden', padding: '48px', borderRadius: '24px' }}>
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', background: 'linear-gradient(90deg, transparent, rgba(13, 148, 136, 0.08))', opacity: 1 }}>
                        <div style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.15 }}>
                            <TrendingUp size={280} color="var(--accent)" strokeWidth={1} />
                        </div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
                            Visualize Your Financial Runway.
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.6' }}>
                            Gain real-time insights into your burn rate, cash runway, and 6-month projected flow.
                        </p>
                    </div>
                </header>

                <main style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Left Column - Ingestion */}
                    <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
                        <FileUpload onUploadSuccess={(id) => {
                            setCurrentCompanyId(id);
                            fetchMetrics(id);
                        }} />

                        {error && (
                            <div style={{ background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)', color: '#fff', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}>
                                <AlertTriangle size={24} color="#fff" />
                                <div>
                                    <span style={{ fontWeight: '700', display: 'block', fontSize: '15px' }}>Failed to fetch</span>
                                    <span style={{ fontSize: '14px', opacity: 0.95 }}>{error}</span>
                                </div>
                            </div>
                        )}

                        {metrics?.out_of_cash_alert && (
                            <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                <div style={{ minWidth: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AlertTriangle color="var(--error)" size={24} />
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '18px', fontWeight: '700' }}>Out of Cash Warning</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '15px' }}>Projected run-out date: <span style={{ fontWeight: '700', color: 'var(--error)' }}>{metrics.out_of_cash_date}</span></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Analytics and Simulator */}
                    <div style={{ flex: '2 1 700px', minWidth: '0' }}>
                        {loading && !metrics ? (
                            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', marginBottom: '32px' }}>
                                <Loader2 size={32} className="animate-spin" color="var(--accent)" />
                                <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>Calculating Forecasts...</span>
                            </div>
                        ) : metrics ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <Metrics metrics={metrics} />
                                <CashFlowChart metrics={metrics} />
                                <ScenarioSimulator onSimulate={simulateMetrics} />
                            </div>
                        ) : (
                            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', borderStyle: 'dashed', backgroundColor: 'transparent', boxShadow: 'none' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Upload data to see analytics</span>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <footer style={{ marginTop: '64px', padding: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                Secure data handling by Aura Finance.
            </footer>
        </div>
    );
};

export default Dashboard;
