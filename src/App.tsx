import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { BlogManager } from './components/blogs/BlogManager';
import { PortfolioManager } from './components/portfolio/PortfolioManager';
import { EnquiriesManager } from './components/enquiries/EnquiriesManager';
import { HomeContentManager } from './components/home/HomeContentManager';
import { AboutContentManager } from './components/about/AboutContentManager';
import { ServicesManager } from './components/services/ServicesManager';
import { ContactManager } from './components/contact/ContactManager';
import { ProcessManager } from './components/process/ProcessManager';
import { SettingsManager } from './components/settings/SettingsManager';
import {
  AdminTab,
  BlogPost,
  PortfolioItem,
  Enquiry,
  MediaAsset,
  SystemHealth,
} from './types';
import { api, authStorage } from './lib/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    authStorage.isAuthenticated()
  );
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Backend state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load all initial data from backend
  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [healthRes, blogsRes, portRes, enqRes, mediaRes] = await Promise.allSettled([
        api.getHealth(),
        api.getPosts(),
        api.getPortfolio(),
        api.getEnquiries(),
        api.getMedia(),
      ]);

      if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
      if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value);
      if (portRes.status === 'fulfilled') setPortfolio(portRes.value);
      if (enqRes.status === 'fulfilled') setEnquiries(enqRes.value);
      if (mediaRes.status === 'fulfilled') setMedia(mediaRes.value);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLogout = () => {
    authStorage.clearToken();
    setIsAuthenticated(false);
  };

  const handleUpdateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id || e.id === id ? { ...e, status } : e))
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        enquiriesCount={enquiries.length}
        newEnquiriesCount={newEnquiriesCount}
        health={health}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        <Header
          activeTab={activeTab}
          health={health}
          onRefresh={loadData}
          isRefreshing={refreshing}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
          {activeTab === 'overview' && (
            <OverviewTab
              blogs={blogs}
              portfolio={portfolio}
              enquiries={enquiries}
              media={media}
              health={health}
              onNavigate={setActiveTab}
              onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            />
          )}

          {activeTab === 'enquiries' && (
            <EnquiriesManager enquiries={enquiries} onRefresh={loadData} />
          )}

          {activeTab === 'home' && <HomeContentManager />}

          {activeTab === 'about' && <AboutContentManager />}

          {activeTab === 'services' && <ServicesManager />}

          {activeTab === 'portfolio' && (
            <PortfolioManager portfolio={portfolio} onRefresh={loadData} />
          )}

          {activeTab === 'articles' && (
            <BlogManager
              blogs={blogs}
              onRefresh={loadData}
              page="articles"
              pageLabel="Articles / Editorial Showcase"
              pageRoute="/articles"
            />
          )}

          {activeTab === 'blogs' && (
            <BlogManager
              blogs={blogs}
              onRefresh={loadData}
              page="blog"
              pageLabel="Blog Page Showcase"
              pageRoute="/blog"
            />
          )}

          {activeTab === 'contact' && <ContactManager />}

          {activeTab === 'process' && <ProcessManager />}

          {activeTab === 'settings' && (
            <SettingsManager health={health} onRefreshHealth={loadData} />
          )}
        </main>
      </div>
    </div>
  );
}
