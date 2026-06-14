import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Home, Map, LayoutGrid, BookOpen, Newspaper, Play } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import blogDevAvatar from "@/assets/blogdodev-avatar.png.asset.json";

const links = [
  { to: "/", label: "Início", end: true, icon: Home },
  { to: "/trilhas", label: "Trilhas", icon: Map },
  { to: "/plataformas", label: "Plataformas", icon: LayoutGrid },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/noticias", label: "Notícias TEC", icon: Newspaper },
  { to: "/videos", label: "Vídeos", icon: Play },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="Início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-soft text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        <a
          href="https://blogdodev.fguerra.ia.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          title="Blog do Dev"
        >
          <span className="h-7 w-7 overflow-hidden rounded-full ring-2 ring-primary/20">
            <img
              src={blogDevAvatar.url}
              alt="Blog do Dev"
              className="h-full w-full object-cover"
            />
          </span>
          Blog do Dev
        </a>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium",
                      isActive ? "bg-primary-soft text-accent-foreground" : "text-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {l.label}
                </NavLink>
              );
            })}
            <a
              href="https://blogdodev.fguerra.ia.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/60"
            >
              <span className="h-7 w-7 overflow-hidden rounded-full ring-2 ring-primary/20 shrink-0">
                <img
                  src={blogDevAvatar.url}
                  alt="Blog do Dev"
                  className="h-full w-full object-cover"
                />
              </span>
              Blog do Dev
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
