import { h } from 'preact';
import './article.scss';

const ArticleTmpl = (props) => {
    const { article: stories } = props;
    const { totalResults = 0, articles } = stories;
    return (
        <div class="story-page">
            <div class="lazy-container">
                {articles.map((item) => {
                    const { urlToImage, title, description, url } = item;
                    return (
                        <article class="article">
                            <div class="poster">
                                <a href={url} native>
                                    <img class="load-in-vw poster-elm" data-src-320={urlToImage} />
                                </a>
                            </div>
                            <h2 class="headline"><a href={url} native>{title}</a></h2>
                            <p class="desc"><a href={url} native>{description}</a></p>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default ArticleTmpl;
