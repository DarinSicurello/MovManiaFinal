import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import pages use REACT
import Home from './Home';
import ProfilesPage from './ProfilesPage';
import ErrorPage from './ErrorPage';
import ProfileDetail from './ProfileDetail';
import Layout from './Layout';
import MovieDatabase from './MovieDatabase';
import MovieGenerator from './MovieGenerator';
import About from './About';
import Links from './Links';
import Contact from './Contact';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movies', element: <MovieDatabase /> },
      { path: 'generator', element: <MovieGenerator /> },
      {
        path: 'profiles',
        element: <ProfilesPage />,
        children: [
          {
            path: 'profile/:profileId',
            element: <ProfileDetail />,
          },
        ],
      },
      { path: 'about', element: <About /> },
      { path: 'links', element: <Links /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
