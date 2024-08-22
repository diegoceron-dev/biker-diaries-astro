import type { APIRoute } from "astro";
import axios from "axios";


interface RequestBody {
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  weather: string;
  destination: string;
}

export const POST: APIRoute = async ({ request }) => {
  console.clear();
  
  let data: RequestBody;
  try {
    data = await request.json();
    console.log("Request Data:", data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: generatePrompt(data)
          }
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer`, //${ import.meta.env.GITHUB_CLIENT_SECRET.OPENAI_API_KEY}
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    const recommendation = response.data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ recommendation }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    return new Response(
      JSON.stringify({ error: "Error generating recommendation" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
};

const generatePrompt = ({
  eventTitle,
  eventStart,
  eventEnd,
  weather,
  destination,
}: RequestBody) => {
  return `Genera una recomendación para el evento "${eventTitle}" que ocurre desde ${eventStart} hasta ${eventEnd}. El clima será ${weather}. El destino es ${destination}.`;
};
