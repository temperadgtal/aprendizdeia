# Aprendiz de Programação — Plano

Transformar o projeto atual (um CRM) em um site pessoal estilo blog, com visual claro e limpo. O site terá área pública (visitantes) e um painel privado de administração (só você, autenticado).

## Estrutura do site

### Páginas públicas
1. **Início** — apresentação ("Aprendiz de Programação"), destaques das trilhas em andamento e últimos posts.
2. **Trilhas** — suas trilhas de programação com status e progresso.
3. **Plataformas** — cartões com links de acesso: Alura, DIO, Hashtag, Coursera, Santander e Faculdade Gran.
4. **Blog** — lista de posts e página de leitura de cada post.
5. **Notícias TEC** — notícias do mundo da tecnologia, atualizadas automaticamente.

### Painel de administração (login)
- **Login** simples (e-mail/senha) — apenas você.
- **Gerenciar trilhas** — criar, editar e excluir.
- **Gerenciar posts** — criar, editar e excluir (editor com texto rico/markdown, que já existe no projeto).
- **Gerenciar plataformas** — editar nomes e links (opcional; começam pré-cadastradas).

## Trilhas — o que cada uma mostra
- Nome do curso e plataforma
- Status: **Em andamento**, **Pretendo fazer** ou **Concluído**
- Progresso: nº de aulas concluídas / total de aulas + barra de progresso
- Datas: início e conclusão (ou prevista)
- Link para o curso

## Notícias de tecnologia (automáticas)
As notícias serão buscadas em tempo real de fontes públicas e gratuitas de tecnologia (ex.: dev.to e Hacker News), exibidas em cartões com título, resumo e link para a matéria original. Atualizam sozinhas a cada visita, sem você precisar cadastrar nada. Uma função de servidor fará a busca para manter tudo rápido e seguro.

## Visual
- Estilo **Clean claro**: fundo claro (#fafbfc), azul de destaque (#3b82f6), cinzas suaves, leitura confortável de blog.
- Fonte Outfit (já no projeto), cabeçalhos equilibrados, cartões com cantos arredondados.

## Detalhes técnicos
- **Banco de dados (Lovable Cloud)** — novas tabelas:
  - `learning_tracks` (trilhas): título, plataforma, status, aulas_concluidas, total_aulas, data_inicio, data_fim, url, descrição.
  - `posts` (blog): título, slug, resumo, conteúdo, capa, publicado, data.
  - `platforms` (plataformas): nome, url, descrição, cor/ícone, ordem.
  - Leitura pública (anon) para todas; escrita só para usuário autenticado (você), via RLS.
- **Autenticação**: e-mail/senha. Como será de uso pessoal, o cadastro pode ficar restrito (sem link público de signup), e habilitaremos a verificação de e-mail.
- **Notícias**: edge function que consome dev.to/Hacker News e devolve uma lista normalizada.
- **Limpeza**: remover páginas e componentes do CRM (Pipeline, Contacts, Companies, Deals, Forecast, Reports, Tasks, Calendar, etc.), reescrever rotas em `App.tsx`, refazer a navegação e a landing, atualizar título/SEO (`index.html`), logo e tokens de cor.

## Observação
As tabelas antigas do CRM podem permanecer no banco sem atrapalhar (não removerei dados), mas a interface passará a ser 100% do site novo. Se preferir, depois removo as tabelas não usadas.

Quando você aprovar, começo pela base de dados e autenticação, depois as páginas públicas e por fim o painel de administração e as notícias.