# Marcador

Site para descobrir filmes, séries e animes, com catálogo, busca e páginas de detalhes (inspirado em Letterbox e Backloggd, em versão simplificada). Projeto da Atividade Avaliativa A3 de Usabilidade, Desenvolvimento Web, Mobile e Jogos Digitais.

Tecnologias: HTML, CSS, JavaScript puro e Bootstrap 5.3.
APIs: **TMDB** (filmes e séries) e **Jikan** (animes, dados do MyAnimeList).

---

## Estrutura de pastas

```
projeto/
├── index.html            Redireciona para pages/home.html
├── README.md
├── pages/
│   ├── home.html
│   ├── filmes.html              (modelo de layout para as outras categorias)
│   ├── filme-detalhes.html      (a fazer)
│   ├── series.html              (a fazer)
│   ├── serie-detalhes.html      (a fazer)
│   ├── animes.html              (a fazer)
│   └── anime-detalhes.html      (a fazer)
├── styles/
│   └── global.css        Único CSS do projeto
└── scripts/
    ├── home.js           JS da home
    ├── filmes.js         JS da página de filmes
    └── (um JS por página, criado por quem desenvolve)
```

### Regras da organização(podem mudar se não gostarem de algo)

- Todas as páginas ficam em `pages/`. O `index.html` da raiz só redireciona.
- Existe **um único CSS** (`styles/global.css`). Cada pessoa adiciona seus estilos em uma seção própria, com um comentário de título, para evitar conflito no Git.
- **Cada página tem seu JS** em `scripts/` (por exemplo `filmes.js`). Não há script compartilhado, então cada arquivo é independente.
- Os caminhos dentro de `pages/` sempre começam com `../` (exemplo: `../styles/global.css`).

---

### Nomes dos arquivos

A home e a navbar já apontam para estes nomes. Se algum mudar, atualizem a navbar de todas as páginas e o objeto `paginas` do `home.js`.

| Página | Arquivo |
|---|---|
| Início | `home.html` |
| Catálogo de filmes | `filmes.html` |
| Detalhes do filme | `filme-detalhes.html` |
| Catálogo de séries | `series.html` |
| Detalhes da série | `serie-detalhes.html` |
| Catálogo de animes | `animes.html` |
| Detalhes do anime | `anime-detalhes.html` |

### Parâmetros de URL

A home envia o usuário para as outras páginas assim:

- Detalhes: `filme-detalhes.html?id=123` (nas séries é o ID da TMDB, nos animes é o `mal_id` do Jikan)
- Busca: `filmes.html?busca=matrix`

Para ler esses valores na página de destino:

```js
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const busca = params.get("busca");
```

Se `busca` existir, a página de catálogo deve já mostrar os resultados dessa busca.


---

## Modelo de uma nova página

```html
<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Filmes — LetterMoe</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="../styles/global.css" rel="stylesheet">
</head>
<body>
  <!-- navbar copiada do filmes.html (mude o "active") -->

  <main class="container secao cat-filmes">
    <!-- conteúdo da página -->
  </main>

  <!-- rodapé  -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../scripts/filmes.js"></script>
</body>
</html>
```

---

## Classes prontas no `global.css`

| Classe | Para que serve |
|---|---|
| `cat-filmes`, `cat-series`, `cat-animes` | Define a cor da categoria (variável `--cat`). Coloque no `<section>` ou `<main>` da página. |
| `titulo-card` | Link do card de um título. Dentro dele: `img.poster`, `p.nome` e `p.meta`. |
| `poster` | Imagem do pôster com proporção 2:3. |
| `nota` | Texto da nota, na cor de destaque. |
| `secao` | Espaçamento vertical entre seções. |
| `secao-topo` | Cabeçalho da seção com a barra na cor da categoria. |
| `btn-accent` | Botão principal (amarelo). |
| `card` | Caixa do Bootstrap já no tema do projeto. |

Cores disponíveis como variáveis CSS: `--fundo`, `--superficie`, `--linha`, `--texto`, `--texto-suave`, `--amarelo`, `--azul`, `--rosa`.

Modelo de card (o mesmo usado no filmes.html):

```html
<div class="col">
  <a class="titulo-card" href="filme-detalhes.html?id=603">
    <img class="poster" src="..." alt="Pôster de Matrix" loading="lazy">
    <p class="nome">Matrix</p>
    <p class="meta mb-0"><span class="nota"><i class="bi bi-star-fill"></i> 8.2</span> · 1999</p>
  </a>
</div>
```

Grid usado nos catálogos: `row row-cols-2 row-cols-sm-3 row-cols-lg-6 g-3`.

---

## Endpoints úteis

### TMDB (base `https://api.themoviedb.org/3`)

Sempre com `api_key=SUA_CHAVE` e `language=pt-BR`.

| Uso | Endpoint |
|---|---|
| Filmes em alta | `/trending/movie/week` |
| Buscar filmes | `/search/movie?query=matrix` |
| Filmes por gênero | `/discover/movie?with_genres=28&page=1` |
| Lista de gêneros de filmes | `/genre/movie/list` |
| Detalhes do filme | `/movie/{id}` |
| Elenco e equipe | `/movie/{id}/credits` |
| Trailers | `/movie/{id}/videos` |
| Séries em alta | `/trending/tv/week` |
| Buscar séries | `/search/tv?query=dark` |
| Séries por gênero | `/discover/tv?with_genres=18` |
| Lista de gêneros de séries | `/genre/tv/list` |
| Detalhes da série (inclui temporadas) | `/tv/{id}` |
| Elenco da série | `/tv/{id}/credits` |

Imagens: `https://image.tmdb.org/t/p/w342` + `poster_path` (pôster) ou `https://image.tmdb.org/t/p/w1280` + `backdrop_path` (fundo). Tamanhos comuns: `w185`, `w342`, `w500`, `w780`, `w1280`.

### Jikan (base `https://api.jikan.moe/v4`)

| Uso | Endpoint |
|---|---|
| Top animes | `/top/anime?limit=12&sfw=true` |
| Buscar animes | `/anime?q=naruto&sfw=true&page=1` |
| Detalhes do anime | `/anime/{mal_id}/full` |
| Personagens | `/anime/{mal_id}/characters` |
| Episódios | `/anime/{mal_id}/episodes` |
| Lista de gêneros | `/genres/anime` |
| Animes por gênero | `/anime?genres=1&order_by=score&sort=desc` |

Os dados do Jikan vêm dentro de `resposta.data`. Campos mais usados: `mal_id`, `title`, `title_english`, `images.jpg.large_image_url`, `score`, `synopsis`, `year`, `episodes`, `genres`. As sinopses vêm em inglês.

> **Limite do Jikan:** cerca de 3 requisições por segundo e 60 por minuto. Evite disparar várias chamadas seguidas (por exemplo, uma por card). Prefira uma chamada que já retorne a lista, e confirme os limites atuais em <https://docs.api.jikan.moe>.

---

## Dicas para desenvolver as páginas

### Catálogo (`filmes.html`, `series.html`, `animes.html`)

- Campo de busca e filtro por gênero (um `<select>` preenchido pela API de gêneros).
- Grid de cards com a classe `titulo-card`.
- Botão "Carregar mais" que incrementa o `page` da API, ou paginação do Bootstrap.
- Ler `?busca=` ao abrir a página (veja "Parâmetros de URL").
- Mostrar uma mensagem quando a busca não retornar nada: diga o que aconteceu e o que fazer ("Nenhum filme encontrado. Tente outro nome.").

### Detalhes (`filme-detalhes.html`, `serie-detalhes.html`, `anime-detalhes.html`)

- Ler o `id` da URL e buscar os detalhes na API.
- Mostrar pôster, título, sinopse, nota, ano, duração ou episódios, gêneros (com `badge` do Bootstrap) e elenco.
- Botão "Ver trailer" que abre um **modal** do Bootstrap com o vídeo (TMDB: `/movie/{id}/videos`, que retorna a chave do YouTube; Jikan: `trailer.embed_url`). Ao fechar o modal, limpe o `src` do iframe para o vídeo parar.
- Seções de elenco ou personagens em **cards** e, nas séries, as temporadas em um **accordion**; nos animes, episódios em lista.
- Botão de voltar para o catálogo da categoria.
- Tratar `id` ausente ou inválido com uma mensagem e um link de volta para o catálogo.

## Créditos

Dados de filmes e séries fornecidos por [TMDB](https://www.themoviedb.org/). Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
Dados de animes fornecidos por [Jikan](https://jikan.moe/) (MyAnimeList).
