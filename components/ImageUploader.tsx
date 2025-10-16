
import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: File) => void;
  preview: string | null;
}

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, preview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };
  
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <label className="font-semibold text-slate-600 mb-2">{label}</label>
      <div
        onClick={handleClick}
        className="w-full aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50 overflow-hidden"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <PhotoIcon />
            <p className="mt-2 text-sm text-slate-500">클릭하여 사진 선택</p>
          </div>
        )}
      </div>
    </div>
  );
};
