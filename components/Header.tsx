import React from 'react';
import { t } from '../i18n';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          {t('headerTitle')}
        </h1>
        <p className="text-center text-slate-500 mt-2">
          {t('headerSubtitle')}
        </p>
      </div>
    </header>
  );
};
