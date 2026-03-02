import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [companyId, setCompanyId] = useState('123e4567-e89b-12d3-a456-426614174000'); // Example UUID for testing
    const [fileReference, setFileReference] = useState('');
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' or 'error'
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('error');
            setMessage('Please select a CSV file first.');
            return;
        }

        setUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('company_id', companyId);

        try {
            const res = await fetch('http://localhost:8000/upload-expenses/', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(`Successfully uploaded! Inserted ${data.details.inserted_count} records.`);
                onUploadSuccess(companyId);
            } else {
                setStatus('error');
                setMessage(data.detail || 'Upload failed due to server error.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to connect to the backend server.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Ingest Expenses Data</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Key-Value Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>{companyId}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* CSV Upload Component */}
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', borderRadius: '12px', border: '2px dashed var(--border)', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <UploadCloud size={24} color="var(--accent-blue)" />
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>
                            Select CSV File
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ padding: '8px 16px', backgroundColor: 'var(--accent-blue)', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>Browse</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{file ? file.name : 'No file chosen'}</span>
                        </div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Click to browse or drag and drop</span>
                        <input type="file" accept=".csv" onChange={handleFileChange} />
                    </label>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>File Reference (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Q4_Expenses_2025"
                                value={fileReference}
                                onChange={(e) => setFileReference(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: 'var(--text-primary)', color: '#fff', fontWeight: '600', opacity: uploading ? 0.7 : 1, width: '100%', border: 'none', cursor: 'pointer', marginTop: '8px' }}
                        >
                            {uploading ? 'Processing...' : 'Ingest Data'}
                        </button>
                    </div>
                </div>
            </div>

            {status && (
                <div style={{
                    marginTop: '24px', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: status === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    color: status === 'success' ? 'var(--success)' : 'var(--error)'
                }}>
                    {status === 'success' ? <CheckCircle2 size={20} color="var(--success)" /> : <AlertCircle size={20} color="var(--error)" />}
                    <span style={{ fontWeight: '500' }}>{message}</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
