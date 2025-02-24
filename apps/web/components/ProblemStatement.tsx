"use client"
import { Card } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation';
import { useQuestionContext } from '@/providers/QuestionProvider'
import { useEffect } from 'react'
import axios from 'axios';

const ProblemStatement = () =>  {

    const searchParams = useSearchParams();
    const qId = searchParams.get('q');
    const { title, setTitle, description, setDescription, timeLimit, setTimeLimit, memoryLimit, setMemoryLimit, example, setExample, tests, setTests } = useQuestionContext()
    useEffect(() => {
        async function loadQuestion(){
            try{
                const res = await axios.get(`/api/scrape/${qId}`);
                const data = res.data;

                setTitle(data.title);
                setDescription(data.description);
                setTimeLimit(data.timeLimit);
                setMemoryLimit(data.memeoryLimit);
                setTests(data.tests);

            }
            catch(error){
                console.error(error);
            }
        }
        loadQuestion();
    },[])

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="prose dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
        </Card>
    )
}

export default ProblemStatement;