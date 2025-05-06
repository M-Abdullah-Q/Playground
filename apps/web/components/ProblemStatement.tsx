"use client";
import { Card } from "@/components/ui/card";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useQuestionContext } from "@/providers/QuestionProvider";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useCodeContext } from "@/providers/CodeProvider";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const ProblemStatement = () => {
    const searchParams = useSearchParams();
    const qId = searchParams.get("q");
    const ongoing = searchParams.get("ongoing");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const descriptionRef = useRef(null);
    const inputRef = useRef(null);
    const outputRef = useRef(null);
    
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
        setOngoing
    } = useQuestionContext();
    
    const { setBoilerplates, setFullBoilerplates } = useCodeContext();
    
    // Function to properly render LaTeX in HTML content
    const renderMathContent = (content: any) => {
        if (!content) return "";
        
        // First, sanitize the content by ensuring LaTeX delimiters are properly formatted
        let sanitizedContent = content
            .replace(/\$(.*?)\$/g, (match: any, p1: any) => {
                // For inline math
                try {
                    const rendered = katex.renderToString(p1, {
                        throwOnError: false,
                        displayMode: false
                    });
                    return rendered;
                } catch (error) {
                    console.error("KaTeX error:", error);
                    return match; // Return original if there's an error
                }
            })
            .replace(/\$\$(.*?)\$\$/g, (match: any, p1: any) => {
                // For display math
                try {
                    const rendered = katex.renderToString(p1, {
                        throwOnError: false,
                        displayMode: true
                    });
                    return rendered;
                } catch (error) {
                    console.error("KaTeX error:", error);
                    return match; // Return original if there's an error
                }
            });
        
        return sanitizedContent;
    };
    
    useEffect(() => {
        if (!qId) return;
        
        async function loadQuestion() {
            try {
                const res = await axios.get(`/api/scrape/${qId}?ongoing=${ongoing || 'false'}`);
                const data = res.data;
                
                setTitle(data.title);
                setDescription(data.description);
                setTimeLimit(data.timeLimit);
                setMemoryLimit(data.memoryLimit);
                setTests(data.tests);
                setInputDescription(data.inputDescription);
                setOutputDescription(data.outputDescription);
                setOngoing(ongoing==='true');
                
                setLoading(false);
            } catch (error: any) {
                if (error.response && error.response.status !== 200) {
                    setLoading(false);
                    setShowModal(true);
                } else {
                    console.error("Error fetching question:", error);
                }
            }
        }
        
        loadQuestion();
    }, [qId, ongoing]);
    
    // Pre-process the content to properly render LaTeX
    const processedDescription = renderMathContent(description);
    const processedInputDescription = renderMathContent(inputDescription);
    const processedOutputDescription = renderMathContent(outputDescription);
    
    return (
        <>
            <Card>
                <Loader loading={loading} loadingStates={loadingStates} loop={false}></Loader>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    
                    {/* Problem Description */}
                    <div className="prose dark:prose-invert max-w-none mb-6">
                        <div 
                            ref={descriptionRef} 
                            dangerouslySetInnerHTML={{ __html: processedDescription }} 
                        />
                    </div>
                    
                    {/* Input Description */}
                    {inputDescription && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Input</h3>
                            <div 
                                className="prose dark:prose-invert max-w-none"
                                ref={inputRef}
                                dangerouslySetInnerHTML={{ __html: processedInputDescription }} 
                            />
                        </div>
                    )}
                    
                    {/* Output Description */}
                    {outputDescription && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Output</h3>
                            <div 
                                className="prose dark:prose-invert max-w-none"
                                ref={outputRef}
                                dangerouslySetInnerHTML={{ __html: processedOutputDescription }} 
                            />
                        </div>
                    )}
                </div>
            </Card>
            
            {/* Modal for unsupported question */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Uh Oh</DialogTitle>
                    </DialogHeader>
                    <p>The requested question is not supported or unavailable. Please try again.</p>
                    <Button onClick={() => router.push("/")}>Go to Home</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProblemStatement;