import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Game } from './Game';

export const API = 'http://192.168.0.109:3000';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/game',
        element: <Game />
    }
])

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <RouterProvider router={router} />
);