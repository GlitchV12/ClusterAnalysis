import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { usePrepareStore } from '../../../state/prepare.store';
import { useAnalysisStore } from '../../../state/analysis.store';
import { PreprocessingService } from '../services/preprocessing.service';
import { KMeansService } from '../services/kmeans.service';
import ReactECharts from 'echarts-for-react';
import { Activity, Play, ArrowLeft, Lightbulb } from 'lucide-react';
import './ClusterScreen.css';

export function ClusterScreen() {
  const { dataset } = useDatasetStore();
  const prepareState = usePrepareStore();
  const analysisState = useAnalysisStore();
  const navigate = useNavigate();

  const [localMatrix, setLocalMatrix] = useState<number[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);

  // Phase 1: Preprocess and generate Elbow Curve on mount
  useEffect(() => {
    if (!dataset || prepareState.selectedFeatures.length === 0) return;

    const generateInitialData = async () => {
      try {
        analysisState.setAnalyzing(true);
        setError(null);

        // Simulated small delay for UX
        await new Promise(r => setTimeout(r, 800));

        const { matrix } = PreprocessingService.processData(
          dataset,
          prepareState.selectedFeatures,
          prepareState.imputationStrategy,
          prepareState.scalingStrategy,
          prepareState.outlierStrategy
        );

        setLocalMatrix(matrix);

        // Generate Elbow curve (k=1 to 10)
        const elbow = KMeansService.generateElbowCurve(matrix, 10);
        analysisState.setElbowData(elbow);

      } catch (err: any) {
        setError(err.message || 'Failed to preprocess data');
      } finally {
        analysisState.setAnalyzing(false);
      }
    };

    if (!analysisState.elbowData) {
      generateInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, prepareState]);

  const handleRunClustering = async () => {
    if (!localMatrix) return;
    
    try {
      analysisState.setAnalyzing(true);
      await new Promise(r => setTimeout(r, 500)); // UX delay
      
      const result = KMeansService.runKMeans(localMatrix, analysisState.selectedK);
      analysisState.setClusteringResult(result);
      
      navigate('/understand');
    } catch (err: any) {
      setError(err.message || 'Failed to run clustering');
      analysisState.setAnalyzing(false);
    }
  };

  // ECharts Configuration for the Elbow Curve
  const chartOption = useMemo(() => {
    if (!analysisState.elbowData) return {};

    const xAxisData = analysisState.elbowData.map(d => d.k);
    const wcssData = analysisState.elbowData.map(d => d.wcss);
    const silhouetteData = analysisState.elbowData.map(d => d.silhouetteScore);
    const selectedIndex = analysisState.elbowData.findIndex(d => d.k === analysisState.selectedK);

    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['WCSS (Elbow)', 'Silhouette Score'], top: 0 },
      grid: { left: '5%', right: '5%', bottom: '12%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        name: 'Number of Clusters (K)',
        nameLocation: 'middle',
        nameGap: 30,
        data: xAxisData,
        axisLine: { lineStyle: { color: '#9CA3AF' } }
      },
      yAxis: [
        {
          type: 'value',
          name: 'WCSS',
          nameLocation: 'middle',
          nameGap: 50,
          position: 'left',
          axisLine: { show: true, lineStyle: { color: '#4F46E5' } },
          splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } }
        },
        {
          type: 'value',
          name: 'Silhouette Score',
          nameLocation: 'middle',
          nameGap: 50,
          position: 'right',
          axisLine: { show: true, lineStyle: { color: '#10B981' } },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'WCSS (Elbow)',
          data: wcssData,
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbolSize: 8,
          itemStyle: { color: '#4F46E5' },
          lineStyle: { width: 3 },
          markPoint: selectedIndex >= 0 ? {
            data: [{
              coord: [selectedIndex, wcssData[selectedIndex]],
              itemStyle: { color: '#0F766E' },
              symbolSize: 15,
            }]
          } : undefined
        },
        {
          name: 'Silhouette Score',
          data: silhouetteData,
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 8,
          itemStyle: { color: '#10B981' },
          lineStyle: { width: 3 },
          markPoint: selectedIndex >= 0 ? {
            data: [{
              coord: [selectedIndex, silhouetteData[selectedIndex]],
              itemStyle: { color: '#047857' },
              symbolSize: 15,
            }]
          } : undefined
        }
      ]
    };
  }, [analysisState.elbowData, analysisState.selectedK]);

  if (!dataset) {
    return (
      <div className="empty-state">
        <h2>No Dataset Loaded</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/data')}>Go to Data Ingestion</button>
      </div>
    );
  }

  return (
    <div className="cluster-screen">
      <div className="screen-header flex-between">
        <div>
          <h2>Clustering Analysis</h2>
          <p>Find the optimal number of clusters and run the K-Means algorithm.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/prepare')}>
             <ArrowLeft size={16} /> Back to Prepare
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {analysisState.isAnalyzing && !analysisState.elbowData ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Preprocessing Data & Calculating Variance...</h3>
          <p>This may take a moment depending on your dataset size.</p>
        </div>
      ) : analysisState.elbowData && (
        <div className="analysis-layout">
          
          {/* Main Chart Area */}
          <div className="chart-container card" style={{ position: 'relative' }}>
            <div className="card-header flex-between">
              <div>
                <h3>Cluster Evaluation</h3>
                <p>Use the Elbow Method and Silhouette Score to find optimal K.</p>
                {localMatrix && localMatrix.length > 1000 && (
                  <p className="text-warning" style={{ fontSize: '12px', marginTop: '4px' }}>
                    Note: Silhouette Score calculated on a random sample of 1,000 points for performance.
                  </p>
                )}
              </div>
              <button 
                className="btn-secondary btn-sm" 
                onClick={() => setShowTip(!showTip)}
                style={{ padding: '4px 8px', height: 'auto' }}
              >
                <Lightbulb size={16} /> Tip
              </button>
            </div>
            
            {showTip && (
              <div className="info-box" style={{ margin: '0 24px' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  <strong>How to read this chart:</strong><br/>
                  - <strong>WCSS (Blue line):</strong> Look for the "elbow" where the curve flattens out.<br/>
                  - <strong>Silhouette Score (Green line):</strong> Ranges from -1 to 1. Higher is better. The peak indicates the most mathematically distinct clusters.
                </p>
              </div>
            )}
            <div className="chart-wrapper">
              <ReactECharts 
                option={chartOption} 
                style={{ height: '400px', width: '100%' }} 
                opts={{ renderer: 'svg' }}
              />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="controls-sidebar card">
            <div className="card-header">
              <h3>Configuration</h3>
            </div>
            
            <div className="config-group">
              <label>Select Optimal Clusters (K)</label>
              <div className="k-selector">
                <input 
                  type="range" 
                  min="2" 
                  max="10" 
                  step="1"
                  value={analysisState.selectedK}
                  onChange={(e) => analysisState.setSelectedK(Number(e.target.value))}
                  className="k-slider"
                />
                <div className="k-value">
                  K = {analysisState.selectedK}
                </div>
              </div>
            </div>

            <div className="action-area">
              <button 
                className="btn-primary w-full run-btn"
                onClick={handleRunClustering}
                disabled={analysisState.isAnalyzing}
              >
                {analysisState.isAnalyzing ? (
                  <span className="flex-center gap-2"><div className="spinner-small"></div> Running...</span>
                ) : (
                  <span className="flex-center gap-2"><Play size={18} /> Execute K-Means</span>
                )}
              </button>
            </div>
            
            <div className="info-box">
              <Activity size={18} className="info-icon" />
              <p>
                <strong>What happens next?</strong><br/>
                We will run the K-Means algorithm using your selected {prepareState.selectedFeatures.length} features and K={analysisState.selectedK}. We will assign a cluster ID to every row in your dataset.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
