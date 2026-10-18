import { render } from 'preact';
import '../styles/global.css';
import './print.css';
import { CardsPage } from './CardsPage.tsx';

render(<CardsPage />, document.getElementById('app')!);
