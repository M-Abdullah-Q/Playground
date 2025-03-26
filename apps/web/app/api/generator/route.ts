import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { FullBoilerplateGenerator } from "./fullBoilerplateGenerator";
import { BoilerplateGenerator } from "./boilerplateGenerator";
import { FunctionGenerator } from "./functionGenerator";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" },{status:405});
  }

  const body = await req.json();

  const { title, inputDescription, outputDescription } = body;
//   console.log(inputDescription);
//   console.log(outputDescription);

  if (!inputDescription || !outputDescription) {
    return NextResponse.json({ error: "Input and output descriptions are required." },{status:400});
  }

//   console.log('recieved description')

  const genAI = new GoogleGenerativeAI(API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Title: ${title}
  Input Description: ${inputDescription}
  Output Description: ${outputDescription}

  Task: 
      - Analyze the input and output descriptions carefully to determine the necessary input and output fields.
      - Identify the correct data types (e.g., integer, string, list of numbers, boolean, etc.) using the following type mapping.

Type Mapping Rules:
- Integer: "int"
- Long Integer:"long long"
- Floating Point: "double"
- String: "string"
- Boolean: "bool"
- Array of Integers: "vector<int>"
- Array of Long Integers: "vector<long long>"
- Array of Floats: "vector<double>"
- Array of Strings: "vector<string>"
- Array of Booleans: "vector<bool>"


      - Ignore the test cases input if present.
      - Avoid using "T" or "t" in input feild names.
      - Convert the title into a camelCase function name by removing numbers, special characters, and extra spaces.
      - The output must be in **JSON format** following the exact response structure below.

Response Format:
{
  "title": "<camelCase function name>",
  "inputs": [
    { "type": "<input type>", "name": "<input name>" },
    { "type": "<input type>", "name": "<input name>" }
  ],
  "outputs": [
    { "type": "<output type>", "name": "<output name>" }
  ]
}

Example:
For:
Title: "A. Sum of Two Numbers"
Input Description: "Two integers a and b."
Output Description: "An integer representing their sum."

Expected Response:
{
  "title": "sumOfTwoNumbers",
  "inputs": [
    { "type": "int", "name": "a" },
    { "type": "int", "name": "b" }
  ],
  "outputs": [
    { "type": "int", "name": "sum" }
  ]
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
      const {title, inputs, outputs} = jsonResponse;

      //further processing using the input and ouput description

      const fullBoilerGen = new FullBoilerplateGenerator(title, inputs, outputs);
      const boilerGen = new BoilerplateGenerator(title, inputs, outputs);
      const funcGen = new FunctionGenerator(title, inputs, outputs);

      const res = {
        fullBoilers : {
          "cpp" : fullBoilerGen.generateCpp(),
          "java" : fullBoilerGen.generateJava(),
          "javascript" : fullBoilerGen.generateJs(),
          "python" : fullBoilerGen.generatePython()
        },
        boilers : {
          "cpp" : boilerGen.generateCpp(),
          "java" : boilerGen.generateJava(),
          "javascript" : boilerGen.generateJs(),
          "python" : boilerGen.generatePython()
        },
        funcs : {
          "cpp" : funcGen.generateCpp(),
          "java" : funcGen.generateJava(),
          "javascript" : funcGen.generateJs(),
          "python" : funcGen.generatePython()
        }
      }



      return NextResponse.json(res,{status:200});
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

// import { OpenAI } from "openai";
// import { NextRequest, NextResponse } from "next/server";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req: NextRequest) {
//   if (req.method !== "POST") {
//     return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//   }

//   const body = await req.json();
//   const { inputDescription, outputDescription } = body;

//   if (!inputDescription || !outputDescription) {
//     return NextResponse.json(
//       { error: "Input and output descriptions are required." },
//       { status: 400 }
//     );
//   }

//   const prompt = `
//   Input Description: ${inputDescription}
//   Output Description: ${outputDescription}
//   Guidelines:
//     1. Case Sensitivity:
//       - All outputs in the boilerplate should be converted to lowercase.

//     2. Function Naming:
//       - Extract the function name from the Title, excluding numbering (e.g., "A.", "B.", etc.).
//       - Use camelCase naming style.

//     3. Function Signatures:
//       - Exclude "Each test case contains multiple test cases" from function signatures.
//       - Use T for test cases.

//     4. Response Handling:
//       - If the output is "yes" or "no", use boolean values (true/false). Convert them back to "yes" or "no" in the boilerplate.
//       - In case of an array response, have the user return a List or array (equivalent in each language) and then print out the array in the boilerplates.

//     5. Main Method Naming:
//       - C++: The main method should be int main().
//       - Java: The main method should be public class Main.

//   JSON Structure:
//   The response should contain three primary objects:
//     1. "boilers" – Full boilerplate implementations in each language, using "###USER CODE HERE###" as a placeholder for the function implementation. Only one test case is executed at a time.
//     2. "fullBoilers" – Complete programs including multiple test cases. Function signatures should be included.
//     3. "funcs" – Function skeletons with a "// code here" comment.
  
//   Response format:
//   {
//     "boilers": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." },
//     "fullBoilers": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." },
//     "funcs": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." }
//   }
//   `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "system", content: "You are a helpful assistant that generates structured JSON responses." },
//                  { role: "user", content: prompt }],
//       response_format: {type : "json_object"}
//     });

//     const text = completion.choices[0].message.content ?? "";

//     try {
//       const jsonResponse = JSON.parse(text);
//       return NextResponse.json(jsonResponse, { status: 200 });
//     } catch (parseError) {
//       console.error("Error parsing JSON response:", parseError);
//       console.log("Raw response text:", text);
//       return NextResponse.json({ error: "Failed to parse JSON response from Generator." }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return NextResponse.json({ error: "Failed to generate response from Generator." }, { status: 500 });
//   }
// }
