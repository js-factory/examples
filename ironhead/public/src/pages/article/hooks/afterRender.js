export default function afterRender(props) {
    const { lazyLoad } = props;
    return lazyLoad();
}
