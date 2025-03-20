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
  Guidelines:
    1. Case Sensitivity:
      - All outputs in the boilerplate should be converted to lowercase.

    2. Function Naming:
      - Extract the function name from the Title, excluding numbering (e.g., "A.", "B.", etc.).
      - Use camelCase naming style.

    3. Function Signatures:
      - Exclude "Each test case contains multiple test cases" from function signatures.take this into considerationin full boilerplate implementations.
      - Use T for test cases.

    4. Response Handling:
      - If the output is "yes" or "no", use boolean values (true/false). Convert them back to "yes" or "no" in the boilerplate.
      - In case of an array response have the user return an List or array(equivalent in each language) and then print out the array in the boilerplates and full boilerplates

    5. Main Method Naming:
      - C++: The main method should be int main().
      - Java: The main method should be public class Main.

    JSON Structure:
    The response should contain three primary objects:

      1. "boilers" – Full boilerplate implementations in each language, using "###USER CODE HERE###" as a placeholder for the function implementation. These should NOT include the function signature but must retain the function call. Only one test case is executed at a time.

      2. "fullBoilers" – Complete programs including multiple test cases. Function signatures should be included.

      3. "funcs" – Function skeletons with a "// code here" comment.

Example Input:
{
  "Title": "A. Find Largest Number",
  "inputDescription": "An array of integers.",
  "outputDescription": "The largest number in the array."
}

Example JSON Response:
{
  "boilers": {
    "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n###USER CODE HERE###\n\nint main() {\n    vector<int> arr = {3, 5, 1, 8, 2};\n    cout << findLargestNumber(arr) << endl;\n    return 0;\n}",
    
    "java": "import java.util.*;\n\npublic class Main {\n    ###USER CODE HERE###\n\n    public static void main(String[] args) {\n        int[] arr = {3, 5, 1, 8, 2};\n        System.out.println(findLargestNumber(arr));\n    }\n}",
    
    "javascript": "###USER CODE HERE###\n\nconsole.log(findLargestNumber([3, 5, 1, 8, 2]));",
    
    "python": "###USER CODE HERE###\n\nprint(find_largest_number([3, 5, 1, 8, 2]))"
  },
  
  "fullBoilers": {
    "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findLargestNumber(vector<int>& arr) {\n    ###USER CODE HERE###\n}\n\nint main() {\n    int t;\n    cin >> t;\n    while (t--) {\n        int n;\n        cin >> n;\n        vector<int> arr(n);\n        for (int i = 0; i < n; i++) cin >> arr[i];\n        cout << findLargestNumber(arr) << endl;\n    }\n    return 0;\n}",
    
    "java": "import java.util.*;\n\npublic class Main {\n    public static int findLargestNumber(int[] arr) {\n        ###USER CODE HERE###\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int t = sc.nextInt();\n        while (t-- > 0) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n            System.out.println(findLargestNumber(arr));\n        }\n        sc.close();\n    }\n}",
    
    "javascript": "function findLargestNumber(arr) {\n    ###USER CODE HERE###\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.question('', (t) => {\n    let count = 0;\n    rl.on('line', (line) => {\n        const arr = line.split(' ').map(Number);\n        console.log(findLargestNumber(arr));\n        count++;\n        if (count >= t) rl.close();\n    });\n});",
    
    "python": "def find_largest_number(arr):\n    ###USER CODE HERE###\n\nt = int(input())\nfor _ in range(t):\n    arr = list(map(int, input().split()))\n    print(find_largest_number(arr))"
  },
  
  "funcs": {
    "cpp": "int findLargestNumber(vector<int>& arr) {\n    // code here\n}",
    
    "java": "public static int findLargestNumber(int[] arr) {\n    // code here\n}",
    
    "javascript": "function findLargestNumber(arr) {\n    // code here\n}",
    
    "python": "def find_largest_number(arr):\n    # code here"
  }
}


  Generate a JSON response with three objects: "boilers", "fullBoilers"   and "funcs".
  Each object should have four keys: "cpp", "java", "javascript", and "python".

  "boilerplates": Provide full code examples in each language that demonstrate the described functionality. Include "###USER CODE HERE###" where the function would be inserted,for these make it so that only one test case will be tested at a time i.e only one input and output.
  "fullBoilers": Provide full code examples in each language that demonstrate the described functionality. Include "###USER CODE HERE###" where the function would be inserted
  "functions": Provide function skeletons i.e empty functions with comment 'code here' , in each language, matching the input and output descriptions.

  Response format:
  {
    "boilers": {
      "cpp": "...",
      "java": "...",
      "javascript": "...",
      "python": "..."
    },
    "fullBoilers": {
      "cpp": "...",
      "java": "...",
      "javascript": "...",
      "python": "..."
    }
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