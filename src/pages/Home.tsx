import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Newspaper, BookOpen, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrackCard } from "@/components/site/TrackCard";
import { useTracks, usePosts } from "@/hooks/useSiteData";
import heroImage from "@/assets/estudando-avatar.jpg.asset.json";

export default function Home() {
  const { data: tracks } = useTracks();
  const { data: posts } = usePosts();

  const inProgress = (tracks ?? []).filter((t) => t.status === "in_progress").slice(0, 3);
  const latestPosts = (posts ?? []).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {/* Background image on the right side */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-3/4 sm:w-2/3 md:w-3/5">
          <img
            src={heroImage.url}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
          {/* Smooth gradient blend so text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 md:from-background md:via-background/75 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
        </div>

        <div className="container relative py-20 md:py-32">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-accent-foreground">
            <GraduationCap className="h-4 w-4" /> Diário de estudos em programação
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] text-balance md:text-6xl">
            Aprendiz de Programação
          </h1>
          <p className="mt-5 max-w-xl text-base font-light text-muted-foreground md:text-lg">
            Aqui eu registro minhas trilhas de estudo, compartilho posts no blog e acompanho
            as notícias do mundo da tecnologia. Tudo em um lugar só.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/trilhas">Ver minhas trilhas <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/plataformas">Minhas plataformas</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/videos"><Play className="mr-1 h-4 w-4" /> Ver últimos vídeos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trilhas em andamento */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Estudando agora</h2>
            <p className="mt-1 text-muted-foreground">Trilhas que estão em andamento.</p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/trilhas">Todas <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        {inProgress.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {inProgress.map((t) => <TrackCard key={t.id} track={t} />)}
          </div>
        ) : (
          <Card className="border-dashed bg-primary-soft/50">
            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Sparkles className="h-6 w-6" />
              </span>
              <p className="max-w-sm text-muted-foreground">
                Nenhuma trilha em andamento ainda. Que tal começar uma agora?
              </p>
              <Button asChild>
                <Link to="/trilhas">Criar primeira trilha <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Atalhos */}
      <section className="container grid gap-5 pb-16 md:grid-cols-2">
        <Link to="/blog" className="group">
          <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-110">
                <BookOpen className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Blog</h3>
                <p className="text-sm text-muted-foreground">Anotações e aprendizados da jornada.</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/noticias" className="group">
          <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-110">
                <Newspaper className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Notícias TEC</h3>
                <p className="text-sm text-muted-foreground">O que está acontecendo no mundo da tecnologia.</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Últimos posts */}
      {latestPosts.length > 0 && (
        <section className="container pb-20">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Últimos posts</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {latestPosts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`}>
                <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
                    {p.excerpt && <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
