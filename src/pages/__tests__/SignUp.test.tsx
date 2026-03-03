import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { store } from '../../store';
import { SignUp } from '../SignUp';

describe('SignUp page', () => {
  it('renders form fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(
      screen.getByText(/e-mail and password are required/i),
    ).toBeInTheDocument();
  });
});

