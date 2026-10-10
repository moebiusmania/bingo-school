import { render } from 'preact';
import '@fontsource/creepster';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '../styles/global.css';
import './print.css';
import { CardsPage } from './CardsPage.tsx';

render(<CardsPage />, document.getElementById('app')!);
