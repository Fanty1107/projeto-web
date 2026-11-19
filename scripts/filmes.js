// filmes.js - página de filmes (usa a API da TMDB)

const TMDB_KEY = "ad00a32d4848f052602c96aacd56f60b"; // pegar a chave em themoviedb.org/settings/api
const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

const paginaDetalhes = "filme-detalhes.html";

// imagem usada quando o filme não tem pôster
const semImagem = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="342" height="513">' +
  '<rect width="100%" height="100%" fill="#221e2e"/>' +
  '<text x="50%" y="50%" fill="#b2abc6" font-family="sans-serif" font-size="20" text-anchor="middle">Sem imagem</text>' +
  '</svg>'
);

// controle da busca (para o botão "carregar mais")
let paginaBusca = 1;
let totalPaginas = 1;


// ---------- funções gerais ----------

async function buscarDados(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Erro " + resposta.status + " na requisição");
  }
  return await resposta.json();
}

// monta a url já com a chave e o idioma
function urlTMDB(caminho) {
  return TMDB_URL + caminho + "?api_key=" + TMDB_KEY + "&language=pt-BR";
}

// evita que algum texto da API quebre o HTML
function limparTexto(texto) {
  const div = document.createElement("div");
  div.textContent = texto || "";
  return div.innerHTML;
}

function converterFilme(f) {
  return {
    id: f.id,
    titulo: f.title,
    nota: f.vote_average,
    ano: (f.release_date || "").slice(0, 4),
    sinopse: f.overview,
    generos: f.genre_ids || [],
    poster: f.poster_path ? TMDB_IMG + "/w342" + f.poster_path : semImagem,
    fundo: f.backdrop_path ? TMDB_IMG + "/w1280" + f.backdrop_path : null
  };
}


// ---------- montagem da tela ----------

function criarCard(filme) {
  const link = paginaDetalhes + "?id=" + filme.id;

  let nota = "";
  if (filme.nota) {
    nota = '<span class="nota"><i class="bi bi-star-fill"></i> ' + Number(filme.nota).toFixed(1) + "</span>";
  }
  const ano = filme.ano ? "· " + filme.ano : "";

  return `
    <div class="col">
      <a class="titulo-card" href="${link}">
        <img class="poster" src="${filme.poster}" alt="Pôster de ${limparTexto(filme.titulo)}" loading="lazy">
        <p class="nome">${limparTexto(filme.titulo)}</p>
        <p class="meta mb-0">${nota} ${ano}</p>
      </a>
    </div>`;
}

function montarCards(lista) {
  let html = "";
  for (let i = 0; i < lista.length; i++) {
    html += criarCard(lista[i]);
  }
  return html;
}

function mostrarCards(idGrid, lista) {
  document.getElementById(idGrid).innerHTML = montarCards(lista);
}

function mostrarCarregando(idGrid) {
  let html = "";
  for (let i = 0; i < 6; i++) {
    html += '<div class="col"><div class="skeleton"></div></div>';
  }
  document.getElementById(idGrid).innerHTML = html;
}

function esvaziarGrid(idGrid) {
  document.getElementById(idGrid).innerHTML = "";
}


// carrossel do topo: só entram os filmes que têm imagem de fundo
function montarCarrossel(filmes) {
  const slides = filmes.filter(function (filme) {
    return filme.fundo;
  }).slice(0, 5);

  if (slides.length === 0) return;

  let htmlSlides = "";
  let htmlBotoes = "";

  slides.forEach(function (filme, i) {
    const ativo = i === 0 ? "active" : "";
    const sinopse = limparTexto(filme.sinopse) || "Sem sinopse disponível.";

    htmlSlides += `
      <div class="carousel-item ${ativo}">
        <div class="hero-slide" style="background-image:url('${filme.fundo}')" role="img" aria-label="Imagem de ${limparTexto(filme.titulo)}">
          <div class="container hero-conteudo">
            <span class="hero-categoria">Filme em alta</span>
            <h1 class="hero-titulo">${limparTexto(filme.titulo)}</h1>
            <p class="hero-sinopse">${sinopse}</p>
            <a class="btn btn-accent" href="${paginaDetalhes}?id=${filme.id}">Ver detalhes</a>
          </div>
        </div>
      </div>`;

    const atributos = i === 0 ? 'class="active" aria-current="true"' : "";
    htmlBotoes += `<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${i}" ${atributos} aria-label="Slide ${i + 1}"></button>`;
  });

  document.getElementById("heroSlides").innerHTML = htmlSlides;
  document.getElementById("heroIndicators").innerHTML = htmlBotoes;
}


// ---------- listas padrão (em alta, melhores, em cartaz) ----------

async function carregarListas() {
  if (TMDB_KEY === "COLE_SUA_CHAVE_AQUI") {
    console.error("Erro sem chave api para filmes");
    esvaziarGrid("gridAlta");
    esvaziarGrid("gridMelhores");
    esvaziarGrid("gridCartaz");
    return;
  }

  try {
    const alta = await buscarDados(urlTMDB("/trending/movie/week"));
    const melhores = await buscarDados(urlTMDB("/movie/top_rated"));
    const cartaz = await buscarDados(urlTMDB("/movie/now_playing"));

    const filmesAlta = alta.results.map(converterFilme);

    mostrarCards("gridAlta", filmesAlta.slice(0, 6));
    mostrarCards("gridMelhores", melhores.results.map(converterFilme).slice(0, 6));
    mostrarCards("gridCartaz", cartaz.results.map(converterFilme).slice(0, 6));
    montarCarrossel(filmesAlta.slice(0, 5));
  } catch (erro) {
    console.error(erro);
    esvaziarGrid("gridAlta");
    esvaziarGrid("gridMelhores");
    esvaziarGrid("gridCartaz");
  }
}

// preenche o select de gêneros com os dados da API
async function carregarGeneros() {
  if (TMDB_KEY === "COLE_SUA_CHAVE_AQUI") return;

  try {
    const resposta = await buscarDados(urlTMDB("/genre/movie/list"));
    let opcoes = "";
    resposta.genres.forEach(function (genero) {
      opcoes += '<option value="' + genero.id + '">' + limparTexto(genero.name) + "</option>";
    });
    document.getElementById("buscaGenero").insertAdjacentHTML("beforeend", opcoes);
  } catch (erro) {
    console.error(erro);
  }
}


// ---------- busca ----------

// reiniciar = true quando é uma busca nova, false quando é "carregar mais"
async function buscarFilmes(reiniciar) {
  const texto = document.getElementById("buscaTexto").value.trim();
  const genero = document.getElementById("buscaGenero").value;
  const msg = document.getElementById("msgBusca");
  const botaoMais = document.getElementById("btnMais");

  if (TMDB_KEY === "COLE_SUA_CHAVE_AQUI") {
    console.error("Falta a chave da TMDB. Cole a sua no começo do arquivo scripts/filmes.js.");
    return;
  }

  // sem texto e sem gênero: volta para as listas padrão
  if (texto === "" && genero === "") {
    limparBusca();
    return;
  }

  if (reiniciar) {
    paginaBusca = 1;
    mostrarCarregando("gridBusca");
  } else {
    paginaBusca++;
  }

  document.getElementById("resultados").classList.remove("d-none");
  document.getElementById("listasPadrao").classList.add("d-none");
  msg.classList.add("d-none");
  botaoMais.classList.add("d-none");

  // com texto usa a busca, só com gênero usa o discover
  let url;
  if (texto !== "") {
    url = urlTMDB("/search/movie") + "&query=" + encodeURIComponent(texto) + "&page=" + paginaBusca;
  } else {
    url = urlTMDB("/discover/movie") + "&with_genres=" + genero + "&sort_by=popularity.desc&page=" + paginaBusca;
  }

  try {
    const resposta = await buscarDados(url);
    totalPaginas = resposta.total_pages;

    let filmes = resposta.results.map(converterFilme);

    // a busca por texto não filtra gênero, então filtramos aqui
    if (texto !== "" && genero !== "") {
      filmes = filmes.filter(function (filme) {
        return filme.generos.includes(Number(genero));
      });
    }

    const grid = document.getElementById("gridBusca");
    if (reiniciar) {
      grid.innerHTML = montarCards(filmes);
    } else {
      grid.insertAdjacentHTML("beforeend", montarCards(filmes));
    }

    if (reiniciar && filmes.length === 0) {
      msg.textContent = "Nenhum filme encontrado. Tente outro nome ou outro gênero.";
      msg.classList.remove("d-none");
    }

    if (paginaBusca < totalPaginas) {
      botaoMais.classList.remove("d-none");
    }
  } catch (erro) {
    console.error(erro);
    esvaziarGrid("gridBusca");
    console.error("Não foi possível fazer a busca agora. Tente de novo em instantes.");
  }
}

function limparBusca() {
  document.getElementById("buscaTexto").value = "";
  document.getElementById("buscaGenero").value = "";
  document.getElementById("resultados").classList.add("d-none");
  document.getElementById("listasPadrao").classList.remove("d-none");
  esvaziarGrid("gridBusca");
}

document.getElementById("formBusca").addEventListener("submit", function (e) {
  e.preventDefault();
  buscarFilmes(true);
});

document.getElementById("btnMais").addEventListener("click", function () {
  buscarFilmes(false);
});



// ---------- início ----------

mostrarCarregando("gridAlta");
mostrarCarregando("gridMelhores");
mostrarCarregando("gridCartaz");

carregarListas();
carregarGeneros();

// se veio da home com ?busca=texto, já faz a busca
const parametros = new URLSearchParams(window.location.search);
const buscaInicial = parametros.get("busca");
if (buscaInicial) {
  document.getElementById("buscaTexto").value = buscaInicial;
  buscarFilmes(true);
}
