import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { usePrepareStore, type ImputationStrategy, type ScalingStrategy, type OutlierStrategy } from '../../../state/prepare.store';
import { ArrowRight, AlertTriangle, Settings2, Database, ArrowLeft } from 'lucide-react';
import './PrepareScreen.css';

export function PrepareScreen() {
  const { dataset } = useDatasetStore();
  const prepareState = usePrepareStore();
  const navigate = useNavigate();

  // Auto-select valid features on first load if none are selected
  useEffect(() => {
    if (dataset && prepareState.selectedFeatures.length === 0) {
      const initialFeatures = dataset.columns
        .filter(col => col.detectedType !== 'identifier' && col.detectedType !== 'text')
        .map(col => col.id);
      
      if (initialFeatures.length > 0) {
        prepareState.setAllFeatures(initialFeatures);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

  if (!dataset) {
    return (
      <div className="prepare-screen empty-state">
        <div className="empty-content">
          <AlertTriangle size={48} className="text-warning" />
          <h2>No Dataset Loaded</h2>
          <p>Please upload a dataset on the Data Ingestion screen first.</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/data')}>
            Go to Data Ingestion
          </button>
        </div>
      </div>
    );
  }

  const handleRunClustering = () => {
    // Transition to Phase 4 (Clustering)
    navigate('/cluster');
  };

  return (
    <div className="prepare-screen">
      <div className="screen-header flex-between">
        <div>
          <h2>Data Preparation</h2>
          <p>Select features and configure preprocessing before clustering.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/data')}>
             <ArrowLeft size={16} /> Back to Profiling
          </button>
          <button 
            className="btn-primary" 
            onClick={handleRunClustering}
            disabled={prepareState.selectedFeatures.length === 0}
          >
            Run Clustering <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="prepare-layout">
        
        {/* Left Pane: Feature Selection */}
        <div className="config-pane feature-selection-pane">
          <div className="pane-header">
            <Database size={20} className="pane-icon" />
            <h3>Feature Selection</h3>
          </div>
          <p className="pane-desc">
            Select the variables to include in the clustering model. Identifiers are excluded by default.
          </p>
          
          <div className="feature-list">
            {dataset.columns.map(col => {
              const isSelected = prepareState.selectedFeatures.includes(col.id);
              const isRecommended = col.detectedType === 'numeric' || (col.detectedType === 'categorical' && col.uniqueCount <= 10);
              const isIdentifier = col.detectedType === 'identifier';
              const isOHE = col.detectedType === 'categorical' && col.uniqueCount <= 10;
              const isTooManyCategories = col.detectedType === 'categorical' && col.uniqueCount > 10;
              
              return (
                <div 
                  key={col.id} 
                  className={`feature-item ${isSelected ? 'selected' : ''} ${isIdentifier ? 'disabled-hint' : ''}`}
                  onClick={() => prepareState.toggleFeature(col.id)}
                >
                  <div className="feature-checkbox">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                    />
                  </div>
                  <div className="feature-info">
                    <span className="feature-name">{col.name}</span>
                    <span className="feature-meta">
                      {col.detectedType} • {col.missingCount > 0 ? `${col.missingCount} missing` : 'Complete'}
                      {isOHE && ' • Will be One-Hot Encoded'}
                    </span>
                  </div>
                  {!isRecommended && !isSelected && (
                    <span className="warning-badge" title={isTooManyCategories ? "Too many categories (>10), not recommended." : "Not recommended for clustering"}>
                      <AlertTriangle size={14} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Preprocessing Configuration */}
        <div className="config-pane preprocessing-pane">
          <div className="pane-header">
            <Settings2 size={20} className="pane-icon" />
            <h3>Preprocessing</h3>
          </div>
          <p className="pane-desc">
            Configure how to handle missing data and scale the variables.
          </p>
          
          <div className="form-group">
            <label>Missing Value Imputation</label>
            <p className="help-text">How should we handle rows with missing data?</p>
            <select 
              value={prepareState.imputationStrategy}
              onChange={(e) => prepareState.setImputationStrategy(e.target.value as ImputationStrategy)}
              className="form-select"
            >
              <option value="drop">Drop rows with missing values</option>
              <option value="mean">Impute with Mean / Mode</option>
              <option value="zero">Fill with Zeros</option>
            </select>
          </div>

          <div className="form-group">
            <label>Feature Scaling</label>
            <p className="help-text">Distance-based algorithms (like K-Means) require scaled data.</p>
            <select 
              value={prepareState.scalingStrategy}
              onChange={(e) => prepareState.setScalingStrategy(e.target.value as ScalingStrategy)}
              className="form-select"
            >
              <option value="standard">Standardization (Z-Score)</option>
              <option value="minmax">Min-Max Scaling (0 to 1)</option>
              <option value="none">No Scaling (Not Recommended)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Outlier Removal</label>
            <p className="help-text">Remove extreme values that can skew K-Means centroids.</p>
            <select 
              value={prepareState.outlierStrategy}
              onChange={(e) => prepareState.setOutlierStrategy(e.target.value as OutlierStrategy)}
              className="form-select"
            >
              <option value="none">Keep All Data (None)</option>
              <option value="zscore">Remove Extreme Outliers (Z-Score &gt; 3)</option>
            </select>
          </div>

          <div className="form-group toggle-group">
            <div className="toggle-info">
              <label>Dimensionality Reduction (PCA)</label>
              <p className="help-text">Reduce features to principal components to remove noise.</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={prepareState.usePCA}
                onChange={(e) => prepareState.setUsePCA(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

        </div>

      </div>
    </div>
  );
}
