import { h } from 'preact';
import './header.scss';

const HeaderLayout = props => (
    <div>
        <header class="header">
            <div class="logo">
                <img class="logo-img" src="https://www.jabong.com/juicestyle/wp-content/themes/juicer/images/logo-juicer1.png" alt="Juice" />
            </div>
        </header>
    </div>
);

export default HeaderLayout;
