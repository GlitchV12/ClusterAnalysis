import { Outlet, NavLink } from 'react-router-dom';
import { useProjectStore } from '../../state/project.store';
import { Database, FileCog, Network, Presentation, PieChart, FileText } from 'lucide-react';
import './AppLayout.css';

const WORKFLOW_STEPS = [
  { id: 'data', label: 'Data', path: '/data', icon: Database },
  { id: 'prepare', label: 'Prepare', path: '/prepare', icon: FileCog },
  { id: 'cluster', label: 'Cluster', path: '/cluster', icon: Network },
  { id: 'understand', label: 'Understand', path: '/understand', icon: PieChart },
  { id: 'stp', label: 'STP', path: '/stp', icon: Presentation },
  { id: 'report', label: 'Report', path: '/report', icon: FileText },
];

export function AppLayout() {
  const projectName = useProjectStore((state) => state.projectName);

  return (
    <div className="layout-container">
      {/* Top Header */}
      <header className="layout-header">
        <div className="logo-area">
          <div className="logo-icon"></div>
          <span className="logo-text">ClusterLab</span>
        </div>
        <div className="project-title">{projectName}</div>
        <div className="header-actions">
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            {WORKFLOW_STEPS.map((step, index) => (
              <NavLink 
                key={step.id} 
                to={step.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-number">{index + 1}</div>
                <step.icon size={18} className="nav-icon" />
                <span>{step.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
