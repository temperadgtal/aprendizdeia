import { useState } from "react";
import { Linkedin, Twitter, Mail, Link2, Check, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

export default function SocialShare({ url, title, description, compact = false }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
  const shareText = description ? `${title}\n\n${description}` : title;

  const handleCopy = async (platform?: string) => {
    const textToCopy = `${shareText}\n\n${fullUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (platform) {
        toast({ title: `Copiado!`, description: `Texto pronto para colar no ${platform}.` });
      }
    } catch {
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (platform) {
        toast({ title: `Copiado!`, description: `Texto pronto para colar no ${platform}.` });
      }
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

  const copyPlatforms = [
    { name: "Instagram", icon: InstagramIcon, color: "hover:text-[#E4405F]" },
    { name: "TikTok", icon: TikTokIcon, color: "hover:text-[#000000] dark:hover:text-white" },
    { name: "YouTube", icon: YouTubeIcon, color: "hover:text-[#FF0000]" },
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
        <div className="flex flex-col gap-2">
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
          <div className="border-t pt-2">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Copiar para</p>
            <div className="flex items-center gap-1">
              {copyPlatforms.map((p) => (
                <button
                  key={p.name}
                  onClick={(e) => { e.stopPropagation(); handleCopy(p.name); }}
                  title={`Copiar texto pronto para ${p.name}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent ${p.color}`}
                >
                  <p.icon className="h-[18px] w-[18px]" />
                </button>
              ))}
            </div>
          </div>
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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.28-1.33-3.8-3.93-3.81-6.58-.01-2.47.99-4.92 2.83-6.56 1.66-1.49 3.95-2.15 6.15-1.83.01 1.73.01 3.47.01 5.2-.71-.13-1.46-.05-2.1.29-.85.47-1.41 1.41-1.47 2.39-.12 1.18.54 2.37 1.56 2.93 1.04.59 2.41.48 3.33-.26.92-.72 1.35-1.9 1.21-3.01-.01-2.69-.01-5.38-.01-8.06z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
