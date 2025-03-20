"use client";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useQuestionContext } from "@/providers/QuestionProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCodeContext } from "@/providers/CodeProvider";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

const ProblemStatement = () => {
    const searchParams = useSearchParams();
    const qId = searchParams.get("q");

    const [loading,setLoading] = useState<boolean>(true);

    const loadingStates = [
        {
            text: "Retrieving problem statement..."
        },
        {
            text: "Loading test cases..."
        },
        {
            text: "Generating boilerplate code..."
        }
    ];
    

    const {
        title,
        setTitle,
        description,
        setDescription,
        setTimeLimit,
        setMemoryLimit,
        inputDescription,
        setInputDescription,
        outputDescription,
        setOutputDescription,
        setTests,
    } = useQuestionContext();

    const { boilerplates, setBoilerplates, functions, setFunctions, setFullBoilerplates } = useCodeContext();

    useEffect(() => {
        if (!qId) return;

        async function loadQuestion() {
            try {
                const res = await axios.get(`/api/scrape/${qId}`);
                const data = res.data;

                setTitle(data.title);
                setDescription(data.description);
                setTimeLimit(data.timeLimit);
                setMemoryLimit(data.memoryLimit);
                setTests(data.tests);
                setInputDescription(data.inputDescription);
                setOutputDescription(data.outputDescription);
                setLoading(false);

                getBoiler(data.title, data.inputDescription, data.outputDescription);
                
            } catch (error) {
                console.error("Error fetching question:", error);
            }
        }

        async function getBoiler(title: string, inputDesc: string, outputDesc: string) {
            if (!title || !inputDesc || !outputDesc) return;

            try {
                const res = await axios.post("/api/generator", {
                    title,
                    inputDescription: inputDesc,
                    outputDescription: outputDesc,
                });

                const { boilers, fullBoilers, funcs } = res.data;
                setBoilerplates(boilers);
                setFunctions(funcs);
                setFullBoilerplates(fullBoilers);
                // console.log("Updated Boilerplates:", boilerplates);
                // console.log("Updated Functions:", functions);
                
            } catch (error) {
                console.error("Error getting from generator:", error);
            }
        }

        loadQuestion();
    }, []);

    return (
        <Card>
            <Loader loading={loading} loadingStates={loadingStates} loop={false}></Loader>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div className="prose dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>
        </Card>
    );
};

export default ProblemStatement;
