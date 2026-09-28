import { describe, it, expect } from 'vitest';
import { validarNota } from './utils.js';

describe('validarNota', () => {
  it('aceita uma nota dentro do intervalo', () => {
    expect(validarNota(7)).toEqual({ valido: true, valor: 7 });
  });

  it('aceita os limites 0 e 10', () => {
    expect(validarNota(0).valido).toBe(true);
    expect(validarNota(10).valido).toBe(true);
  });

  it('aceita número em formato de texto', () => {
    expect(validarNota('8.5')).toEqual({ valido: true, valor: 8.5 });
  });

  it('rejeita nota acima de 10', () => {
    const resultado = validarNota(11);
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('A nota deve estar entre 0 e 10.');
  });

  it('rejeita nota negativa', () => {
    expect(validarNota(-1).valido).toBe(false);
  });

  it('rejeita texto que não é número', () => {
    const resultado = validarNota('abc');
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe('A nota deve ser um número.');
  });
});