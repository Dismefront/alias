import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Game } from './Game';

export const IP = '192.168.0.109:3000'
export const API = 'http://' + IP; // localhost:3000 192.168.0.109:3000
export const WSIP = 'ws://' + IP;

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/:room_id',
        element: <Game />
    }
]);


const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <RouterProvider router={router} />
);