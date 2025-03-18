import { env } from "@/env";
import OpenAI from "openai";

const apiKey = env.OPENAI_API_KEY;
console.log("🔑 OpenAI API Key:", apiKey);
export const openAi = new OpenAI({
    apiKey: apiKey
});
