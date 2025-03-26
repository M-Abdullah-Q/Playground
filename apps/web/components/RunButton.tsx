"use client"
import { Button } from '../components/ui/button'
import { Play } from 'lucide-react'
import { useCodeContext } from '../providers/CodeProvider'
import { useQuestionContext } from '@/providers/QuestionProvider'
import axios from 'axios'
import { useResultContext } from '@/providers/ResultProvider'

const RunButton = () => {

  const {code, languageId, boilerplates, language, fullBoilerplates} = useCodeContext();
  const {tests, timeLimit, memoryLimit} = useQuestionContext();
  const {exec,setExec,setResult, setTokens} = useResultContext();

  const handleRun = async () => {
    // console.log(code);
    // console.log(languageId);
    // console.log(tests);
    // console.log(parseFloat(timeLimit.split(" ")[0]));
    // console.log(parseInt(memoryLimit.split(" ")[0])*1000);

    //it should send a request to the server with the given inputs and  get the tokens
    //then populate the tokenContext
    //the token context will then be used in the IOspace
    
    // console.log(code);
    // console.log( boilerplates[language].replace('###USER CODE HERE###', code));
    // console.log( fullBoilerplates[language].replace('###USER CODE HERE###', code));
    // const runCode = boilerplates?.language.replace('###USER CODE HERE###', code);
    
    const subCode = (boilerplates?.[language] || "").replace("##USER_CODE_HERE##", code || "");
    // console.log(subCode);
    // console.log(languageId);
    // console.log(tests);
    // console.log(timeLimit);
    // console.log(memoryLimit);
    
    const res = await axios.post('/api/submission',{
      subCode,
      languageId,
      tests,
      timeLimit,
      memoryLimit
    });
    setTokens(res.data.tokenString);
    setExec(true);

    // const tokenString = response.data.map(obj => obj.token).join(',');

    // const getResponse = await axios.get('/api/submission', {
    //   params: {
    //     tokenString
    //   }
    // });
    

    // const res = getResponse.data
    // const data = await response.data
    // const tokens = data.map((c: any) => c.token)
    // setTokens(tokens);
  }


  return (
        <div className="container mx-auto px-4 py-2 flex justify-center">
        <Button
          onClick={handleRun}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <Play className="h-5 w-5" />
          Run
        </Button>
      </div>
    )
}

export default RunButton