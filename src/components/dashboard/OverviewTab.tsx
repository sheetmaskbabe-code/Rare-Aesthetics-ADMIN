import React from 'react';
import {
  FileText,
  Briefcase,
  Mail,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { AdminTab, BlogPost, PortfolioItem, Enquiry, MediaAsset, SystemHealth } from '../../types';

interface OverviewTabProps {
  blogs: BlogPost[];
  portfolio: PortfolioItem[];
  enquiries: Enquiry[];
  media?: MediaAsset[];
  health?: SystemHealth | null;
  onNavigate: (tab: AdminTab) => void;
  onUpdateEnquiryStatus?: (id: string, status: Enquiry['status']) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  blogs,
  portfolio,
  enquiries,
  onNavigate,
}) => {
  const newEnquiries = enquiries.filter((e) => e.status === 'new');

  const stats = [
    {
      label: 'Blog Posts',
      value: blogs.length,
      sub: `${blogs.filter((b) => b.published).length} published`,
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      tab: 'blogs' as AdminTab,
    },
    {
      label: 'Portfolio Items',
      value: portfolio.length,
      sub: `${portfolio.filter((p) => p.featured).length} featured`,
      icon: Briefcase,
      color: 'from-purple-600 to-pink-600',
      tab: 'portfolio' as AdminTab,
    },
    {
      label: 'Consultations',
      value: enquiries.length,
      sub: `${newEnquiries.length} pending action`,
      icon: Mail,
      color: 'from-amber-600 to-orange-600',
      tab: 'enquiries' as AdminTab,
      highlight: newEnquiries.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-pink-50 border border-purple-200/80 p-6 md:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Control Center
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Rare Aesthetics Admin
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Manage your cosmetic product formulations, technical portfolio showcase, blog publications and customer consultation requests in real-time.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(s.tab)}
              className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
