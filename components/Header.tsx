
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          우리 아이 미래 얼굴 예측
        </h1>
        <p className="text-center text-slate-500 mt-2">
          AI로 우리 아이의 미래 모습을 미리 만나보세요!
        </p>
      </div>
    </header>
  );
};
