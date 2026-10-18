import { render } from 'preact';
import '../styles/global.css';
import { AnswersPage } from './AnswersPage.tsx';

render(<AnswersPage />, document.getElementById('app')!);
