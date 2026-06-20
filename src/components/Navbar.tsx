import React from 'react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'history' | 'ranks' | 'profile';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: 'home', activeColor: 'text-[#39ff14]' },
    { id: 'history' as const, label: 'History', icon: 'history', activeColor: 'text-[#ffabf3]' },
    { id: 'ranks' as const, label: 'Ranks', icon: 'leaderboard', activeColor: 'text-[#ffdb40]' },
    { id: 'profile' as const, label: 'Profile', icon: 'person', activeColor: 'text-[#79ff5b]' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-4 bg-[#131313]/90 backdrop-blur-2xl border-t border-[#3c4b35]/20 max-w-lg mx-auto left-1/2 -translate-x-1/2 rounded-t-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center relative py-1 px-3 min-w-[64px] active-scale transition-all group"
          >
            {/* Soft backdrop glow on active tab */}
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-[#201f1f] border border-[#3c4b35]/30 -z-10 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            
            <span
              className={`material-symbols-outlined mb-1 transition-colors duration-200 text-2xl ${
                isActive ? tab.activeColor : 'text-[#e5e2e1]/40 group-hover:text-[#e5e2e1]/70'
              }`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors duration-200 ${
                isActive ? tab.activeColor : 'text-[#e5e2e1]/40 group-hover:text-[#e5e2e1]/60'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
