"use client"
import { Button } from '../components/ui/button'
import { Play } from 'lucide-react'
import { useCodeContext } from '../providers/CodeProvider'

const RunButton = () => {

  const {language, code, languageCode} = useCodeContext();

  const handleRun = () => {
    console.log(code);
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