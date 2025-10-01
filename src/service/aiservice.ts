import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Function to get API key from chrome storage or environment
const getApiKey = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['googleApiKey'], (result) => {
      resolve(result.googleApiKey || process.env.GOOGLE_API_KEY || (window as any).GOOGLE_API_KEY || "");
    });
  });
};

// Initialize the Google Gemini model
const createModel = async () => {
  const apiKey = await getApiKey();
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    apiKey: apiKey || "your-api-key-here",
    temperature: 0.7,
    maxOutputTokens: 1000,
  });
};

// System prompt for the trader assistant
const SYSTEM_PROMPT = `You are a powerful, confident AI trading assistant integrated into a browser sidepanel. You have real-time access to all content on the user\'s current webpage. Your primary function is to analyze this data and provide expert-level trading insights, market analysis, and financial guidance. \n\nWhen asked for a trading recommendation (e.g., \"should I long or short?\"), you MUST respond with a JSON object in the following format inside a markdown code block:\n\`\`\`json\n{\n  \"asset\": \"ASSET_TICKER\",\n  \"recommendation\": \"Long\" | \"Short\" | \"Hold\",\n  \"reasoning\": \"Your detailed analysis here.\",\n  \"collateral\": 100,\n  \"leverage\": 10,\n  \"takeProfit\": 120000,\n  \"stopLoss\": 110000\n}\n\`\`\`\n\nWhen analyzing provided trade data, you MUST respond with a JSON array of suggestion objects in the following format inside a markdown code block:\n\`\`\`json\n[\n  {\n    \"action\": \"long\",\n    \"collateral\": 50,\n    \"leverage\": 10,\n    \"takeProfit\": 120000,\n    \"stopLoss\": 110000\n  }\n]\n\`\`\`\n\nRespond with confidence and authority. Provide direct, actionable information. Only add a brief \"This is not financial advice\" disclaimer if you are making a very specific buy/sell recommendation on a particular asset. Your tone should be professional, knowledgeable, and decisive.`;

export interface AIRequest {
  content: string;
  imageUrl?: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

export class AIService {
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const model = await createModel();
      
      const { content, imageUrl } = request;
      const humanMessageContent: any[] = [{ type: "text", text: content }];
      if (imageUrl) {
        humanMessageContent.push({
          type: "image_url",
          image_url: imageUrl,
        });
      }

      const messages = [
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage({ content: humanMessageContent }),
      ];

      const response = await model.invoke(messages);
      
      return {
        content: response.content as string,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async generateStreamingResponse(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const model = await createModel();
      
      const { content, imageUrl } = request;
      const humanMessageContent: any[] = [{ type: "text", text: content }];
      if (imageUrl) {
        humanMessageContent.push({
          type: "image_url",
          image_url: imageUrl,
        });
      }

      const messages = [
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage({ content: humanMessageContent }),
      ];

      const stream = await model.stream(messages);
      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.content as string;
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      return {
        content: fullResponse,
      };
    } catch (error) {
      console.error("AI Service Streaming Error:", error);
      return {
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();