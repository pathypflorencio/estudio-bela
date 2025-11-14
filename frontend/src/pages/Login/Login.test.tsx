import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login'; 

// --- Mock do 'jwt-decode' (Fica aqui em cima) ---
jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({ id: 1 })
}));

// --- O Teste ---
describe('Página de Login', () => {
  
  // Vamos configurar os mocks do fetch e localStorage DENTRO do describe/beforeEach
  // para garantir que eles estejam ativos.

  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Espiona as funções ANTES de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock do 'fetch' usando jest.spyOn (mais robusto)
    jest.spyOn(global, 'fetch').mockImplementation((url: RequestInfo | URL) => {
      const urlString = url.toString();

      // 1a. Mock da chamada de /auth/login
      if (urlString.includes('/auth/login')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: 'fake-token-123', token_type: 'Bearer' }),
        } as Response);
      }
      // 1b. Mock da chamada de /users/{id}
      if (urlString.includes('/users/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1, name: 'Usuário de Teste', role_id: 2 }),
        } as Response);
      }
      // 1c. Mock para qualquer outra chamada
      return Promise.reject(new Error('URL de fetch não mockada: ' + urlString));
    });
  });

  test('deve chamar a API e salvar o token ao submeter o formulário', async () => {
    const setItemSpy = jest.spyOn(localStorageMock, 'setItem');

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 1. Encontra os elementos
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const loginButton = screen.getByRole('button', { name: /Acessar/i });
    const form = loginButton.closest('form'); 

    // 2. Preenche os campos
    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });

    // 3. Simula o 'submit' direto no formulário
    if (form) {
      fireEvent.submit(form);
    } else {
      throw new Error('Elemento <form> não encontrado no teste.');
    }

    // 4. Verifica (Asserts)
    await waitFor(() => {
      // 4a. Verifica se a API de login foi chamada
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.anything()
      );

      // 4b. O TESTE DE OURO: Verifica se o token foi salvo!
      expect(setItemSpy).toHaveBeenCalledWith('authToken', 'fake-token-123');
      expect(setItemSpy).toHaveBeenCalledWith('userData', expect.any(String));
    });
  });
});