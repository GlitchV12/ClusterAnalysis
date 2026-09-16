
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { UploadDropzone } from './UploadDropzone';
import { FileSpreadsheet, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Hash, Type, LayoutList, Key } from 'lucide-react';
import type { VariableType } from '../../../types/dataset';
import './DataScreen.css';

const getTypeIcon = (type: VariableType) => {
  switch (type) {
    case 'numeric': return <Hash size={16} />;
    case 'text': return <Type size={16} />;
    case 'categorical': return <LayoutList size={16} />;
    case 'identifier': return <Key size={16} />;
    default: return <Type size={16} />;
  }
};

const getTypeLabel = (type: VariableType) => {
  switch (type) {
    case 'numeric': return 'Numeric';
    case 'text': return 'Text';
    case 'categorical': return 'Categorical';
    case 'identifier': return 'Identifier';
    default: return 'Unknown';
  }
};

export function DataScreen() {
  const { dataset, quality, resetDataset } = useDatasetStore();
  const navigate = useNavigate();

  if (!dataset || !quality) {
    return (
      <div className="data-screen">
        <div className="screen-header">
          <h2>Data Ingestion</h2>
          <p>Upload your tabular data to begin the clustering analysis.</p>
        </div>
        <UploadDropzone />
      </div>
    );
  }

  // const hasIssues = quality.totalMissingPercent > 0 || quality.duplicateRowsPercent > 0;

  return (
    <div className="data-screen">
      <div className="screen-header flex-between">
        <div>
          <h2>Data Quality Overview</h2>
          <p>Review the profiling results before proceeding to preparation.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={resetDataset}>
            Change Dataset
          </button>
          <button className="btn-primary" onClick={() => navigate('/prepare')}>
            Proceed to Prepare <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="profiling-dashboard">
        
        {/* Top Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FileSpreadsheet size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Dataset</span>
              <h3 className="stat-value">{dataset.fileName}</h3>
              <p className="stat-subtext">{dataset.rowCount.toLocaleString()} rows, {dataset.colCount} columns</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className={`stat-icon ${quality.totalMissingPercent > 0 ? 'warning' : 'success'}`}>
              {quality.totalMissingPercent > 0 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="stat-content">
              <span className="stat-label">Missing Values</span>
              <h3 className="stat-value">{quality.totalMissingPercent.toFixed(1)}%</h3>
              <p className="stat-subtext">Across all cells</p>
            </div>
          </div>

          <div className="stat-card">
            <div className={`stat-icon ${quality.duplicateRowsPercent > 0 ? 'warning' : 'success'}`}>
              {quality.duplicateRowsPercent > 0 ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="stat-content">
              <span className="stat-label">Duplicate Rows</span>
              <h3 className="stat-value">{quality.duplicateRowsPercent.toFixed(1)}%</h3>
              <p className="stat-subtext">Exact row matches</p>
            </div>
          </div>
        </div>

        {/* Variables Table */}
        <div className="variables-section">
          <div className="section-header">
            <h3>Variables Profiling</h3>
            <p>Automatically detected types and quality metrics per column.</p>
          </div>

          <div className="table-container">
            <table className="variables-table">
              <thead>
                <tr>
                  <th>Variable Name</th>
                  <th>Detected Type</th>
                  <th>Missing</th>
                  <th>Unique</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dataset.columns.map(col => {
                  const isIdentifier = col.detectedType === 'identifier';
                  const hasMissing = col.missingCount > 0;
                  
                  return (
                    <tr key={col.id}>
                      <td className="col-name-cell">
                        <span className="col-name">{col.name}</span>
                      </td>
                      <td>
                        <div className={`type-badge type-${col.detectedType}`}>
                          {getTypeIcon(col.detectedType)}
                          {getTypeLabel(col.detectedType)}
                        </div>
                      </td>
                      <td>
                        <span className={hasMissing ? 'text-warning font-medium' : 'text-muted'}>
                          {col.missingCount > 0 
                            ? `${col.missingCount} (${((col.missingCount/dataset.rowCount)*100).toFixed(1)}%)` 
                            : 'None'}
                        </span>
                      </td>
                      <td>{col.uniqueCount.toLocaleString()}</td>
                      <td>
                        {isIdentifier ? (
                          <span className="status-badge warning"><AlertTriangle size={14}/> ID Column</span>
                        ) : hasMissing ? (
                          <span className="status-badge warning"><AlertTriangle size={14}/> Missing Data</span>
                        ) : (
                          <span className="status-badge success"><CheckCircle2 size={14}/> OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
