"use client";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuestionContext } from "@/providers/QuestionProvider";
import Testcases from "./Testcases";
import TestResult from "./TestResults";

const IOspace = () => {
  const { tests } = useQuestionContext();

  return (
    <Card className="p-6 bg-background text-foreground shadow-md rounded-lg">
      <Tabs defaultValue="testCases" className="w-full">
        {/* Tab buttons */}
        <TabsList className="flex space-x-2">
          <TabsTrigger value="testCases">Test Cases</TabsTrigger>
          <TabsTrigger value="testResults">Test Results</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="testCases">
          <Testcases tests={tests} />
        </TabsContent>

        <TabsContent value="testResults">
          <TestResult tests={tests} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default IOspace;
