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
  const data: RequestBody = await request.json();

  console.log(data);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(data),
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `sk-pqE-vnsaBY2-JRA1SDdZfGQMNNC3zXIXEgsJ3o2gPCT3BlbkFJBHqcPBRd3AukCx7UUrDa2SzmW4iFgI2AetGDATXPYA`,
          "Content-Type": "application/json",
        },
      }
    );

    const recommendation = response.data.choices[0].text.trim();

    return new Response(JSON.stringify({ recommendation }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error)
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
