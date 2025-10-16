
export interface ImageFile {
  base64: string;
  file: File;
  mimeType: string;
}

export interface GeneratedImage {
  age: number;
  src: string | null;
}

export interface GeminiImageInput {
  mimeType: string;
  data: string;
}
