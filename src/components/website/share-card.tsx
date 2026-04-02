"use client";

import { Facebook, Twitter, Linkedin, Link2, Check, Share2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ShareCard() {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: "hover:bg-blue-600 hover:text-white border-blue-600 text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: "hover:bg-sky-500 hover:text-white border-sky-500 text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: "hover:bg-blue-700 hover:text-white border-blue-700 text-blue-700",
    },
  ];

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="sticky top-24 border-none shadow-sm bg-gray-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
          <Share2 className="w-5 h-5" />
          Share now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-300 font-medium ${link.color}`}
            >
              <link.icon className="w-5 h-5" />
              <span>Share on {link.name}</span>
            </a>
          ))}
          
          <Button
            variant="outline"
            className="flex items-center gap-3 px-4 py-6 rounded-lg border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-600 hover:text-primary transition-all duration-300 w-full justify-start"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-500">Link copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-5 h-5" />
                <span>Copy article link</span>
              </>
            )}
          </Button>
        </div>
        
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest pt-2">
          Spread the knowledge
        </p>
      </CardContent>
    </Card>
  );
}
