# Baby Future Face Generator

An AI-powered web application that generates photorealistic predictions of how a baby might look at different ages, based on photos of the mother, father, and baby. Built with React and powered by Google Gemini's advanced image generation model.

![Baby Future Face Generator](https://github.com/user-attachments/assets/d9e906b9-f314-4e2c-b307-a2da469bc853)

## Features

- **AI-Powered Predictions**: Uses Google Gemini 2.5 Flash Image model to generate realistic future face predictions
- **Multiple Age Predictions**: Generate up to 4 different age predictions in one session
- **Customizable Parameters**:
  - Specify the baby's current age
  - Choose target ages for prediction (1-100 years)
  - Optional gender specification for more accurate results
- **Batch Download**: Download all generated images as a single collage
- **Bilingual Support**: Full internationalization with English and Korean languages
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Generation**: Live progress indicators during AI image generation

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **AI Model**: Google Gemini 2.5 Flash Image
- **Styling**: Tailwind CSS
- **Internationalization**: Custom i18n implementation

## Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baby-future-face-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**

   Create a `.env.local` file in the project root and add your Gemini API key:
   ```
   API_KEY=your_gemini_api_key_here
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

1. **Upload Photos**: Upload clear photos of the mother, father, and baby
2. **Enter Information**:
   - Specify the baby's current age
   - Optionally select the baby's gender for more accurate predictions
3. **Set Target Ages**: Enter up to 4 different ages you want to see predictions for
4. **Generate**: Click "Generate Future Face" to start the AI generation process
5. **Download**: Once generated, download individual images or all images as a collage

## Project Structure

```
baby-future-face-generator/
├── components/           # React components
│   ├── Header.tsx       # App header with title
│   ├── ImageUploader.tsx # Photo upload component
│   └── ResultCard.tsx   # Display generated image cards
├── services/            # Business logic
│   └── geminiService.ts # Google Gemini API integration
├── locales/             # Internationalization
│   ├── en.json         # English translations
│   └── ko.json         # Korean translations
├── App.tsx             # Main application component
├── i18n.ts             # i18n configuration
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application constants
└── vite.config.ts      # Vite configuration
```

## How It Works

The application uses Google's Gemini 2.5 Flash Image model to analyze the facial features of both parents and the current baby photo. It then generates photorealistic predictions by:

1. **Feature Analysis**: Analyzing facial features from all three input images
2. **Age Progression**: Applying age progression algorithms to predict facial changes
3. **Genetic Blending**: Combining parental features with the baby's current appearance
4. **Photorealistic Rendering**: Generating high-resolution, realistic images

Each prediction is generated independently, allowing for multiple age predictions in parallel.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

- `API_KEY` - Google Gemini API key (required)

## Notes

- Image generation quality depends on the input photo quality
- Clear, well-lit, front-facing photos work best
- Generation time varies based on the number of target ages selected
- The AI provides predictions based on facial features and age progression algorithms, but actual appearance may vary
