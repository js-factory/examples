import passiveSupport from './passiveSupport';

const DEFAULT_CLASS_NAME_LIV = 'load-in-vw';
const CLASS_NAME_AFTER_LOAD = 'loaded';
let IMAGE_SRC_TO_SELECT = 'src-320';
let lazyLoading;
let lazyImageObserver;
let scrollEventAttached = false;

const isIOSupported = () => 'IntersectionObserver' in window;

function getLazyImages(target) {
    return [].slice.call(target.querySelectorAll(`.${DEFAULT_CLASS_NAME_LIV}`));
}

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

const ioCallback = function (entry) {
    if (entry.isIntersecting) {
        const lazyImage = entry.target;
        const imgSrc = getImgSrc(lazyImage);
        lazyImage.src = imgSrc;
        lazyImage.onload = onLoadCallback;
        lazyImageObserver.unobserve(lazyImage);
    }
};

const unbind = () => lazyImageObserver.disconnect();
const getIOInstance = () => {
    if (!lazyImageObserver) {
        lazyImageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(ioCallback);
        });
    }
    return lazyImageObserver;
};

const lazyLoadWithIo = (target) => {
    const containers = document.querySelector(target);
    let lazyImageObserver = getIOInstance();
    getLazyImages(containers).forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
};

function lazyLoad() {
    if (IMAGE_SRC_TO_SELECT !== '1280' && document.documentElement.clientWidth > 768) {
        IMAGE_SRC_TO_SELECT = 'src-1280';
    }
    const init = isIOSupported() ? lazyLoadWithIo : loadImageInViewport;
    !scrollEventAttached && init('.lazy-container');
}

function bindEvents() {
    scrollEventAttached = true;
    const options = passiveSupport() ? { passive: true } : false;
    window.addEventListener('scroll', lazyLoading, options);
}

function unbindEvents() {
    if (isIOSupported()) {
        return unbind();
    }
    scrollEventAttached = false;
    const options = passiveSupport() ? { passive: true } : false;
    window.removeEventListener('scroll', lazyLoading, options);
}

function loadImageInViewport(target) {
    const containers = document.querySelector(target);
    if (!containers) {
        unbindEvents();
        return;
    }
    let lazyImages = getLazyImages(containers);
    let active = false;
    lazyLoading = () => {
        if (active === false) {
            active = true;
            setTimeout(function () {
                if (lazyImages.length === 0) {
                    lazyImages = getLazyImages(containers);
                }
                lazyImages = lazyImages.filter(function (lazyImage) {
                    const { bottom, top } = lazyImage.getBoundingClientRect();
                    if ((top <= window.innerHeight && bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                        const imgSrc = getImgSrc(lazyImage);
                        lazyImage.onload = onLoadCallback;
                        lazyImage.src = imgSrc;
                        return false;
                    }
                    return true;
                });
                active = false;
            }, 300);
        }
    };
    lazyLoading();
    bindEvents();
}

export {
    lazyLoad,
    unbindEvents
};

export default lazyLoad;
