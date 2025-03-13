import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


interface TestType {
    input: string;
    output: string;
}

export async function POST(req: NextRequest){

    const body = await req.json();

    if(!body){
        return NextResponse.json({message : "bad request"}, {status: 500})
    }

    let {code, languageId, timeLimit, memoryLimit, tests} = body;

    // const code = body.code;
    // const languageId = body.languageId;
    timeLimit = parseFloat(body.timeLimit.split(" ")[0]);
    memoryLimit = parseInt(body.memoryLimit.split(" ")[0])*1000;
    tests = tests.map((test: TestType) => ({
        ...test,
        output: test.output.toLowerCase(),
    }));

    console.log(`${code}`);
    

    const submissions = tests.map((test: TestType,index: number) => {
        return ({
            language_id: languageId,
            source_code: btoa(code),
            stdin : btoa(test.input),
            expected_output: btoa(test.output),
            cpu_time_limit: timeLimit,
            memory_limit: memoryLimit,
        })
    })

    const postOptions = {
        method : "POST",
        url: process.env.JUDGE0_BATCHED_URL,
        params : {
            base64_encoded: 'true',
            wait: 'true'
        },
        headers: {
            'x-rapidapi-key': process.env.X_RAPID_API_KEY,
            'x-rapidapi-host': process.env.X_RAPID_API_HOST,
            'Content-Type': 'application/json'
        },
        data : {
            submissions
        }
    }

    // const {readable,writable} = new TransformStream();
    // const writer = writable.getWriter();

    // (async() => {
    //     try{
    //         const submitTokens = await axios.request(postOptions);
    //         const tokens = submitTokens.data;
    //         const tokenString = tokens.map((obj: any) => obj.token).join(',');

    //         const getOptions = {
    //             method: 'GET',
    //             url: process.env.JUDGE0_BATCHED_URL,
    //             params: {
    //               tokens: tokenString,
    //               base64_encoded: 'true',
    //               fields: '*'
    //             },
    //             headers: {
    //               'x-rapidapi-key': process.env.X_RAPID_API_KEY,
    //               'x-rapidapi-host': process.env.X_RAPID_API_HOST
    //             }
    //         };

    //         let res ;
    //         let statusFlag = false;
    //         while(!statusFlag){
    //             const response = await axios.request(getOptions);
    //             const submissionStatuses = response.data.submissions.map((sub: any) => parseInt(sub.status_id));
    //             const pendingSubmissions = submissionStatuses.filter((sub: any) => {
    //                 return sub<=2;
    //             });

    //             if(pendingSubmissions.length==0){
    //                 res = [3,4,3,3]
    //                 statusFlag = !statusFlag;
    //             }
    //             else{
    //                 await new Promise((resolve) => setTimeout(resolve, 2000));
    //             }

    //         }

    //         await writer.write(new TextEncoder().encode(`data: ${res}\n\n`));
    //         await writer.close();
    //     }
    //     catch(error){
    //         console.error(error);
    //         await writer.write(new TextEncoder().encode(`data: ${error}\n\n`));
    //         await writer.close();
    //     }
    // })();

    // return new Response(stream, {
    //     headers: {
    //         Connection: "keep-alive",
    //         "Content-Type": "text/event-stream",
    //         "Cache-Control": "no-cache",
    //     },
    // });

    try {
        const submitTokens = await axios.request(postOptions);
        const tokens = submitTokens.data;
        const tokenString = tokens.map((obj: any) => obj.token).join(',');

        // axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/result`, {
        //     params: { tokenString }
        // });
    
        // console.log("Result Response:", resultResponse.data);
    
        return NextResponse.json({tokenString});
        // return NextResponse.json(submissions,{status : 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error},{status:418});
    }

}

// export async function GET(req: NextRequest){

//     const tokenString = req.nextUrl.searchParams.get('tokenString');

//     const options = {
//         method: 'GET',
//         url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//         params: {
//           tokens: '444c025d-509a-440f-900a-f976316facc1,9dfe2cb4-9e72-4b2e-91d3-489731a1685e,ceeb98b2-a979-4c1d-80f8-f19529753d87,f67c18bf-b215-41c6-9fc0-b3f617624389',
//           base64_encoded: 'true',
//           fields: '*'
//         },
//         headers: {
//           'x-rapidapi-key': process.env.X_RAPID_API_KEY,
//           'x-rapidapi-host': process.env.X_RAPID_API_HOST
//         }
//     };

      
//     try {
//         const response = await axios.request(options);
//         return NextResponse.json(response.data)
//         console.log(response.data);
//     } 
//     catch (error) {
//         console.error(error);
//     }
// }