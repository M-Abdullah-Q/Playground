"use client";
import { useState, useEffect, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { useResultContext } from "@/providers/ResultProvider";
import axios from "axios";


interface Test{
  input: string,
  output: string 
}


const TestResult = ({tests}: {tests: Test[]}) => {

  const {result,setResult,exec,setExec,results, setResults, tokens,setTokens} = useResultContext();

  // const [results,setResults] = useState<number[] | null>(null);
  // const memoizedResults = useMemo(() => results, [results]);

  useEffect(() => {
    async function sse(){
      if(!exec) return;

      const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BASE_URL}/api/result?tokens=${tokens}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data);
        setResults(data);
        setResult(true);
        setExec(false);
        eventSource.close();
        // console.log('closed eventsource');
      };

      eventSource.onerror = () => {
        setExec(false);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }

    sse();
  }, [tokens]);


  return(
    <div className="min-h-[300px]">
      {result? <Tabs defaultValue="test-0" className="h-[250px] overflow-hidden">
        <div className="relative">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none rounded-lg" style={{ 
            WebkitOverflowScrolling: 'touch', 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none' 
          }}>
            <TabsList className="flex space-x-2 min-w-max">
              {tests.map((_, index) => (
                <TabsTrigger key={index} value={`test-${index}`} className="text-sm px-4" style={{backgroundColor: results?.statuses?.[index]===3? 'green' : 'red', filter: 'brightness(50%)'}}>
                  Test {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <div className="mt-4 max-h-[180px] overflow-y-auto whitespace-nowrap scrollbar-none rounded-lg" style={{ 
            WebkitOverflowScrolling: 'touch', 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none' 
          }}>
          {tests.map((test, index) => (
            <TabsContent key={index} value={`test-${index}`}>
              <div className="p-4 rounded-md bg-muted border border-border">
                <p className="font-semibold text-sm">Input:</p>
                <textarea
                  value={test.input}
                  readOnly
                  className="w-full h-[80px] bg-background text-foreground p-2 rounded-md font-mono border border-border resize-none"
                />
                <p className="font-semibold text-sm mt-2">Your Output:</p>
                <textarea 
                  className="w-full h-[40px] bg-background text-foreground p-2 rounded-md font-mono border border-border flex items-center resize-none"
                  readOnly
                  value={results?.stdout?.[index]}
                >
                  {/* {test.output} */}
                </textarea>
                <p className="font-semibold text-sm mt-2">Expected Output:</p>
                <textarea 
                  className="w-full h-[40px] bg-background text-foreground p-2 rounded-md font-mono border border-border flex items-center resize-none"
                  readOnly
                  value={test.output}
                >
                  {/* {test.output} */}
                </textarea>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs> : 
        exec ? 
          <div>
            <Skeleton className="h-[200px] w-auto rounded-xl" />
          </div> : 
          <div className="flex justify-center items-center h-full min-h-[300px]">No Test Results to be displayed</div>
      }
    </div>
  )
}

export default TestResult;