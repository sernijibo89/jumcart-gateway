import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { originalPayload, downstreamError, destinationUrl } = await req.json();

    if (!originalPayload) {
      return NextResponse.json({ error: 'Missing originalPayload' }, { status: 400 });
    }

    let diagnosis = 'Automated schema normalization applied.';
    let patched = JSON.parse(JSON.stringify(originalPayload));

    // Rule 1: Type coercion: Convert string amounts to numbers
    if (patched.data && typeof patched.data.amount === 'string') {
      patched.data.amount = Number(patched.data.amount);
      diagnosis = 'Downstream rejected string amount format; coerced to numeric integer.';
    }

    // Rule 2: Schema normalization: Fix missing nested customer email
    if (patched.data && !patched.data.customer?.email && patched.email) {
      patched.data.customer = { ...patched.data.customer, email: patched.email };
      diagnosis = 'Restructured unnested email parameter to expected customer.email schema.';
    }

    // Rule 3: AI Inference (if GEMINI_API_KEY is present in environment)
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a self-healing API webhook router. Fix this JSON payload so it matches the expected schema according to the error.
Target URL: ${destinationUrl}
Original Payload:
${JSON.stringify(originalPayload)}

Error:
${JSON.stringify(downstreamError)}

Respond with ONLY valid JSON:
{
  "diagnosis": "Short explanation",
  "patched_payload": {}
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (geminiRes.ok) {
          const aiJson = await geminiRes.json();
          const parsedAi = JSON.parse(aiJson.candidates[0].content.parts[0].text);
          if (parsedAi.patched_payload) {
            patched = parsedAi.patched_payload;
            diagnosis = parsedAi.diagnosis;
          }
        }
      } catch (e) {
        // Fall back gracefully to deterministic rule outputs
      }
    }

    return NextResponse.json({
      status: 'success',
      healed: true,
      diagnosis,
      patchedPayload: patched,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
