export function validarNota(nota) {
  const num = Number(nota);
  if (Number.isNaN(num)) {
    return { valido: false, erro: 'A nota deve ser um número.' };
  }
  if (num < 0 || num > 10) {
    return { valido: false, erro: 'A nota deve estar entre 0 e 10.' };
  }
  return { valido: true, valor: num };
}

export function calcularMedia(notas) {
  if (!Array.isArray(notas) || notas.length === 0) {
    return null;
  }
  const soma = notas.reduce((acc, n) => acc + n, 0);
  return soma / notas.length;
}

export function filtrarPorGenero(filmes, genero) {
  if (!genero) {
    return filmes;
  }
  return filmes.filter(
    (filme) => filme.genero.toLowerCase() === genero.toLowerCase()
  );
}
