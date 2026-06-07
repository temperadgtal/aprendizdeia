import avatar from "@/assets/aprendiz-hero.jpg.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-sm">
        <img
          src={avatar.url}
          alt="Aprendiz de Programação"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight">Aprendiz</span>
        <span className="text-[11px] font-medium text-muted-foreground">de Programação</span>
      </span>
    </span>
  );
}
