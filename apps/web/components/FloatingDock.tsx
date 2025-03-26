"use client"

import { useState } from 'react';
import { Upload, Bot, Settings, Code2, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingDock() {
  const [visible, setVisible] = useState(false);

  return (
    <div className='className="relative min-h-screen'>
        <div
        className="fixed right-0 top-1/4 w-3 h-10 bg-neutral-900 rounded-l cursor-pointer"
        onMouseEnter={() => setVisible(true)}
      ></div>
        <div
            className={cn(
                'fixed right-2 top-1/4 flex flex-col gap-4 p-2 bg-neutral-900 rounded-lg shadow-lg transition-all',
                visible ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-full'
            )}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <button className='p-3 bg-neutral-700 rounded hover:bg-gray-600'>
                <Bot size={24} color='white' />
                {/* <div>Beta</div> */}
            </button>
            <button className='p-3 bg-neutral-700 rounded hover:bg-gray-600'>
                <Play size={24} color='white' />
            </button>
            <button className='p-3 bg-neutral-700 rounded hover:bg-gray-600'>
                <Settings size={24} color='white' />
            </button>
            <button className='p-3 bg-nutral-700 rounded hover:bg-gray-600'>
                <X size={24} color='white' />
            </button>
        </div>
    </div>
  );
}
