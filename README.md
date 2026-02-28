## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

AI ENRICHMENT DETAIL:

The AI Enrichment feature works through a combination of live web scraping and Generative AI (Gemini).
Here is a step-by-step breakdown of how the backend (/app/api/enrich/route.ts) processes the request when you click the "Enrich Profile" button:

1. The Request
When you click the button on the frontend, it sends a POST request to the Next.js API route (/api/enrich) containing the company's name and website domain.

2. Live Web Scraping
The backend attempts to visit the company's website in real-time.
It uses the native fetch API to download the raw HTML of the website.
It then uses a library called cheerio (a server-side implementation of jQuery) to parse the HTML.
It strips out all the unnecessary code like <script>, <style>, <video>, and <img> tags, extracting only the readable text from the <body>.
It truncates this text to 15,000 characters to ensure it processes quickly and efficiently.

3. AI Processing (Gemini API)
Once the backend has the raw text from the website, it constructs a prompt and sends it to the Gemini API (specifically the gemini-3-flash-preview model).
The Prompt: It tells Gemini: "You are an expert Venture Capital analyst. Analyze the following text extracted from the website... Extract a summary, what they do, keywords, and derived signals."
Structured Output: To ensure the frontend doesn't break, the backend uses Gemini's responseSchema feature. This forces the AI to return the exact JSON structure the UI expects (arrays for bullet points, strings for summaries), rather than unpredictable plain text.

4. Frontend Display & Caching
The backend sends this perfectly formatted JSON back to the frontend.
The frontend displays the data in the UI.
Caching: To save API costs and make the app feel instantly responsive, the frontend saves this enrichment data into your browser's localStorage. If you navigate away from the company and come back, it loads the cached AI analysis instantly instead of scraping the site again.

5. Fallback Mechanism
If a website has strong anti-bot protection (blocking the scraper), or if the Gemini API key is missing/fails, the backend has a try/catch block that gracefully falls back to returning a highly realistic MOCK_ENRICHMENT object. This ensures the UI never crashes and always shows you something.
