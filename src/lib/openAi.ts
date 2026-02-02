import { env } from "@/env";
import OpenAI from "openai";

const apiKey = env.OPENAI_API_KEY;
export const openAi = new OpenAI({
    apiKey: apiKey
});
