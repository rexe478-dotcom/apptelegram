import React from 'react';
import { motion } from 'motion/react';
import { AppNotification } from '../types';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead
}: NotificationsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Scrim backdrop click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
        onClick={onClose}
      />

      {/* Retro panel sliding from right */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-xs h-full bg-[#131313] border-l-2 border-[#39ff14] relative z-10 p-6 flex flex-col justify-between shadow-2xl"
      >
        <div className="crt-noise-overlay"></div>
        
        <div className="space-y-6 flex-grow overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b-2 border-[#3c4b35]/45 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#39ff14] text-xl animate-pulse">
                notifications
              </span>
              <h3 className="font-sans text-base font-bold text-[#e5e2e1] uppercase tracking-wider">
                ALERTS
              </h3>
            </div>
            
            {/* Close btn */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[4px] border-2 border-black bg-[#ffabf3] text-black font-mono font-bold flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              X
            </button>
          </div>

          {/* Action header */}
          {notifications.some(n => n.unread) && (
            <div className="flex justify-end relative z-10">
              <button 
                onClick={onMarkAllRead}
                className="text-[9px] font-mono text-[#39ff14] hover:text-[#efffe3] font-bold uppercase tracking-wider border-b border-[#39ff14]/30 cursor-pointer"
              >
                ACKNOWLEDGE ALL ➔
              </button>
            </div>
          )}

          {/* List of alerts */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 relative z-10">
            {notifications.map((item) => {
              let icon = "info";
              let iconColor = "text-[#e5e2e1]/40";
              let borderColor = "border-[#3c4b35]";
              
              if (item.type === "alert") {
                icon = "campaign";
                iconColor = "text-[#ffabf3]";
                borderColor = item.unread ? "border-[#ffabf3]" : "border-[#3c4b35]/60";
              } else if (item.type === "streak") {
                icon = "bolt";
                iconColor = "text-[#ffdb40]";
                borderColor = item.unread ? "border-[#ffdb40]" : "border-[#3c4b35]/60";
              } else {
                icon = "verified";
                iconColor = "text-[#39ff14]";
                borderColor = item.unread ? "border-[#39ff14]" : "border-[#3c4b35]/60";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => onMarkRead(item.id)}
                  className={`p-3 bg-[#1c1b1b] border-2 rounded-[4px] relative overflow-hidden transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:border-[#39ff14]/40 ${borderColor} ${
                    item.unread ? 'bg-[#1c1b1b]' : 'opacity-65'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <span className={`material-symbols-outlined text-lg ${iconColor}`}>
                      {icon}
                    </span>
                    
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[11px] font-bold text-[#e5e2e1] truncate font-sans uppercase">
                          {item.title}
                        </span>
                        <span className="text-[8px] font-mono text-[#baccb0]/40">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#baccb0]/70 font-body leading-normal">
                        {item.body}
                      </p>
                    </div>
                  </div>

                  {/* Unread mini dot */}
                  {item.unread && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#39ff14] rounded-none animate-ping"></div>
                  )}
                </div>
              );
            })}

            {notifications.length === 0 && (
              <p className="text-center font-mono text-[11px] text-[#e5e2e1]/30 py-8">
                ALERTS DEFRAGMENTED. NO PENDING CORE MESSAGES.
              </p>
            )}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="pt-4 border-t border-[#3c4b35]/25 text-[8px] font-mono text-[#baccb0]/35 text-center relative z-10">
          STREAK NODE ALERTS SECURED
        </div>
      </motion.div>
    </div>
  );
}
