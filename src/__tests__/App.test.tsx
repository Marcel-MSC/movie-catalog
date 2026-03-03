import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from '../App';
import { store } from '../store';

vi.mock('../hooks/useMovies', () => {
  return {
    useMovies: () => ({
      movies: [
        {
          id: '1',
          movie_id: 1,
          original_title: 'Test Movie',
        },
      ],
      searchMovies: vi.fn(),
      loadMoreMovies: vi.fn(),
      loading: false,
      hasMore: false,
      error: null,
    }),
  };
});

describe('App', () => {
  it('renders the main title and a movie card', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByRole('heading', { name: /movie catalog/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/test movie/i)).toBeInTheDocument();
  });
});

