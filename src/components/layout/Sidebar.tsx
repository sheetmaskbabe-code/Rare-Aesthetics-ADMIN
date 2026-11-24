import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  CalendarCheck,
  Home,
  Info,
  ExternalLink,
  Sparkles,
  FlaskConical,
  Workflow,
  MessageSquare,
  LogOut,
  X,
} from 'lucide-react';
import { AdminTab, SystemHealth } from '../../types';

interface SidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  enquiriesCount?: number;
  newEnquiriesCount?: number;
  health?: SystemHealth | null;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  newEnquiriesCount = 0,
  health,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    section?: string;
  }> = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'enquiries',
      label: 'Consultations',
      icon: CalendarCheck,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
    },
    { id: 'home', label: 'Home Page CMS', icon: Home, section: 'PAGES CMS' },
    { id: 'about', label: 'About Page CMS', icon: Info },
    { id: 'services', label: 'Services Page CMS', icon: FlaskConical },
    { id: 'portfolio', label: 'Portfolio CMS', icon: Briefcase },
    { id: 'blogs', label: 'Blog Posts CMS', icon: FileText },
    { id: 'contact', label: 'Contact Page CMS', icon: MessageSquare },
    { id: 'process', label: 'Process & Approach CMS', icon: Workflow },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`bg-white border-r border-slate-200 flex flex-col h-screen select-none z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0 w-64 shadow-sm ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl'
            : 'fixed inset-y-0 left-0 -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9810FA] flex items-center justify-center text-white shadow-md shadow-[#9810FA]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">Rare Aesthetics</h2>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#9810FA]">Admin App</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Main Website"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <React.Fragment key={item.id}>
                {item.section && (
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9810FA] text-white shadow-md shadow-[#9810FA]/30 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-[#9810FA]' : 'bg-[#9810FA]/15 text-[#9810FA]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  </>
);
};
