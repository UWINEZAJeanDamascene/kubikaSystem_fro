import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { useIsMobile } from '@/app/components/ui/use-mobile';
import { Menu, Sun, Moon, Home, Sparkles, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router';
import NotificationBell from '@/app/components/NotificationBell';
import { GlobalSearch, GlobalSearchTrigger, useGlobalSearchShortcut } from '@/app/components/GlobalSearch';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { QuickCreateMenu } from '@/app/components/QuickCreateMenu';
import { useChatPanelStore } from '@/store/chatPanelStore';
import { useCompanyStore } from '@/store/companyStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  useGlobalSearchShortcut(setSearchOpen);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { open: chatOpen, width: chatWidth, toggle: toggleChat, setOpen: setChatOpen } = useChatPanelStore();
  const company = useCompanyStore((state) => state.company);
  const [isLg, setIsLg] = useState(false);
  const hasEnterpriseAI = Boolean(company?.subscription_plan === 'enterprise' || company?.feature_access?.ai_assistant);
  const effectiveChatOpen = chatOpen && hasEnterpriseAI;

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsLg(mql.matches);
    mql.addEventListener('change', onChange);
    setIsLg(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!hasEnterpriseAI) {
      setChatOpen(false);
    }
  }, [hasEnterpriseAI, setChatOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
    } catch (e) {}
  }, [sidebarCollapsed]);

  // When the app layout is mounted, lock document scrolling so the app's
  // internal scroll container is the only vertical scroll. Remove the lock
  // when unmounting so public pages (landing) can scroll normally.
  useEffect(() => {
    try {
      document.body.classList.add('app-scroll-lock');
    } catch (e) {}
    return () => {
      try {
        document.body.classList.remove('app-scroll-lock');
      } catch (e) {}
    };
  }, []);

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ paddingRight: isLg && effectiveChatOpen ? chatWidth : undefined }}
    >
      {/* Full-app background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef7f6_0%,#f8fbff_45%,#e9f2ef_100%)] dark:bg-[linear-gradient(135deg,#061013_0%,#091923_46%,#07140f_100%)]" />
      <div className="absolute left-[-12rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/10" />
      <div className="absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-400/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.045)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)]" />
      {/* Desktop Sidebar - always visible on lg screens */}
      <div className={`hidden lg:block transition-all duration-300 relative z-10 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile Sidebar - sheet/drawer (render only on mobile to avoid duplicate sidebars) */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r border-slate-800">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Mobile Header - show on screens smaller than lg */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center gap-3 bg-white/95 dark:bg-[#0d1626]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 py-3 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
            <span className="hidden md:inline text-lg font-semibold text-slate-800 dark:text-white">StockManager</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Search (Ctrl+K)"
              aria-label="Open global search"
            >
              <Search className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </Button>
            <QuickCreateMenu compact />
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Back to Home"
            >
              <Home className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
            </Button>
          </div>
        </div>

        {/* Desktop Top Bar */}
        {!isMobile && (
          <header className="hidden lg:flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/92 px-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1626]/92">
            <div className="flex items-center gap-4 min-w-0">
              <Breadcrumbs />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 dark:border-white/10 dark:bg-white/[0.04]">
              <GlobalSearchTrigger onClick={() => setSearchOpen(true)} />
              <QuickCreateMenu />
              <NotificationBell />
              {hasEnterpriseAI && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className={`h-10 gap-2 rounded-xl px-3 transition-all ${
                    chatOpen
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110'
                      : 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:from-indigo-100 hover:to-violet-100 hover:shadow-md dark:from-indigo-500/15 dark:to-violet-500/15 dark:text-indigo-300 dark:ring-indigo-500/30 dark:hover:from-indigo-500/25 dark:hover:to-violet-500/25'
                  }`}
                  title={chatOpen ? 'Close Stacy AI assistant' : 'Open Stacy AI assistant'}
                >
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${chatOpen ? 'bg-white' : 'bg-emerald-400'}`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${chatOpen ? 'bg-white' : 'bg-emerald-500'}`} />
                  </span>
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">AI</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="h-10 gap-2 rounded-xl px-3 text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-white/10"
                title="Back to Home"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-xl text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-white/10"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
        )}

        {/* Mobile breadcrumbs */}
        <div className="lg:hidden border-b border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-[#0d1626]/70">
          <Breadcrumbs />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto px-2 py-3 sm:px-3 md:px-5 md:py-5">
          {children}
        </div>
      </main>

      {/* Global command palette */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
