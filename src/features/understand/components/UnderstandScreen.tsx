import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { usePrepareStore } from '../../../state/prepare.store';
import { useAnalysisStore } from '../../../state/analysis.store';
import { InterpretationService } from '../services/interpretation.service';
import ReactECharts from 'echarts-for-react';
import { ArrowRight, ArrowLeft, Maximize2, X } from 'lucide-react';
import './UnderstandScreen.css';

import { useUnderstandStore } from '../../../state/understand.store';
import { useUnderstandCharts, CLUSTER_COLORS } from '../hooks/useUnderstandCharts';

export function UnderstandScreen() {
  const { dataset } = useDatasetStore();
  const prepareState = usePrepareStore();
  const analysisState = useAnalysisStore();
  const navigate = useNavigate();

  const understandState = useUnderstandStore();
  
  const {
    xFeature, setXFeature,
    yFeature, setYFeature,
    projectionMode, setProjectionMode,
    swapPCA, setSwapPCA,
    rotation, setRotation,
    selectedRadarFeatures, setSelectedRadarFeatures
  } = understandState;

  const [expandedPanel, setExpandedPanel] = useState<'profiles' | 'distribution' | null>(null);
  const [isRadarFilterOpen, setIsRadarFilterOpen] = useState(false);

  const {
    profiles,
    featureNames,
    radarChartOption,
    scatterChartOption
  } = useUnderstandCharts();

  const renderRadarFilters = () => (
    <div style={{ position: 'relative', zIndex: 10 }}>
      <button 
        className="btn-secondary btn-sm"
        onClick={() => setIsRadarFilterOpen(!isRadarFilterOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}
      >
        Filter Variables ({selectedRadarFeatures.length}/{featureNames.length})
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      
      {isRadarFilterOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
            onClick={() => setIsRadarFilterOpen(false)} 
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '8px',
            backgroundColor: 'var(--color-surface, #fff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: 'var(--radius-md, 6px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px',
            zIndex: 20,
            minWidth: '220px',
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase' }}>Select Variables</span>
              <button 
                onClick={() => setSelectedRadarFeatures(featureNames)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-600, #2563eb)', fontSize: '12px', cursor: 'pointer', padding: 0 }}
              >
                Reset All
              </button>
            </div>
            {featureNames.map(f => {
              const isSelected = selectedRadarFeatures.includes(f);
              return (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary, #111827)' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedRadarFeatures(prev => 
                        prev.includes(f) 
                          ? prev.filter(x => x !== f) 
                          : [...prev, f]
                      );
                    }}
                    style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--color-primary-600, #2563eb)' }}
                  />
                  {f}
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  // Size Chart Option (kept local as it doesn't need to be shared)
  const sizeChartOption = useMemo(() => {
    if (!profiles) return {};
    return {
      tooltip: { trigger: 'item' },
      grid: { left: '5%', right: '5%', bottom: '15%', top: '10%' },
      xAxis: {
        type: 'category',
        data: profiles.map(p => `Cluster ${p.id}`),
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: { show: false },
      series: [
        {
          type: 'bar',
          data: profiles.map((p, i) => ({
            value: p.size,
            itemStyle: { color: CLUSTER_COLORS[i % CLUSTER_COLORS.length], borderRadius: [4, 4, 0, 0] }
          })),
          barWidth: '60%',
          label: { show: true, position: 'top', formatter: '{c}' }
        }
      ]
    };
  }, [profiles]);

  React.useEffect(() => {
    if (featureNames.length > 0) {
      if (!featureNames.includes(xFeature)) setXFeature(featureNames[0]);
      if (!featureNames.includes(yFeature)) setYFeature(featureNames[1] || featureNames[0]);
    }
  }, [featureNames, xFeature, yFeature, setXFeature, setYFeature]);

  React.useEffect(() => {
    if (selectedRadarFeatures.length === 0 || !selectedRadarFeatures.every(f => featureNames.includes(f))) {
      setSelectedRadarFeatures(featureNames);
    }
  }, [featureNames, selectedRadarFeatures.length, setSelectedRadarFeatures]);


  if (!dataset || !analysisState.clusteringResult) {
    return (
      <div className="empty-state">
        <h2>No Clustering Data Found</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/cluster')}>Go to Clustering</button>
      </div>
    );
  }

  return (
    <div className="understand-screen">
      <div className="screen-header flex-between">
        <div>
          <h2>Cluster Interpretation</h2>
          <p>Analyze the characteristics and average traits of your segmented groups.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/cluster')}>
             <ArrowLeft size={16} /> Back to Clustering
          </button>
          <button className="btn-primary" onClick={() => navigate('/stp')}>
            Proceed to STP <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="interpretation-dashboard">
        {/* Top Row: Cluster Sizes */}
        <div className="card full-width">
          <div className="card-header">
            <h3>Cluster Sizes</h3>
            <p>Distribution of your dataset across the newly formed segments.</p>
          </div>
          <ReactECharts option={sizeChartOption} style={{ height: '200px' }} opts={{ renderer: 'svg' }} />
        </div>

        {/* Bottom Row: Radar and Scatter */}
        <div className="charts-grid">
          <div className="card">
            <div className="card-header flex-between" style={{ alignItems: 'center' }}>
              <div>
                <h3>Cluster Profiles</h3>
                <p>Average variable values per cluster (normalized for display).</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {renderRadarFilters()}
                <button 
                  className="btn-secondary btn-sm" 
                  onClick={() => setExpandedPanel('profiles')}
                  title="Expand Cluster Profiles"
                  style={{ padding: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            
            <ReactECharts option={radarChartOption} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
            
            <div className="defining-characteristics mt-4">
              <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#4B5563' }}>Top Defining Features</h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {profiles?.map(p => {
                  // Sort features by absolute importance score (descending)
                  const topFeatures = Object.entries(p.importanceScores)
                    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                    .slice(0, 3);
                    
                  return (
                    <div key={p.id} style={{ display: 'flex', fontSize: '13px', alignItems: 'center' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '12px', height: '12px', 
                        backgroundColor: CLUSTER_COLORS[p.id % CLUSTER_COLORS.length], 
                        borderRadius: '2px', 
                        marginRight: '8px' 
                      }}></span>
                      <strong style={{ minWidth: '70px' }}>Cluster {p.id}:</strong>
                      <span style={{ color: '#6B7280' }}>
                        {topFeatures.map(([feat, score], i) => (
                          <span key={feat}>
                            {feat} <span style={{ color: score > 0 ? '#10B981' : '#EF4444' }}>({score > 0 ? '+' : ''}{score.toFixed(1)}σ)</span>
                            {i < 2 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div>
                  <h3>Feature Distribution</h3>
                  <p>Visualize the clusters across two dimensions.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="btn-group">
                    <button 
                      className={`btn-sm ${projectionMode === 'pca' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProjectionMode('pca')}
                    >
                      PCA Projection
                    </button>
                    <button 
                      className={`btn-sm ${projectionMode === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProjectionMode('raw')}
                    >
                      Raw Features
                    </button>
                  </div>
                  <button 
                    className="btn-secondary btn-sm" 
                    onClick={() => setExpandedPanel('distribution')}
                    title="Expand Feature Distribution"
                    style={{ padding: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
              
              {projectionMode === 'raw' && (
                <div className="scatter-controls">
                  <select value={xFeature} onChange={e => setXFeature(e.target.value)} className="form-select small">
                    {featureNames.map(f => <option key={`x-${f}`} value={f}>{f} (X Axis)</option>)}
                  </select>
                  <select value={yFeature} onChange={e => setYFeature(e.target.value)} className="form-select small">
                    {featureNames.map(f => <option key={`y-${f}`} value={f}>{f} (Y Axis)</option>)}
                  </select>
                </div>
              )}

              {projectionMode === 'pca' && (
                <div className="scatter-controls">
                  <button 
                    className="btn-secondary btn-sm" 
                    onClick={() => setSwapPCA(!swapPCA)}
                  >
                    Swap Axes (PC1 ⇄ PC2)
                  </button>
                  <button 
                    className="btn-secondary btn-sm" 
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                  >
                    Rotate 90°
                  </button>
                </div>
              )}
            </div>
            <ReactECharts option={scatterChartOption} style={{ height: '360px' }} opts={{ renderer: 'svg' }} />
          </div>
        </div>

      </div>

      {expandedPanel && (
        <div className="modal-overlay" onClick={() => setExpandedPanel(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2>{expandedPanel === 'profiles' ? 'Cluster Profiles' : 'Feature Distribution'}</h2>
              <button className="modal-close-btn" onClick={() => setExpandedPanel(null)}>
                <X size={24} />
              </button>
            </div>
            
            {expandedPanel === 'profiles' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  {renderRadarFilters()}
                </div>
                <ReactECharts option={radarChartOption} style={{ flex: 1, minHeight: '500px' }} opts={{ renderer: 'svg' }} />
                
                <div className="defining-characteristics mt-4">
                  <h4 style={{ marginBottom: '8px', fontSize: '16px', color: '#4B5563' }}>Top Defining Features</h4>
                  <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {profiles?.map(p => {
                      const topFeatures = Object.entries(p.importanceScores)
                        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                        .slice(0, 5);
                        
                      return (
                        <div key={p.id} style={{ display: 'flex', fontSize: '14px', alignItems: 'center' }}>
                          <span style={{ 
                            display: 'inline-block', 
                            width: '16px', height: '16px', 
                            backgroundColor: CLUSTER_COLORS[p.id % CLUSTER_COLORS.length], 
                            borderRadius: '4px', 
                            marginRight: '12px' 
                          }}></span>
                          <strong style={{ minWidth: '80px' }}>Cluster {p.id}:</strong>
                          <span style={{ color: '#6B7280' }}>
                            {topFeatures.map(([feat, score], i) => (
                              <span key={feat}>
                                {feat} <span style={{ color: score > 0 ? '#10B981' : '#EF4444' }}>({score > 0 ? '+' : ''}{score.toFixed(1)}σ)</span>
                                {i < 4 ? ', ' : ''}
                              </span>
                            ))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {expandedPanel === 'distribution' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div className="btn-group">
                    <button 
                      className={`btn-sm ${projectionMode === 'pca' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProjectionMode('pca')}
                    >
                      PCA Projection
                    </button>
                    <button 
                      className={`btn-sm ${projectionMode === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setProjectionMode('raw')}
                    >
                      Raw Features
                    </button>
                  </div>

                  {projectionMode === 'raw' && (
                    <div className="scatter-controls" style={{ marginTop: 0 }}>
                      <select value={xFeature} onChange={e => setXFeature(e.target.value)} className="form-select small">
                        {featureNames.map(f => <option key={`x-${f}`} value={f}>{f} (X Axis)</option>)}
                      </select>
                      <select value={yFeature} onChange={e => setYFeature(e.target.value)} className="form-select small">
                        {featureNames.map(f => <option key={`y-${f}`} value={f}>{f} (Y Axis)</option>)}
                      </select>
                    </div>
                  )}

                  {projectionMode === 'pca' && (
                    <div className="scatter-controls" style={{ marginTop: 0 }}>
                      <button 
                        className="btn-secondary btn-sm" 
                        onClick={() => setSwapPCA(!swapPCA)}
                      >
                        Swap Axes (PC1 ⇄ PC2)
                      </button>
                      <button 
                        className="btn-secondary btn-sm" 
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                      >
                        Rotate 90°
                      </button>
                    </div>
                  )}
                </div>
                
                <ReactECharts option={scatterChartOption} style={{ flex: 1, minHeight: '500px' }} opts={{ renderer: 'svg' }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
