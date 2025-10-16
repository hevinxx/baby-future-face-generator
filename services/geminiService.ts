
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { ImageFile, GeneratedImage, GeminiImageInput } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const convertToGeminiInput = (imageFile: ImageFile): GeminiImageInput => {
    const base64Data = imageFile.base64.split(',')[1];
    return {
        mimeType: imageFile.mimeType,
        data: base64Data,
    };
};

const generateSingleFutureLook = async (
  motherImage: GeminiImageInput,
  fatherImage: GeminiImageInput,
  babyImage: GeminiImageInput,
  targetAge: number,
  gender: 'Male' | 'Female' | 'Unspecified',
  currentAge: number
): Promise<string> => {
  const motherImagePart: Part = { inlineData: motherImage };
  const fatherImagePart: Part = { inlineData: fatherImage };
  const babyImagePart: Part = { inlineData: babyImage };
  
  let genderText = '';
  if (gender === 'Male') {
      genderText = 'The baby is a boy.';
  } else if (gender === 'Female') {
      genderText = 'The baby is a girl.';
  }

  const textPart: Part = {
    text: `Using the three provided images (mother, father, baby), generate a photorealistic image of what the baby might look like at ${targetAge} years old. The baby is currently approximately ${currentAge} years old. ${genderText} Ensure the output is only the generated image of the child's face, with features blended from all three input images. The generated image should be high-resolution and realistic.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [motherImagePart, fatherImagePart, babyImagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error(`API did not return an image for age ${targetAge}.`);
};

export const generateFutureLooks = async (
    motherFile: ImageFile,
    fatherFile: ImageFile,
    babyFile: ImageFile,
    targetAges: number[],
    gender: 'Male' | 'Female' | 'Unspecified',
    currentAge: number
): Promise<GeneratedImage[]> => {
    const motherInput = convertToGeminiInput(motherFile);
    const fatherInput = convertToGeminiInput(fatherFile);
    const babyInput = convertToGeminiInput(babyFile);

    const promises = targetAges.map(age => 
        generateSingleFutureLook(motherInput, fatherInput, babyInput, age, gender, currentAge)
            .then(src => ({ age, src }))
            .catch(error => {
                console.error(`Failed to generate image for age ${age}:`, error);
                return { age, src: null }; // Return null on failure for this specific age
            })
    );

    return Promise.all(promises);
};
