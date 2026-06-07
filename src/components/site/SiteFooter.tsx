import { Logo } from "@/components/Logo";

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
      </div>
    </footer>
  );
}
