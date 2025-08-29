import { GoogleGenAI, Type } from "@google/genai";
import type { VocabularyEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const vocabularyEntrySchema = {
  type: Type.OBJECT,
  properties: {
    koreanWord: {
      type: Type.STRING,
      description: "The original Korean word.",
    },
    vietnameseWord: {
      type: Type.STRING,
      description: "The Vietnamese translation of the Korean word.",
    },
    vietnamesePOS: {
      type: Type.STRING,
      description: "The part of speech of the Vietnamese word, in Vietnamese (e.g., 'danh từ' for noun, 'động từ' for verb).",
    },
    vietnameseExplanation: {
      type: Type.STRING,
      description: "An explanation of the word in Vietnamese, suitable for a TOPIK 2 level learner, within the context of caregiving in Korea.",
    },
    koreanExplanation: {
      type: Type.STRING,
      description: "A Korean explanation that is a direct or near-direct translation of the Vietnamese explanation, focusing on the caregiver context.",
    },
  },
  required: ["koreanWord", "vietnameseWord", "vietnamesePOS", "vietnameseExplanation", "koreanExplanation"],
};

const schema = {
  type: Type.ARRAY,
  items: vocabularyEntrySchema
};

export const generateVocabulary = async (koreanTerms: string): Promise<VocabularyEntry[]> => {
  const prompt = `You are an expert linguist specializing in creating educational materials for Vietnamese caregivers learning Korean. Your task is to generate a vocabulary list based on the provided Korean terms.

  Follow these rules STRICTLY:
  1.  **Context:** The definitions must be specific to the Korean caregiver certification exam and practical work. Do not use general dictionary definitions. For example, for "65세 이상" (65 years or older), the explanation should be related to eligibility for long-term care insurance.
  2.  **Translation:** Provide the most accurate and officially used Vietnamese translation.
  3.  **Part of Speech (POS):** For each Vietnamese word, provide its part of speech in Vietnamese (e.g., danh từ, động từ, tính từ).
  4.  **Vietnamese Explanation:** The explanation must be simple, clear, and easy for a TOPIK 2 level student to understand. It should define the word's meaning in the caregiving context. Do not repeat the word being defined in the explanation.
  5.  **Korean Explanation:** This must be a direct or near-direct translation of the Vietnamese explanation.
  6.  **Input:** The user will provide a list of Korean terms. Process each term.

  Here are the Korean terms to process:
  "${koreanTerms}"

  Generate a JSON array where each object corresponds to a Korean term and follows the specified schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    // In case the API wraps the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedData = JSON.parse(cleanedJsonText);
    return parsedData as VocabularyEntry[];

  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
