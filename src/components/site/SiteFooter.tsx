import { Logo } from "@/components/Logo";
import blogDevAvatar from "@/assets/blogdodev-avatar.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <div className="text-sm text-muted-foreground">
          <p>
            Aprendiz de Programação – Diário de estudos em programação de Alexandre Guerra.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} Estudando todos os dias.
          </p>
        </div>
        <a
          href="https://blogdodev.fguerra.ia.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <span className="h-6 w-6 overflow-hidden rounded-full ring-2 ring-primary/20">
            <img
              src={blogDevAvatar.url}
              alt="Blog do Dev"
              className="h-full w-full object-cover"
            />
          </span>
          Visite também o Blog do Dev
        </a>
      </div>
    </footer>
  );
}
