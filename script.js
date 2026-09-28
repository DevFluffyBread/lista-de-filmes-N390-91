import { validarNota, calcularMedia, filtrarPorGenero } from './src/utils.js';

const filmes = [];

const form = document.getElementById('movie-form');
const formError = document.getElementById('form-error');
const movieList = document.getElementById('movie-list');
const emptyState = document.getElementById('empty-state');
const totalFilmes = document.getElementById('total-filmes');
const mediaNotas = document.getElementById('media-notas');
const filtroGenero = document.getElementById('filtro-genero');
const generoList = document.getElementById('genero-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = form.titulo.value.trim();
  const genero = form.genero.value.trim();
  const notaInput = form.nota.value.trim();

  if (!titulo || !genero || !notaInput) {
    mostrarErro('Preencha todos os campos.');
    return;
  }

  const resultado = validarNota(notaInput);
  if (!resultado.valido) {
    mostrarErro(resultado.erro);
    return;
  }

  ocultarErro();

  filmes.push({
    id: crypto.randomUUID(),
    titulo,
    genero,
    nota: resultado.valor,
  });

  form.reset();
  form.titulo.focus();
  renderizar();
});

filtroGenero.addEventListener('change', renderizar);

function removerFilme(id) {
  const index = filmes.findIndex((f) => f.id === id);
  if (index !== -1) {
    filmes.splice(index, 1);
    renderizar();
  }
}

function obterGenerosUnicos() {
  const generos = [...new Set(filmes.map((f) => f.genero))];
  return generos.sort((a, b) => a.localeCompare(b));
}

function classeNota(nota) {
  if (nota >= 7) return 'rating-high';
  if (nota >= 5) return 'rating-mid';
  return 'rating-low';
}

function formatarNota(nota) {
  return nota.toFixed(1).replace('.', ',');
}

function renderizar() {
  const generoSelecionado = filtroGenero.value;
  const filmesVisiveis = filtrarPorGenero(filmes, generoSelecionado);

  atualizarFiltroGeneros();
  atualizarEstatisticas();
  renderizarLista(filmesVisiveis);
}

function atualizarFiltroGeneros() {
  const generoAtual = filtroGenero.value;
  const generos = obterGenerosUnicos();

  filtroGenero.innerHTML = '<option value="">Todos</option>';
  generos.forEach((g) => {
    const option = document.createElement('option');
    option.value = g;
    option.textContent = g;
    filtroGenero.appendChild(option);
  });

  if (generos.includes(generoAtual)) {
    filtroGenero.value = generoAtual;
  } else {
    filtroGenero.value = '';
  }

  generoList.innerHTML = '';
  generos.forEach((g) => {
    const option = document.createElement('option');
    option.value = g;
    generoList.appendChild(option);
  });
}

function atualizarEstatisticas() {
  totalFilmes.textContent = filmes.length;

  if (filmes.length === 0) {
    mediaNotas.textContent = '—';
    mediaNotas.style.color = '';
    return;
  }

  const media = calcularMedia(filmes.map((f) => f.nota));
  mediaNotas.textContent = formatarNota(media);
  mediaNotas.style.color = media >= 7
    ? 'var(--accent)'
    : media >= 5
      ? 'var(--warning)'
      : 'var(--danger)';
}

function renderizarLista(filmesVisiveis) {
  movieList.innerHTML = '';

  if (filmesVisiveis.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent =
      filmes.length === 0
        ? 'Nenhum filme cadastrado ainda.'
        : 'Nenhum filme encontrado para este gênero.';
    return;
  }

  emptyState.hidden = true;

  filmesVisiveis.forEach((filme) => {
    const li = document.createElement('li');
    li.className = 'movie-item';

    const info = document.createElement('div');
    info.className = 'movie-info';

    const titulo = document.createElement('span');
    titulo.className = 'movie-title';
    titulo.textContent = filme.titulo;

    const meta = document.createElement('span');
    meta.className = 'movie-meta';
    meta.textContent = filme.genero;

    info.appendChild(titulo);
    info.appendChild(meta);

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'movie-rating';

    const badge = document.createElement('span');
    badge.className = `rating-badge ${classeNota(filme.nota)}`;
    badge.textContent = formatarNota(filme.nota);

    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn btn-remove';
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => removerFilme(filme.id));

    ratingContainer.appendChild(badge);
    ratingContainer.appendChild(btnRemover);

    li.appendChild(info);
    li.appendChild(ratingContainer);
    movieList.appendChild(li);
  });
}

function mostrarErro(mensagem) {
  formError.textContent = mensagem;
  formError.hidden = false;
}

function ocultarErro() {
  formError.hidden = true;
}

renderizar();
