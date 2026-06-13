import { useState } from "react";
import { Linkedin, Twitter, Mail, Link2, Check, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

export default function SocialShare({ url, title, description, compact = false }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
  const shareText = description ? `${title}\n\n${description}` : title;

  const handleCopy = async () => {
    const textToCopy = `${shareText}\n\n${fullUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const networks = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      icon: Linkedin,
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      icon: Twitter,
      color: "hover:text-foreground",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      icon: FacebookIcon,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + fullUrl)}`,
      icon: MessageCircle,
      color: "hover:text-[#25D366]",
    },
    {
      name: "E-mail",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + fullUrl)}`,
      icon: Mail,
      color: "hover:text-primary",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className={`rounded-full ${compact ? "h-9 w-9" : "gap-1.5"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="h-4 w-4" />
          {!compact && "Compartilhar"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-xl p-3"
        align={compact ? "end" : "start"}
        sideOffset={6}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {networks.map((n) => (
            <a
              key={n.name}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              title={n.name}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent ${n.color}`}
              onClick={(e) => e.stopPropagation()}
            >
              <n.icon className="h-[18px] w-[18px]" />
            </a>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            title="Copiar link"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-primary"
          >
            {copied ? <Check className="h-[18px] w-[18px] text-emerald-500" /> : <Link2 className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* Inline SVGs for brand icons not in Lucide */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
