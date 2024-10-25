import OpenAI from "openai";
import { env } from "process";

export const openAi = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});
