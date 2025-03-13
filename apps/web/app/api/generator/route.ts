// pages/api/generate.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" },{status:405});
  }

  const body = await req.json();

  const { inputDescription, outputDescription } = body;
//   console.log(inputDescription);
//   console.log(outputDescription);

  if (!inputDescription || !outputDescription) {
    return NextResponse.json({ error: "Input and output descriptions are required." },{status:400});
  }

//   console.log('recieved description')

  const genAI = new GoogleGenerativeAI(API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Input Description: ${inputDescription}
  Output Description: ${outputDescription}
  Guidelines: - make all outputs in the boilerplate to lowercase.
            - make sure the name of main method in java is Main and it is int main in cpp
            - use booleans where the outputs are yes or no and in the boilerplate turn them back to yes or no strings according to the boolean outputs 
            - ignore 'Each test case contains multiple test cases' when writing function signatures but include in case of full boilerplates
            - make the name of the function be the Title in camelcase excluding the no. such as A.,B.,etc....

  Generate a JSON response with two objects: "boilerplates" and "functions".
  Each object should have four keys: "cpp", "java", "javascript", and "python".

  "boilerplates": Provide full code examples in each language that demonstrate the described functionality. Include "###USER CODE HERE###" where the function would be inserted.
  "functions": Provide function skeletons (without implementation details) in each language, matching the input and output descriptions.

  Response format:
  {
    "boilers": {
      "cpp": "...",
      "java": "...",
      "javascript": "...",
      "python": "..."
    },
    "funcs": {
      "cpp": "...",
      "java": "...",
      "javascript": "...",
      "python": "..."
    }
  }
  `;

  try {
    // console.log('inside try');
    const result = await model.generateContent(prompt);
    // console.log('check 1');
    const response = await result.response;
    // console.log('check 2 ');
    
    let text = await response.text();
    text = text.replace(/^```json\s*/, "").replace(/```$/, "");

    try {
      const jsonResponse = JSON.parse(text);
      return NextResponse.json(jsonResponse,{status:200});
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response text:", text);
      return NextResponse.json({ error: "Failed to parse JSON response from Gemini API." },{status:500});
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate response from Gemini API." }, {status:500});
  }
}