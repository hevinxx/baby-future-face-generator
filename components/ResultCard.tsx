
import React from 'react';

interface ResultCardProps {
  age: number;
  src: string | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full h-full bg-slate-200 animate-pulse"></div>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const ResultCard: React.FC<ResultCardProps> = ({ age, src, isLoading }) => {
  const handleDownload = () => {
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `future_child_age_${age}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 flex flex-col transform transition-transform duration-300 hover:scale-105 group">
      <div className="relative w-full aspect-square bg-slate-100 flex items-center justify-center">
        {isLoading ? (
          <SkeletonLoader />
        ) : src ? (
          <>
            <img src={src} alt={`Generated look at age ${age}`} className="w-full h-full object-cover" />
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75"
              aria-label={`Download image for age ${age}`}
            >
              <DownloadIcon />
            </button>
          </>
        ) : (
           <div className="text-center p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p className="mt-2 text-sm text-slate-500">생성 대기 중</p>
           </div>
        )}
      </div>
      <div className="p-4 bg-slate-50 text-center">
        <h3 className="font-bold text-lg text-indigo-600">{age}살</h3>
      </div>
    </div>
  );
};
