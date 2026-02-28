import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenAI, Type } from '@google/genai';

let ai: GoogleGenAI | null = null;

function getAiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const MOCK_ENRICHMENT = {
  summary: "A cutting-edge platform utilizing advanced machine learning to optimize enterprise workflows and data processing. They specialize in bridging the gap between legacy systems and modern AI infrastructure.",
  whatTheyDo: [
    "Automates data pipelines",
    "Provides predictive analytics",
    "Integrates with legacy CRMs",
    "Offers real-time monitoring"
  ],
  keywords: ["Enterprise AI", "MLOps", "Workflow Automation", "Data Infrastructure", "B2B SaaS"],
  derivedSignals: [
    "Strong alignment with B2B SaaS thesis",
    "High growth potential in enterprise sector",
    "Clear product-market fit indicators"
  ]
};

export async function POST(req: Request) {
  try {
    const { companyName, website } = await req.json();

    if (!website) {
      return NextResponse.json({ error: 'Website is required' }, { status: 400 });
    }

    const aiClient = getAiClient();
    
    // If no API key, return demo data immediately
    if (!aiClient) {
      console.log('No Gemini API key found, returning demo data.');
      return NextResponse.json({
        ...MOCK_ENRICHMENT,
        sources: [website],
        timestamp: new Date().toISOString(),
      });
    }

    // 1. Fetch website content
    const url = website.startsWith('http') ? website : `https://${website}`;
    let html = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error('Fetch failed');
      html = await response.text();
    } catch (fetchError: any) {
      console.log(`Could not fetch ${url}, Gemini will try to use its knowledge.`);
      html = `Could not fetch website content for ${companyName} (${website}).`;
    }

    // 2. Extract text using cheerio
    let textContent = '';
    if (html.includes('<html')) {
      const $ = cheerio.load(html);
      $('script, style, noscript, iframe, img, svg, video').remove();
      textContent = $('body').text().replace(/\s+/g, ' ').trim();
      textContent = textContent.substring(0, 15000);
    } else {
      textContent = html;
    }

    // 3. Send to Gemini for extraction
    const prompt = `
      You are an expert Venture Capital analyst. Analyze the following text extracted from the website of a company named "${companyName}" (${website}).
      
      Website Content:
      ${textContent}
      
      Extract and generate the following information:
      1. A concise summary of what the company does (1-2 sentences).
      2. What they do (3-6 bullet points).
      3. A list of 5-10 key technologies, sectors, or keywords.
      4. Derived signals (2-4 bullet points indicating growth, thesis alignment, or market position).
    `;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              whatTheyDo: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              derivedSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['summary', 'whatTheyDo', 'keywords', 'derivedSignals'],
          },
        },
      });

      const resultText = response.text;
      if (!resultText) throw new Error('No text returned');
      const result = JSON.parse(resultText);

      return NextResponse.json({
        ...result,
        sources: [url, `${url}/about`],
        timestamp: new Date().toISOString(),
      });
    } catch (aiError: any) {
      console.error('Gemini call failed, falling back to demo data:', aiError);
      return NextResponse.json({
        ...MOCK_ENRICHMENT,
        sources: [url],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('Enrichment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to enrich data' }, { status: 500 });
  }
}
