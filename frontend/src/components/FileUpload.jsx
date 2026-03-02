import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [companyId, setCompanyId] = useState('123e4567-e89b-12d3-a456-426614174000'); // Example UUID for testing
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
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Ingest Expenses Data</h3>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="Company ID (UUID)"
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '300px' }}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px', border: '1px dashed var(--accent)', cursor: 'pointer', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
                    <UploadCloud size={18} />
                    {file ? file.name : "Select CSV File"}
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                </label>

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: 'var(--accent)', color: '#fff', fontWeight: '600', opacity: uploading ? 0.7 : 1 }}
                >
                    {uploading ? 'Processing...' : 'Upload Data'}
                </button>
            </div>

            {status && (
                <div style={{
                    marginTop: '16px', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status === 'success' ? 'var(--success)' : '#EF4444'
                }}>
                    {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
