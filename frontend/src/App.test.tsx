import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

//  MOCKS 

// 1. Mock para a página de Agendamento (quebrou por causa do date-fns)
jest.mock('./pages/Scheduling', () => {
  return () => <div>Scheduling Page Mock</div>;
});

// 2. Mock para o Relatório Financeiro (quebrou por causa do jspdf e date-fns)
jest.mock('./pages/FinancialReport/FinancialReport', () => {
  return () => <div>Financial Report Mock</div>;
});

// FIM DOS MOCKS 


/*
 * TESTE UNITÁRIO
 * Objetivo: Verificar se um componente individual (nosso menu)
 * está sendo renderizado corretamente dentro do App.
 */
test('Renderiza o botão de acessibilidade', () => {
  render(<App />); 
  const accessibilityButton = screen.getByTitle('Menu de Acessibilidade');
  expect(accessibilityButton).toBeInTheDocument();
});

/*
 * TESTE DE INTEGRAÇÃO
 * Objetivo: Verificar se a interação do usuário (clique)
 * causa o resultado esperado (abrir o menu).
 */
test('Abre o menu de acessibilidade ao clicar no botão', async () => {
  const user = userEvent.setup();
  render(<App />);
  const accessibilityButton = screen.getByTitle('Menu de Acessibilidade');
  await user.click(accessibilityButton);
  const menuItem = screen.getByText('AUMENTAR TEXTO');
  expect(menuItem).toBeInTheDocument();
});