
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../../state/analysis.store';
import { useSTPStore } from '../../../state/stp.store';
import { ArrowRight, ArrowLeft, Target, Users, Megaphone } from 'lucide-react';
import './STPScreen.css';

export function STPScreen() {
  const analysisState = useAnalysisStore();
  const stpState = useSTPStore();
  const navigate = useNavigate();

  const numClusters = analysisState.clusteringResult?.clusterCenters.length || 0;
  const clusters = Array.from({ length: numClusters }, (_, i) => i);

  if (numClusters === 0) {
    return (
      <div className="empty-state">
        <h2>No Clusters Found</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/cluster')}>Go to Clustering</button>
      </div>
    );
  }

  const getSegmentName = (id: number) => stpState.segmentNames[id] || `Segment ${id}`;

  return (
    <div className="stp-screen">
      <div className="screen-header flex-between">
        <div>
          <h2>STP Framework</h2>
          <p>Translate your statistical clusters into an actionable business strategy.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/understand')}>
             <ArrowLeft size={16} /> Back to Interpretation
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/report')}
            disabled={stpState.targetClusterId === null || stpState.positioningStatement.trim() === ''}
          >
            Generate Report <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="stp-layout">
        
        {/* Step 1: Segmentation (Naming) */}
        <div className="stp-section card">
          <div className="section-header">
            <div className="icon-wrapper bg-blue">
              <Users size={20} />
            </div>
            <div>
              <h3>1. Segmentation</h3>
              <p>Give your clusters human-readable names based on their profiles.</p>
            </div>
          </div>
          
          <div className="naming-list">
            {clusters.map(id => (
              <div key={id} className="naming-item">
                <label>Cluster {id}</label>
                <input 
                  type="text"
                  placeholder={`e.g., Budget Shoppers`}
                  value={stpState.segmentNames[id] || ''}
                  onChange={(e) => stpState.setSegmentName(id, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Targeting */}
        <div className="stp-section card">
          <div className="section-header">
            <div className="icon-wrapper bg-orange">
              <Target size={20} />
            </div>
            <div>
              <h3>2. Targeting</h3>
              <p>Select one primary segment as your target audience.</p>
            </div>
          </div>
          
          <div className="targeting-grid">
            {clusters.map(id => {
              const isSelected = stpState.targetClusterId === id;
              return (
                <div 
                  key={id}
                  className={`target-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => stpState.setTargetClusterId(id)}
                >
                  <div className="radio-circle">
                    {isSelected && <div className="radio-inner" />}
                  </div>
                  <span className="target-name">{getSegmentName(id)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Positioning */}
        <div className="stp-section card">
          <div className="section-header">
            <div className="icon-wrapper bg-green">
              <Megaphone size={20} />
            </div>
            <div>
              <h3>3. Positioning</h3>
              <p>Draft a positioning statement for your selected target.</p>
            </div>
          </div>
          
          <div className="positioning-content">
            {stpState.targetClusterId === null ? (
              <div className="hint-box">
                Please select a target segment above first.
              </div>
            ) : (
              <>
                <p className="target-reminder">
                  Drafting strategy for: <strong>{getSegmentName(stpState.targetClusterId)}</strong>
                </p>
                <textarea 
                  className="form-textarea"
                  placeholder="For [Target Audience], who [Need/Want], our product is a [Category] that provides [Benefit]..."
                  value={stpState.positioningStatement}
                  onChange={(e) => stpState.setPositioningStatement(e.target.value)}
                  rows={5}
                />
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
