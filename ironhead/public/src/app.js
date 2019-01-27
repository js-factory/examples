import { h } from 'preact';
import Router from 'preact-router';
import AppShell from './appShell/AppShell';
import ArticlePage from './pages/article/ArticlePage';

const App = ({ location }) => (
    <AppShell>
        <Router>
            <ArticlePage path="/" />
        </Router>
    </AppShell>
);

export default App;
