"use client"
import { useState } from "react"

interface ContainerProps{
    label : string,
    value : string,
    placeholder : string
}
const Container = ({ label, value, placeholder} : ContainerProps) => {
    const [display, setDisplay] = useState(value);
    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-2">{label}</h2>
          <textarea
            className="w-full h-[calc(100%-2rem)] resize-none p-3 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={placeholder}
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
          />
        </div>
    )
}

export default Container