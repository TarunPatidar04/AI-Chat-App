export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"API_KEY"}`, // Replace with your API key
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: message }],
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();
    console.log("data", data);
    return new Response(JSON.stringify(data.choices[0].message), {
      status: 200,
    });
  } catch (err) {
    console.error("OpenRouter Error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
