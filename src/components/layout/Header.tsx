import React from 'react';
import { Menu } from 'lucide-react';
import { AdminTab, SystemHealth } from '../../types';

interface HeaderProps {
  activeTab: AdminTab;
  health?: SystemHealth | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onToggleMobileMenu,
}) => {
  const titles: Record<AdminTab, { title: string; desc: string }> = {
    overview: {
      title: 'Dashboard Overview',
      desc: 'System health, content metrics and recent incoming customer leads',
    },
    enquiries: {
      title: 'Consultations & Bookings',
      desc: 'Review consultation requests, accept or decline bookings, and manage client appointment status',
    },
    home: {
      title: 'Home Page CMS',
      desc: 'Customize hero slider, customer testimonials, about teaser, and call-to-actions',
    },
    about: {
      title: 'About Page CMS',
      desc: 'Customize hero header slider, company ethos, narrative and founder profile',
    },
    services: {
      title: 'Services Page CMS',
      desc: 'Customize services hero slider, capabilities, and formulation offerings',
    },
    portfolio: {
      title: 'Portfolio CMS',
      desc: 'Customize portfolio hero slider, formulation case studies and client projects',
    },
    articles: {
      title: 'Articles CMS',
      desc: 'Customize articles hero slider, cosmetic chemistry articles and editorial notes',
    },
    blogs: {
      title: 'Blog Page CMS',
      desc: 'Customize blog hero slider, published blog posts, and beauty insights',
    },
    contact: {
      title: 'Contact Page CMS',
      desc: 'Customize contact hero slider, project initiation messaging and consultation details',
    },
    process: {
      title: 'Process Page CMS',
      desc: 'Customize process hero slider and the 7-stage formulation lifecycle',
    },
    settings: {
      title: 'System Settings & Status',
      desc: 'View API configurations, database connections and administrative secrets',
    },
  };

  const current = titles[activeTab] || { title: 'Admin', desc: '' };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2.5 min-w-0 mr-2">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
            {current.title}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 truncate hidden sm:block">
            {current.desc}
          </p>
        </div>
      </div>
    </header>
  );
};
