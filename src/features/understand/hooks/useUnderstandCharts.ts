import { useMemo } from 'react';
import { useDatasetStore } from '../../../state/dataset.store';
import { usePrepareStore } from '../../../state/prepare.store';
import { useAnalysisStore } from '../../../state/analysis.store';
import { useUnderstandStore } from '../../../state/understand.store';
import { InterpretationService } from '../services/interpretation.service';

export const CLUSTER_COLORS = [
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

export function useUnderstandCharts() {
  const { dataset } = useDatasetStore();
  const prepareState = usePrepareStore();
  const analysisState = useAnalysisStore();
  const understandState = useUnderstandStore();

  const {
    xFeature,
    yFeature,
    projectionMode,
    swapPCA,
    rotation,
    selectedRadarFeatures,
  } = understandState;

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

  const radarChartOption = useMemo(() => {
    if (!profiles || selectedRadarFeatures.length === 0) return {};
    
    const maxValues: Record<string, number> = {};
    selectedRadarFeatures.forEach(f => {
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
        indicator: selectedRadarFeatures.map(f => ({ name: f, max: maxValues[f] * 1.1 })), // +10% padding
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        splitLine: { lineStyle: { color: '#E5E7EB' } },
      },
      series: [
        {
          type: 'radar',
          data: profiles.map((p, i) => ({
            value: selectedRadarFeatures.map(f => p.averages[f]),
            name: `Cluster ${p.id}`,
            itemStyle: { color: CLUSTER_COLORS[i % CLUSTER_COLORS.length] },
            areaStyle: { opacity: 0.1 }
          }))
        }
      ]
    };
  }, [profiles, selectedRadarFeatures]);

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

  return {
    profiles,
    featureNames,
    radarChartOption,
    scatterChartOption
  };
}
