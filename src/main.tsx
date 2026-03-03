import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { store } from './store';
import { SignIn } from './pages/SignIn.tsx';
import { SignUp } from './pages/SignUp.tsx';
import { MyRatings } from './pages/MyRatings.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/my-ratings" element={<MyRatings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
