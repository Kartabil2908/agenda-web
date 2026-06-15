import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContatoForm from './ContatoForm';

// Mock das chamadas de API para isolar o teste do componente
jest.mock('../services/api', () => ({
  contatoService: {
    buscar: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
  }
}));

test('renderiza corretamente o formulário de criação de contato (Alessandra)', () => {
  render(
    <BrowserRouter>
      <ContatoForm />
    </BrowserRouter>
  );

  // Verifica se o título da tela aparece
  expect(screen.getByText('Novo Contato')).toBeInTheDocument();
  
  // Verifica se o campo de Nome (obrigatório) está presente
  expect(screen.getByLabelText(/Nome \*/i)).toBeInTheDocument();
  
  // Verifica a presença do botão de Salvar
  expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
});