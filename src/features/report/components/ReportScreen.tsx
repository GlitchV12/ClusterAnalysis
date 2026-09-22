import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../../../state/dataset.store';
import { useAnalysisStore } from '../../../state/analysis.store';
import { useSTPStore } from '../../../state/stp.store';
import { usePrepareStore } from '../../../state/prepare.store';
import { Printer, RefreshCcw, CheckCircle2, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useUnderstandCharts } from '../../understand/hooks/useUnderstandCharts';
import './ReportScreen.css';

export function ReportScreen() {
  const { dataset, resetDataset } = useDatasetStore();
  const analysisState = useAnalysisStore();
  const stpState = useSTPStore();
  const prepareState = usePrepareStore();
  const navigate = useNavigate();

  const [includeRadarChart, setIncludeRadarChart] = useState(true);
  const [includeScatterPlot, setIncludeScatterPlot] = useState(true);

  const { radarChartOption, scatterChartOption } = useUnderstandCharts();

  // Calculate cluster sizes based on assignments
  const clusterSizes = useMemo(() => {
    if (!analysisState.clusteringResult) return {};
    const sizes: Record<number, number> = {};
    analysisState.clusteringResult.clusterAssignments.forEach(clusterId => {
      sizes[clusterId] = (sizes[clusterId] || 0) + 1;
    });
    return sizes;
  }, [analysisState.clusteringResult]);

  if (!dataset || !analysisState.clusteringResult) {
    return (
      <div className="empty-state">
        <h2>No Complete Analysis Found</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/data')}>Start New Analysis</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to start a new analysis? All current progress will be lost.")) {
      resetDataset();
      prepareState.resetPrepare();
      analysisState.resetAnalysis();
      stpState.resetSTP();
      navigate('/data');
    }
  };

  const analyzedPopulation = analysisState.clusteringResult.clusterAssignments.length;
  
  const targetName = stpState.targetClusterId !== null 
    ? stpState.segmentNames[stpState.targetClusterId] || `Cluster ${stpState.targetClusterId}`
    : 'Not Selected';

  const targetSize = stpState.targetClusterId !== null ? clusterSizes[stpState.targetClusterId] : 0;
  const targetPercentage = ((targetSize / analyzedPopulation) * 100).toFixed(1);

  return (
    <div className="report-screen">
      
      <div className="report-actions no-print">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginRight: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={includeRadarChart} 
              onChange={e => setIncludeRadarChart(e.target.checked)} 
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-primary-600, #2563eb)' }}
            />
            Include Radar Chart
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={includeScatterPlot} 
              onChange={e => setIncludeScatterPlot(e.target.checked)} 
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-primary-600, #2563eb)' }}
            />
            Include Scatter Plot
          </label>
        </div>
        <button className="btn-secondary" onClick={handleReset}>
          <RefreshCcw size={16} /> Start New Analysis
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print Report
        </button>
      </div>

      <div className="report-document">
        
        <header className="report-header">
          <h1>Cluster Analysis Strategy Report</h1>
          <p className="report-meta">Generated on {new Date().toLocaleDateString()}</p>
        </header>

        {/* Section 1: Project Overview */}
        <section className="report-section">
          <h2>1. Project Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Dataset</span>
              <h3 className="stat-value">{dataset.fileName}</h3>
            </div>
            <div className="stat-card">
              <span className="stat-label">Analyzed Population</span>
              <h3 className="stat-value">{analyzedPopulation.toLocaleString()} rows</h3>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Segments</span>
              <h3 className="stat-value">{analysisState.selectedK} Clusters</h3>
            </div>
          </div>
        </section>

        {/* Section 2: STP Strategy */}
        <section className="report-section bg-highlight">
          <h2>2. Strategic Focus (STP)</h2>
          
          <div className="strategy-block">
            <h3>Target Audience</h3>
            <div className="target-badge">
              <CheckCircle2 size={24} className="text-success" />
              <span className="target-name-large">{targetName}</span>
            </div>
            <p className="target-stats">
              Representing <strong>{targetSize.toLocaleString()}</strong> individuals ({targetPercentage}% of total population).
            </p>
          </div>

          <div className="strategy-block">
            <h3>Positioning Statement</h3>
            <div className="positioning-box">
              {stpState.positioningStatement ? (
                <p>"{stpState.positioningStatement}"</p>
              ) : (
                <p className="text-muted italic">No positioning statement provided.</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Segment Breakdown */}
        <section className="report-section">
          <h2>3. Segment Breakdown</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Segment Name</th>
                <th>Population Size</th>
                <th>% of Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: analysisState.selectedK }).map((_, id) => {
                const name = stpState.segmentNames[id] || `Cluster ${id}`;
                const size = clusterSizes[id] || 0;
                const pct = ((size / analyzedPopulation) * 100).toFixed(1);
                const isTarget = id === stpState.targetClusterId;

                return (
                  <tr key={id} className={isTarget ? 'row-target' : ''}>
                    <td className="font-medium">
                      {isTarget && <ChevronRight size={16} className="inline-icon text-success" />}
                      {name}
                    </td>
                    <td>{size.toLocaleString()}</td>
                    <td>{pct}%</td>
                    <td>
                      {isTarget ? (
                        <span className="badge badge-success">Primary Target</span>
                      ) : (
                        <span className="badge badge-neutral">Secondary</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Section 4: Visualizations */}
        {(includeRadarChart || includeScatterPlot) && (
          <section className="report-section">
            <h2>4. Visualizations</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {includeRadarChart && Object.keys(radarChartOption).length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Cluster Profiles</h3>
                  <ReactECharts option={radarChartOption} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
                </div>
              )}
              {includeScatterPlot && Object.keys(scatterChartOption).length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Feature Distribution</h3>
                  <ReactECharts option={scatterChartOption} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
