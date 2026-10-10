import { render } from 'preact';
import '@fontsource/creepster';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './styles/global.css';
import { App } from './App.tsx';

render(<App />, document.getElementById('app')!);
