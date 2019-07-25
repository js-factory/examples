import { h } from 'preact';
import './header.scss';

const HeaderLayout = props => (
    <div>
        <header class="header">
            <div class="logo">
                <img class="logo-img" src="https://blog.golang.org/go-brand/Go-Logo/SVG/Go-Logo_Black.svg" alt="Go App" />
            </div>
        </header>
    </div>
);

export default HeaderLayout;
