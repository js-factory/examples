import { h } from 'preact';
import HeaderLayout from 'component/header';

import './appShell.scss';

const AppShell = (props) => {
    const { children } = props;
    return (
        <div class="app-shell">
            <HeaderLayout />
            {children && children[0]}
        </div>
    );
};

export default AppShell;
