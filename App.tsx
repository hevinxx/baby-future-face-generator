
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { generateFutureLooks } from './services/geminiService';
import type { ImageFile, GeneratedImage } from './types';
import { DEFAULT_TARGET_AGES } from './constants';

const App: React.FC = () => {
  const [motherPhoto, setMotherPhoto] = useState<ImageFile | null>(null);
  const [fatherPhoto, setFatherPhoto] = useState<ImageFile | null>(null);
  const [babyPhoto, setBabyPhoto] = useState<ImageFile | null>(null);
  
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unspecified'>('Unspecified');
  const [currentAge, setCurrentAge] = useState<string>('1');
  const [targetAges, setTargetAges] = useState<(number | '')[]>(DEFAULT_TARGET_AGES);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const validTargetAges = useMemo(() => targetAges.filter((age): age is number => typeof age === 'number' && age > 0), [targetAges]);

  useEffect(() => {
    setGeneratedImages(validTargetAges.map(age => ({ age, src: null })));
  }, [targetAges]);

  const handleImageUpload = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => 
    (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({
          base64: reader.result as string,
          file: file,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
  };
  
  const handleTargetAgeChange = (index: number, value: string) => {
    const newAges = [...targetAges];
    const numericValue = value === '' ? '' : parseInt(value, 10);
    if (numericValue === '' || (numericValue >= 1 && numericValue <= 100)) {
       newAges[index] = numericValue;
       setTargetAges(newAges);
    }
  };

  const isButtonDisabled = useMemo(() => {
    return !motherPhoto || !fatherPhoto || !babyPhoto || isLoading || validTargetAges.length === 0;
  }, [motherPhoto, fatherPhoto, babyPhoto, isLoading, validTargetAges]);
  
  const allImagesGenerated = useMemo(() => {
    return generatedImages.length > 0 && generatedImages.every(img => img.src);
  }, [generatedImages]);

  const handleSubmit = useCallback(async () => {
    if (!motherPhoto || !fatherPhoto || !babyPhoto) {
      setError("모든 사진을 업로드해주세요.");
      return;
    }
    const parsedCurrentAge = parseInt(currentAge, 10);
    if (isNaN(parsedCurrentAge) || parsedCurrentAge < 0) {
      setError("아기의 현재 나이를 올바르게 입력해주세요.");
      return;
    }
    if (validTargetAges.length === 0) {
        setError("하나 이상의 유효한 미래 나이를 입력해주세요.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(validTargetAges.map(age => ({ age, src: null })));

    try {
      const images = await generateFutureLooks(motherPhoto, fatherPhoto, babyPhoto, validTargetAges, gender, parsedCurrentAge);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError("이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [motherPhoto, fatherPhoto, babyPhoto, validTargetAges, gender, currentAge]);

  const handleDownloadAll = useCallback(async () => {
    if (!allImagesGenerated) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imagesToDraw = generatedImages.filter(img => img.src).slice(0, 4);
    if (imagesToDraw.length === 0) return;

    const imageElements = await Promise.all(
        imagesToDraw.map(imgData => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = imgData.src!;
        }))
    );
    
    const singleWidth = imageElements[0].width;
    const singleHeight = imageElements[0].height;
    
    const cols = imagesToDraw.length > 1 ? 2 : 1;
    const rows = Math.ceil(imagesToDraw.length / cols);

    canvas.width = singleWidth * cols;
    canvas.height = singleHeight * rows;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    imageElements.forEach((img, index) => {
        const x = (index % cols) * singleWidth;
        const y = Math.floor(index / cols) * singleHeight;
        ctx.drawImage(img, x, y, singleWidth, singleHeight);
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'future_child_collage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImages, allImagesGenerated]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <section id="upload-section" className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 mb-10">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">가족 사진 업로드</h2>
            <p className="text-slate-500 mb-6">엄마, 아빠, 아기의 사진을 각각 업로드해주세요.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploader 
                label="엄마 사진" 
                onImageUpload={handleImageUpload(setMotherPhoto)} 
                preview={motherPhoto?.base64 || null}
              />
              <ImageUploader 
                label="아빠 사진" 
                onImageUpload={handleImageUpload(setFatherPhoto)}
                preview={fatherPhoto?.base64 || null}
              />
              <ImageUploader 
                label="아기 사진" 
                onImageUpload={handleImageUpload(setBabyPhoto)}
                preview={babyPhoto?.base64 || null}
              />
            </div>
            
            <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-700 mb-4">아이 정보 입력</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">성별</label>
                        <div className="flex items-center space-x-4">
                            {(['Unspecified', 'Male', 'Female'] as const).map((g) => (
                                <label key={g} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={gender === g}
                                        onChange={() => setGender(g)}
                                        className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                    />
                                    <span>{{'Unspecified': '미지정', 'Male': '남자', 'Female': '여자'}[g]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="current-age" className="block text-sm font-medium text-slate-600 mb-2">현재 나이 (만)</label>
                        <input
                            type="number"
                            id="current-age"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
                 <h3 className="text-xl font-bold text-slate-700 mb-4">미래 나이 설정</h3>
                 <p className="text-slate-500 mb-4">보고 싶은 아이의 미래 나이를 입력해주세요. (최대 4개)</p>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {targetAges.map((age, index) => (
                         <div key={index}>
                             <label htmlFor={`target-age-${index}`} className="block text-sm font-medium text-slate-600 mb-1">{index + 1}번째 나이</label>
                             <input
                                 type="number"
                                 id={`target-age-${index}`}
                                 value={age}
                                 onChange={(e) => handleTargetAgeChange(index, e.target.value)}
                                 min="1"
                                 max="100"
                                 className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                             />
                         </div>
                     ))}
                 </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className={`px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 ease-in-out
                  ${isButtonDisabled 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 shadow-lg'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                  </span>
                ) : '미래 모습 생성하기'}
              </button>
            </div>
          </section>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8" role="alert">
              <p className="font-bold">오류</p>
              <p>{error}</p>
            </div>
          )}

          <section id="results-section">
            <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">AI가 예측한 우리 아이의 미래</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedImages.map((image, index) => (
                <ResultCard key={index} age={image.age} src={image.src} isLoading={isLoading && !image.src} />
              ))}
            </div>
            {allImagesGenerated && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleDownloadAll}
                        className="px-6 py-3 font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-50 transform hover:scale-105"
                    >
                        이미지 모아서 다운로드
                    </button>
                </div>
            )}
          </section>
        </div>
      </main>
      <footer className="text-center py-6 mt-10 border-t border-slate-200">
          <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
