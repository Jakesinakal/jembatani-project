/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, TrendingUp, Plus, MessageSquare, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface BottomNavProps {
  onPlusClick: () => void;
}

export function BottomNav({ onPlusClick }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Beranda', path: '/beranda', icon: Home },
    { name: 'Harga', path: '/harga', icon: TrendingUp },
    { name: 'Buat', path: '#plus', icon: Plus, isCenter: true },
    { name: 'Pesan', path: '/pesan', icon: MessageSquare },
    { name: 'Akun', path: '/akun', icon: User },
  ];

  return (
    <div
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface-container-highest border-t border-outline-variant/60 flex justify-around items-end pb-3 pt-2 px-2 z-40"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPath.startsWith(tab.path) && tab.path !== '#plus';

        if (tab.isCenter) {
          return (
            <button
              key={tab.name}
              id="action-create-sheet-trigger"
              onClick={onPlusClick}
              className="flex flex-col items-center justify-center py-1 flex-1 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                <Plus strokeWidth={2} className="w-8 h-8" />
              </div>
              <span className="text-body-sm font-bold font-jakarta text-on-surface mt-1 tracking-wide">
                {tab.name}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-center py-1 flex-1 transition-colors group"
          >
            <div
              className={`p-1 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container'
                  : 'text-on-surface-variant group-hover:bg-surface-container-high'
              }`}
            >
              <Icon
                strokeWidth={1.5}
                className={`w-6 h-6 transition-transform group-active:scale-90 ${
                  isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                }`}
              />
            </div>
            <span
              className={`text-body-sm font-bold font-jakarta mt-1 tracking-wide ${
                isActive ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              {tab.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
