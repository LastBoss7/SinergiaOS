import React from 'react';
import { ArrowLeft, MoreVertical, Share2, Star, Download } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBack,
  actions 
}) => {
  return (
    <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-4 sticky top-16 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {actions || (
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;