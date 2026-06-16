import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import App from './App';
import { contatoService, compromissoService } from './services/api';

jest.mock('./services/api', () => ({
  contatoService: {
    listar: jest.fn(),
    buscar: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn()
  },
  compromissoService: {
    listar: jest.fn(),
    buscar: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn()
  }
}));

let container;
let root;

beforeEach(() => {
  contatoService.listar.mockResolvedValue({ data: [] });
  compromissoService.listar.mockResolvedValue({ data: [] });
  window.history.pushState({}, '', '/');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  jest.clearAllMocks();
});

async function renderApp() {
  await act(async () => {
    root.render(<App />);
    await Promise.resolve();
  });
}

test('renderiza a lista de contatos na rota inicial', async () => {
  await renderApp();

  expect(contatoService.listar).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('Agenda Web');
  expect(container.textContent).toContain('Contatos');
  expect(container.textContent).toContain('Novo Contato');
  expect(container.textContent).toContain('Nenhum contato cadastrado.');
});

test('navega para compromissos e carrega a lista', async () => {
  await renderApp();

  const linkCompromissos = Array.from(container.querySelectorAll('a'))
    .find((link) => link.textContent === 'Compromissos');

  await act(async () => {
    linkCompromissos.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    }));
    await Promise.resolve();
  });

  expect(compromissoService.listar).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('Novo Compromisso');
  expect(container.textContent).toContain('Nenhum compromisso cadastrado.');
});
