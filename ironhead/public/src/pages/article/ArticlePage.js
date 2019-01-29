import { withState, withStore } from '@js-factory/onejs';
import ArticleTmpl from './ArticleTmpl';
import afterRender from './hooks/afterRender';
import lazyLoad from '../../util/imageLazyLoad';

@withStore({
    watcher: ['article'],
    actions: {
        lazyLoad
    }
})
@withState({
    componentDidMount: afterRender,
    componentDidUpdate: afterRender,
    template: ArticleTmpl
})
export default class StoryPage { }
