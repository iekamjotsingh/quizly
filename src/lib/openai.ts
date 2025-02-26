import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('API Key missing:', import.meta.env); // For debugging
  throw new Error('OpenAI API key not configured. Please add your API key to the .env file.');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export default openai;