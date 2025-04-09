"use client";
import { Card } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuestionContext } from "@/providers/QuestionProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCodeContext } from "@/providers/CodeProvider";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ProblemStatement = () => {
    const searchParams = useSearchParams();
    const qId = searchParams.get("q");
    const ongoing = searchParams.get("ongoing");
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);

    const loadingStates = [
        { text: "Retrieving problem statement..." },
        { text: "Loading test cases..." },
        { text: "Generating boilerplate code..." }
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
                const res = await axios.get(`/api/scrape/${qId}?ongoing=${ongoing}`);
                const data = res.data;

                setTitle(data.title);
                setDescription(data.description);
                setTimeLimit(data.timeLimit);
                setMemoryLimit(data.memoryLimit);
                setTests(data.tests);
                setInputDescription(data.inputDescription);
                setOutputDescription(data.outputDescription);
                setLoading(false);

                // getBoiler(data.title, data.inputDescription, data.outputDescription);
            } catch (error: any) {
                if (error.response && error.response.status !== 200) {
                    setLoading(false);
                    setShowModal(true);
                } else {
                    console.error("Error fetching question:", error);
                }
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
            } catch (error) {
                console.error("Error getting from generator:", error);
            }
        }

        loadQuestion();
    }, []);

    return (
        <>
            <Card>
                <Loader loading={loading} loadingStates={loadingStates} loop={false}></Loader>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <div className="prose dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                </div>
            </Card>

            {/* Modal for unsupported question */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Uh Oh</DialogTitle>
                    </DialogHeader>
                    <p>The requested question is not supported or unavailable . Please try again.</p>
                    <Button onClick={() => router.push("/")}>Go to Home</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProblemStatement;
