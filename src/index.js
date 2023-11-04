import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import FilterPage from './pages/FilterPage';
import TrelloPage from './pages/TrelloPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
  {
    path: '/filter',
    element: <FilterPage />,
  },
  {
    path: '/trello',
    element: <TrelloPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
