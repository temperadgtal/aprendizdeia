import { useMemo } from "react";
import { ExternalLink, Loader2, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useVideoChannels } from "@/hooks/useSiteData";
import { VIDEO_CATEGORY_OPTIONS, type VideoCategory } from "@/lib/site-types";

export default function Videos() {
  const { data: channels, isLoading } = useVideoChannels();

  const grouped = useMemo(() => {
    const map: Record<VideoCategory, typeof channels> = {
      noticias: [],
      programacao: [],
      cursos: [],
      ia: [],
    };
    (channels ?? []).forEach((c) => {
      (map[c.category] ??= []).push(c);
    });
    return map;
  }, [channels]);

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
          <Youtube className="h-4 w-4" /> Vídeos
        </div>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl text-balance">Canais que eu recomendo</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Uma seleção de canais do YouTube sobre tecnologia, programação, desenvolvimento e Inteligência Artificial.
        </p>
      </header>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (channels ?? []).length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Nenhum canal cadastrado ainda.</p>
      ) : (
        <div className="space-y-12">
          {VIDEO_CATEGORY_OPTIONS.map((cat) => {
            const items = grouped[cat.value] ?? [];
            if (items.length === 0) return null;
            return (
              <section key={cat.value}>
                <h2 className="mb-4 text-xl font-bold md:text-2xl text-balance">{cat.label}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <a
                      key={c.id}
                      href={c.url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card className="h-full transition-shadow hover:shadow-md">
                        <CardContent className="flex h-full flex-col gap-2 p-5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                              <Youtube className="h-5 w-5" />
                            </span>
                            <h3 className="font-semibold leading-tight group-hover:text-primary">{c.name}</h3>
                          </div>
                          {c.description && (
                            <p className="text-sm text-muted-foreground">{c.description}</p>
                          )}
                          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-primary">
                            Abrir no YouTube <ExternalLink className="h-3 w-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
