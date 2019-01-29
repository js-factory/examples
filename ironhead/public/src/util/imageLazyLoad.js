
const DEFAULT_CLASS_NAME_LIV = 'lvw';
const CLASS_NAME_AFTER_LOAD = 'loaded';
let IMAGE_SRC_TO_SELECT = 'src';


function getImgSrc(elm) {
    let imgSrc = elm.dataset[IMAGE_SRC_TO_SELECT];
    return imgSrc;
}

const onLoadCallback = (e) => {
    const classList = e.target.classList;
    if (!classList.contains(CLASS_NAME_AFTER_LOAD)) {
        classList.remove(DEFAULT_CLASS_NAME_LIV);
        classList.add(CLASS_NAME_AFTER_LOAD);
    }
};

const lazyLoad = () => {
    const lazyImages = [].slice.call(document.querySelectorAll(`.${DEFAULT_CLASS_NAME_LIV}`));
    let io = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                const imgSrc = getImgSrc(lazyImage);
                lazyImage.src = imgSrc;
                lazyImage.onload = onLoadCallback;
                io.unobserve(lazyImage);
            }
        });
    });
    lazyImages.forEach(function (lazyImage) {
        io.observe(lazyImage);
    });
};

export default lazyLoad;
