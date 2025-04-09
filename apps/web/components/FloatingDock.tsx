"use client";

import { useState } from 'react';
import { Upload, Bot, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCodeContext } from '@/providers/CodeProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FloatingDock() {
  const [visible, setVisible] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isDefault, setIsDefault } = useCodeContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const fileExtension = selectedFile.name.split('.').pop();
        const languageMap: { [key: string]: string } = {
          'cpp': 'cpp',
          'js': 'javascript',
          'java': 'java',
          'py': 'python'
        };
        const language = languageMap[fileExtension || ''] || 'Unknown';

        const storedData = localStorage.getItem("uploadedCode");
        let newData = storedData ? JSON.parse(storedData): { cpp: null, java: null, javascript: null, python: null };

        if (language in newData) {
            newData[language] = content;
        }

        localStorage.setItem('uploadedCode', JSON.stringify(newData));
      }
    };
    reader.readAsText(selectedFile);
    setUploadModalOpen(false);
    setSelectedFile(null); // Reset file selection after upload
  };

  return (
    <div className='relative min-h-screen'>
      <div
        className={cn(
          "fixed right-0 top-1/4 w-3 h-10 bg-muted-foreground rounded-l cursor-pointer", 
          visible ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
        )}
        onMouseEnter={() => setVisible(true)}
      ></div>
      <div
        className={cn(
          'fixed right-2 top-1/4 flex flex-col gap-4 p-2 bg-neutral-900 rounded-lg shadow-lg transition-all',
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        )}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <button 
          className='p-3 bg-neutral-700 rounded hover:bg-gray-600'
          onClick={() => setIsDefault(!isDefault)}
        >
          <Bot size={24} color='white' />
        </button>
        <button 
          className='p-3 bg-neutral-700 rounded hover:bg-gray-600'
          onClick={() => setUploadModalOpen(true)}
        >
          <Upload size={24} color='white' />
        </button>
        <button 
          className='p-3 bg-neutral-700 rounded hover:bg-gray-600'
          onClick={() => setVisible(false)}
        >
          <X size={24} color='white' />
        </button>
      </div>
      
      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Code File</DialogTitle>
          </DialogHeader>
          <Input type="file" accept=".cpp,.js,.java,.py" onChange={handleFileChange} />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setUploadModalOpen(false)}>
                Close
            </Button>
            <Button onClick={handleFileUpload} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
