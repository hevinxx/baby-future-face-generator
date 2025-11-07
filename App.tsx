import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { generateFutureLooks } from './services/geminiService';
import type { ImageFile, GeneratedImage } from './types';
import { DEFAULT_TARGET_AGES } from './constants';
import { t } from './i18n';

// How It Works Icons
const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 5.293 5.293a1 1 0 001.414 0L21 17M5 21v-4a1 1 0 00-1-1H3" />
    </svg>
);

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 text-indigo-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
    <p className="text-slate-500">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {t('howItWorksTitle')}
          </h2>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-3">
          <Step
            icon={<UploadIcon />}
            title={t('howItWorksStep1Title')}
            description={t('howItWorksStep1Desc')}
          />
          <Step
            icon={<CalendarIcon />}
            title={t('howItWorksStep2Title')}
            description={t('howItWorksStep2Desc')}
          />
          <Step
            icon={<SparklesIcon />}
            title={t('howItWorksStep3Title')}
            description={t('howItWorksStep3Desc')}
          />
        </div>
      </div>
    </section>
  );
};

// Features Icons
const CpuChipIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 6.375a4.125 4.125 0 0 1 8.25 0V4.5a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v1.875a4.125 4.125 0 0 1 8.25 0v11.25a4.125 4.125 0 0 1-8.25 0V19.5a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-1.875a4.125 4.125 0 0 1-8.25 0V6.375Z" />
    </svg>
);
const ArrowPathIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75" />
    </svg>
);
const PhotoIconFeatures: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);
const ShieldCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="relative">
        <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                {icon}
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-slate-900">{title}</p>
        </dt>
        <dd className="mt-2 ml-16 text-base text-slate-500">{description}</dd>
    </div>
);

const Features: React.FC = () => {
    return (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t('featuresTitle')}</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        {t('headerSubtitle')}
                    </p>
                </div>
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    <FeatureItem
                        icon={<CpuChipIcon />}
                        title={t('featuresItem1Title')}
                        description={t('featuresItem1Desc')}
                    />
                    <FeatureItem
                        icon={<ArrowPathIcon />}
                        title={t('featuresItem2Title')}
                        description={t('featuresItem2Desc')}
                    />
                    <FeatureItem
                        icon={<PhotoIconFeatures />}
                        title={t('featuresItem3Title')}
                        description={t('featuresItem3Desc')}
                    />
                    <FeatureItem
                        icon={<ShieldCheckIcon />}
                        title={t('featuresItem4Title')}
                        description={t('featuresItem4Desc')}
                    />
                </dl>
            </div>
        </section>
    );
};

// FAQ Icons
const PlusIcon: React.FC = () => (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);
const MinusIcon: React.FC = () => (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="pt-6">
            <dt>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex w-full items-start justify-between text-left text-slate-500"
                    aria-expanded={isOpen}
                >
                    <span className="text-base font-medium text-slate-900">{question}</span>
                    <span className="ml-6 flex h-7 items-center">
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </span>
                </button>
            </dt>
            {isOpen && (
                 <dd className="mt-2 pr-12">
                    <p className="text-base text-slate-500">{answer}</p>
                </dd>
            )}
        </div>
    )
}

const FAQ: React.FC = () => {
    const faqs = [
        { q: 'faqQ1', a: 'faqA1' },
        { q: 'faqQ2', a: 'faqA2' },
        { q: 'faqQ3', a: 'faqA3' },
    ];
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-5xl py-16 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('faqTitle')}</h2>
                    <dl className="mt-6 space-y-6 divide-y divide-slate-200">
                        {faqs.map((faq, i) => (
                           <FaqItem key={i} question={t(faq.q)} answer={t(faq.a)} />
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};


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
  }, [validTargetAges]);

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
      setError(t('errorAllPhotos'));
      return;
    }
    const parsedCurrentAge = parseInt(currentAge, 10);
    if (isNaN(parsedCurrentAge) || parsedCurrentAge < 0) {
      setError(t('errorCurrentAge'));
      return;
    }
    if (validTargetAges.length === 0) {
        setError(t('errorTargetAge'));
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
      setError(t('errorGeneric'));
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

  const genderMap = {
    'Unspecified': t('genderUnspecified'),
    'Male': t('genderMale'),
    'Female': t('genderFemale')
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <HowItWorks />
      <Features />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <section id="upload-section" className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">{t('uploadFamilyPhotos')}</h2>
            <p className="text-slate-500 mb-6">{t('uploadFamilyPhotosDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploader 
                label={t('motherPhoto')} 
                onImageUpload={handleImageUpload(setMotherPhoto)} 
                preview={motherPhoto?.base64 || null}
              />
              <ImageUploader 
                label={t('fatherPhoto')} 
                onImageUpload={handleImageUpload(setFatherPhoto)}
                preview={fatherPhoto?.base64 || null}
              />
              <ImageUploader 
                label={t('babyPhoto')} 
                onImageUpload={handleImageUpload(setBabyPhoto)}
                preview={babyPhoto?.base64 || null}
              />
            </div>
             <p className="text-center text-xs text-slate-400 mt-4">{t('privacyNote')}</p>
            
            <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-700 mb-4">{t('childInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">{t('gender')}</label>
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
                                    <span>{genderMap[g]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="current-age" className="block text-sm font-medium text-slate-600 mb-2">{t('currentAge')}</label>
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
                 <h3 className="text-xl font-bold text-slate-700 mb-4">{t('setFutureAge')}</h3>
                 <p className="text-slate-500 mb-4">{t('setFutureAgeDesc')}</p>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {targetAges.map((age, index) => (
                         <div key={index}>
                             <label htmlFor={`target-age-${index}`} className="block text-sm font-medium text-slate-600 mb-1">{t('ageLabel', { index: index + 1 })}</label>
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
                    {t('generatingButton')}
                  </span>
                ) : t('generateButton')}
              </button>
            </div>
          </section>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8" role="alert">
              <p className="font-bold">{t('errorTitle')}</p>
              <p>{error}</p>
            </div>
          )}

          <section id="results-section">
            <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">{t('resultsTitle')}</h2>
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
                        {t('downloadAll')}
                    </button>
                </div>
            )}
          </section>
        </div>
      </main>
      
      <FAQ />
      
      <footer className="text-center py-8 mt-10 border-t border-slate-200 bg-slate-100">
          <div className="max-w-5xl mx-auto px-4 text-slate-500 text-sm">
             <p className="font-semibold mb-2">{t('poweredBy')}</p>
             <p>{t('footerText')}</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
