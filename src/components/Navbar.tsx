import React from 'react';
import { motion } from 'motion/react';
import { PixelHomeIcon, PixelHistoryIcon, PixelRanksIcon, PixelProfileIcon } from './PixelIcons';

export type TabType = 'home' | 'history' | 'ranks' | 'profile';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', Icon: PixelHomeIcon, activeColor: 'text-[#39ff14] drop-shadow-[0_0_6px_rgba(57,255,20,0.65)]' },
    { id: 'history' as const, label: 'History', Icon: PixelHistoryIcon, activeColor: 'text-[#ffabf3] drop-shadow-[0_0_6px_rgba(255,171,243,0.65)]' },
    { id: 'ranks' as const, label: 'Ranks', Icon: PixelRanksIcon, activeColor: 'text-[#ffdb40] drop-shadow-[0_0_6px_rgba(255,219,64,0.65)]' },
    { id: 'profile' as const, label: 'Profile', Icon: PixelProfileIcon, activeColor: 'text-[#39ff14] drop-shadow-[0_0_6px_rgba(57,255,20,0.65)]' }
  ];

  return (
    <nav className="fixed bottom-0 z-50 flex justify-around items-center px-4 py-3 bg-[#131313]/90 backdrop-blur-md border-t-2 border-[#39ff14] w-full max-w-lg left-1/2 -translate-x-1/2 rounded-t-[4px] shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.Icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center relative py-1.5 px-3.5 min-w-[68px] active-scale transition-all group cursor-pointer"
          >
            {/* Retro blocky active tab background */}
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-[#1c1b1b] border-2 border-[#3c4b35] -z-10 rounded-[4px] shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            
            <IconComponent
              className={`w-6 h-6 mb-1 transition-all duration-200 ${
                isActive ? tab.activeColor : 'text-[#e5e2e1]/40 group-hover:text-[#e5e2e1]/70'
              }`}
            />
            
            <span
              className={`text-[9px] font-mono uppercase tracking-wider font-bold transition-all duration-200 ${
                isActive ? 'text-[#e5e2e1]' : 'text-[#e5e2e1]/30 group-hover:text-[#e5e2e1]/50'
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
