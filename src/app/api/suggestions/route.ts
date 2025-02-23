import { sendResponce } from "@/lib/sendResponce";

// import { groq } from "@ai-sdk/groq";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  //   const { messages } = await req.json();
  const model = groq("deepseek-r1-distill-qwen-32b");
  try {
    const response = await generateText({
      model: model,
      messages: [
        {
          role: "user",
          content: `You're a master at crafting open-ended, thought-provoking questions 
      that spark friendly and insightful conversations. Generate a list of 5 unique, 
      engaging questions formatted in a single string, in plain text with each question separated 
      by '||'. These questions are meant for an anonymous social messaging platform 
      similar to Qooh.me and should appeal to a broad audience while avoiding personal 
      or sensitive topics. Focus on universal themes that encourage curiosity and a 
      welcoming, positive interaction. For instance, format it as: 'What’s one thing 
      that always cheers you up? || What's a skill you'd love to master? || What's 
      your all-time favorite movie quote?' Ensure each question invites friendly 
      engagement and inspires curiosity.`,
        },
      ],

      //   prompt: `You're a master at crafting open-ended, thought-provoking questions
      //   that spark friendly and insightful conversations. Generate a list of 5 unique,
      //   engaging questions formatted in a single string, with each question separated
      //   by '||'. These questions are meant for an anonymous social messaging platform
      //   similar to Qooh.me and should appeal to a broad audience while avoiding personal
      //   or sensitive topics. Focus on universal themes that encourage curiosity and a
      //   welcoming, positive interaction. For instance, format it as: 'What’s one thing
      //   that always cheers you up? || What's a skill you'd love to master? || What's
      //   your all-time favorite movie quote?' Ensure each question invites friendly
      //   engagement and inspires curiosity.`,
    });

    return sendResponce(true, "Response from model", 200, response);
  } catch (error) {
    console.error(error);
    return sendResponce(false, "Something went wrong", 500, error);
  }
}
