import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DataScreen } from '../features/dataset/components/DataScreen';
import { PrepareScreen } from '../features/prepare/components/PrepareScreen';
import { ClusterScreen } from '../features/clustering/components/ClusterScreen';
import { UnderstandScreen } from '../features/understand/components/UnderstandScreen';
import { STPScreen } from '../features/stp/components/STPScreen';
import { ReportScreen } from '../features/report/components/ReportScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/data" replace /> },
      { path: 'data', element: <DataScreen /> },
      { path: 'prepare', element: <PrepareScreen /> },
      { path: 'cluster', element: <ClusterScreen /> },
      { path: 'understand', element: <UnderstandScreen /> },
      { path: 'stp', element: <STPScreen /> },
      { path: 'report', element: <ReportScreen /> },
    ],
  },
]);
