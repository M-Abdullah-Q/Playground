"use client";

import { Clipboard, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodeContext } from "@/providers/CodeProvider";
import { useState } from "react";

const CopyButton = () => {
  const { code } = useCodeContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      {copied ? (
        <>
          <ClipboardCheck className="h-4 w-4 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
};

export default CopyButton;
