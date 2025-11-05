
import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseCategories, ExpenseCategory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development; in a real environment, the key should be set.
  console.warn("Gemini API key not found. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const transactionSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A brief description of the transaction. Can be empty if not specified.",
    },
    amount: {
      type: Type.NUMBER,
      description: "The numerical amount of the transaction.",
    },
    category: {
      type: Type.STRING,
      description: `The category of the expense. Must be one of: ${ExpenseCategories.join(', ')}.`,
      enum: [...ExpenseCategories],
    },
  },
  required: ["amount", "category"],
};

export interface AITransactionResponse {
  description: string;
  amount: number;
  category: ExpenseCategory;
}

export const getTransactionFromAI = async (prompt: string): Promise<AITransactionResponse | null> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following user input and extract transaction details. Classify it into one of the provided categories. If the category isn't clear, use 'Other'. The description is optional. Input: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema,
      },
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    // Basic validation
    if (
      parsedJson &&
      typeof parsedJson.amount === 'number' &&
      ExpenseCategories.includes(parsedJson.category)
    ) {
      return {
        description: parsedJson.description || '', // Default to empty string if not provided
        amount: parsedJson.amount,
        category: parsedJson.category,
      };
    }
    
    console.error("AI response validation failed:", parsedJson);
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};