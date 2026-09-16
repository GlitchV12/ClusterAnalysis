import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { usePrepareStore } from '../../../state/prepare.store';
import { useAnalysisStore } from '../../../state/analysis.store';
import { InterpretationService, type ClusterProfile } from '../services/interpretation.service';
import ReactECharts from 'echarts-for-react';
import { ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import './UnderstandScreen.css';

// Professional color palette for clusters
const CLUSTER_COLORS = [
  '#4F46E5', // Indigo
  '#0F766E', // Teal
  '#EA580C', // Orange
  '#BE185D', // Pink
  '#1D4ED8', // Blue
  '#047857', // Emerald
  '#A21CAF', // Fuchsia
  '#B45309', // Amber
  '#4338CA', // Indigo darker
  '#0F172A', // Slate
];

export function UnderstandScreen() {
  const { dataset } = useDatasetStore();
  const prepareState = usePrepareStore();
  const analysisState = useAnalysisStore();
  const navigate = useNavigate();

  const profileData = useMemo(() => {
    if (!dataset || !analysisState.clusteringResult) return null;
    return InterpretationService.generateProfiles(
      dataset,
      prepareState.selectedFeatures,
      prepareState.imputationStrategy,
      prepareState.outlierStrategy,
      analysisState.clusteringResult
    );
  }, [dataset, prepareState, analysisState.clusteringResult]);

  const profiles = profileData?.profiles || null;
  const featureNames = profileData?.featureNames || [];

  const [xFeature, setXFeature] = useState<string>('');
  const [yFeature, setYFeature] = useState<string>('');
  const [projectionMode, setProjectionMode] = useState<'raw' | 'pca'>('pca');
  const [swapPCA, setSwapPCA] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  React.useEffect(() => {
    if (featureNames.length > 0) {
      if (!featureNames.includes(xFeature)) setXFeature(featureNames[0]);
      if (!featureNames.includes(yFeature)) setYFeature(featureNames[1] || featureNames[0]);
    }
  }, [featureNames, xFeature, yFeature]);

  const scatterData = useMemo(() => {
    if (!dataset || !analysisState.clusteringResult) return [];
    
    if (projectionMode === 'pca') {
      return InterpretationService.getPCAData(
        dataset,
        prepareState.selectedFeatures,
        prepareState.imputationStrategy,
        prepareState.scalingStrategy,
        prepareState.outlierStrategy,
        analysisState.clusteringResult.clusterAssignments
      );
    } else {
      if (!xFeature || !yFeature) return [];
      return InterpretationService.getScatterData(
        dataset,
        prepareState.selectedFeatures,
        prepareState.imputationStrategy,
        prepareState.outlierStrategy,
        analysisState.clusteringResult.clusterAssignments,
        xFeature,
        yFeature
      );
    }
  }, [dataset, prepareState, analysisState.clusteringResult, projectionMode, xFeature, yFeature]);

  // ECharts Options
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

  const radarChartOption = useMemo(() => {
    if (!profiles) return {};
    
    // Normalize data for radar chart so variables with huge scales don't crush small scales
    // We calculate the max value across all clusters for each feature
    const maxValues: Record<string, number> = {};
    featureNames.forEach(f => {
      maxValues[f] = Math.max(...profiles.map(p => p.averages[f])) || 1; 
    });

    return {
      tooltip: { trigger: 'item' },
      legend: {
        data: profiles.map(p => `Cluster ${p.id}`),
        top: 0,
        type: 'scroll',
      },
      radar: {
        indicator: featureNames.map(f => ({ name: f, max: maxValues[f] * 1.1 })), // +10% padding
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        splitLine: { lineStyle: { color: '#E5E7EB' } },
      },
      series: [
        {
          type: 'radar',
          data: profiles.map((p, i) => ({
            value: featureNames.map(f => p.averages[f]),
            name: `Cluster ${p.id}`,
            itemStyle: { color: CLUSTER_COLORS[i % CLUSTER_COLORS.length] },
            areaStyle: { opacity: 0.1 }
          }))
        }
      ]
    };
  }, [profiles, featureNames]);

  const scatterChartOption = useMemo(() => {
    if (!profiles || scatterData.length === 0) return {};

    const rotatePoint = (x: number, y: number, angleDegrees: number) => {
      const rad = (angleDegrees * Math.PI) / 180;
      return [
        x * Math.cos(rad) - y * Math.sin(rad),
        x * Math.sin(rad) + y * Math.cos(rad)
      ];
    };

    const series = profiles.map(p => ({
      name: `Cluster ${p.id}`,
      type: 'scatter',
      symbolSize: 8,
      itemStyle: { color: CLUSTER_COLORS[p.id % CLUSTER_COLORS.length] },
      data: scatterData.filter(d => d.cluster === p.id).map(d => {
        if (projectionMode === 'pca') {
          const px = swapPCA ? d.y : d.x;
          const py = swapPCA ? d.x : d.y;
          return rotatePoint(px, py, rotation);
        }
        return [d.x, d.y];
      })
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (projectionMode === 'pca') {
            const pcX = swapPCA ? 'PC2' : 'PC1';
            const pcY = swapPCA ? 'PC1' : 'PC2';
            return `${params.seriesName}<br/>${pcX}: ${params.value[0].toFixed(2)}<br/>${pcY}: ${params.value[1].toFixed(2)}`;
          }
          return `${params.seriesName}<br/>${xFeature}: ${params.value[0]}<br/>${yFeature}: ${params.value[1]}`;
        }
      },
      legend: { top: 0, type: 'scroll' },
      grid: { left: '10%', right: '5%', bottom: '10%', top: '15%' },
      xAxis: {
        type: 'value',
        name: projectionMode === 'pca' ? (swapPCA ? 'Principal Component 2' : 'Principal Component 1') : xFeature,
        nameLocation: 'middle',
        nameGap: 25,
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        name: projectionMode === 'pca' ? (swapPCA ? 'Principal Component 1' : 'Principal Component 2') : yFeature,
        nameLocation: 'middle',
        nameGap: 40,
        splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } }
      },
      series
    };
  }, [profiles, scatterData, xFeature, yFeature, projectionMode, swapPCA, rotation]);


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
            <div className="card-header flex-between">
              <div>
                <h3>Cluster Profiles</h3>
                <p>Average variable values per cluster (normalized for display).</p>
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
    </div>
  );
}
