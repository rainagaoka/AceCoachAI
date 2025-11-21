import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the client
// API_KEY is expected to be in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "Uma pontuação de 0 a 100 baseada na técnica demonstrada.",
    },
    summary: {
      type: Type.STRING,
      description: "Um resumo conciso da performance do jogador.",
    },
    breakdown: {
      type: Type.ARRAY,
      description: "Análise detalhada de partes específicas do movimento.",
      items: {
        type: Type.OBJECT,
        properties: {
          aspect: { type: Type.STRING, description: "O aspecto técnico (ex: Toss, Postura, Impacto)." },
          status: { type: Type.STRING, enum: ["Excelente", "Bom", "Atenção", "Crítico"] },
          feedback: { type: Type.STRING, description: "Feedback técnico específico." }
        },
        required: ["aspect", "status", "feedback"]
      }
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 2-3 pontos fortes observados."
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 2-3 pontos principais para melhoria."
    },
    drillRecommendation: {
      type: Type.STRING,
      description: "Uma sugestão de exercício prático para corrigir o maior erro."
    }
  },
  required: ["overallScore", "summary", "breakdown", "strengths", "improvements", "drillRecommendation"]
};

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeTennisVideo = async (videoFile: File): Promise<AnalysisResult> => {
  try {
    const videoPart = await fileToGenerativePart(videoFile);
    
    const prompt = `
      Você é um treinador de tênis de elite com anos de experiência em biomecânica.
      Analise o vídeo anexado que mostra um movimento de tênis (provavelmente um Saque/Serve ou Forehand).
      
      Se o vídeo não for de tênis, retorne uma pontuação 0 e explique no sumário que o vídeo não parece ser de tênis.
      
      Forneça uma análise técnica detalhada focando em:
      1. Postura e preparação.
      2. Execução do movimento (Cadeia cinética).
      3. Ponto de contato.
      4. Follow-through (Terminação).
      
      Seja construtivo, direto e use terminologia correta de tênis em Português.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          videoPart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more analytical/consistent results
      }
    });

    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("No data returned from AI");
    }

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};