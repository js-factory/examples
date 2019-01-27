import passiveSupport from './passiveSupport';

/**
 * Lazy loading module for content
 * ===============================
 * A polyfill for IO implementation
 */


/**
 * Common utilities & variables
 * ============================
 */

// Configurations
const DEFAULT_CLASS_NAME_LIV = 'story-load-in-vw';
let lazyLoading;
let scrollEventAttached = false;
let visitedElements = [];

/**
 * Check for IO support
 */
const isIOSupported = () => 'IntersectionObserver' in window;

/**
 * @description find lazy load targets
 * @param {string} target 
 */
function findLazyTarget(target) {
    return [].slice.call(target.querySelectorAll(`.${DEFAULT_CLASS_NAME_LIV}`));
}

/**
 * Lazy load polyfill
 * ==================
 * This is simple scroll event based implementation for browsers that do not support IO
 */

function init(target, cb) {
    const containers = document.querySelector(target);
    if (!containers) {
        unbindEvents();
        return;
    }
    let lazyElements = findLazyTarget(containers);
    let active = false;
    lazyLoading = () => {
        if (active === false) {
            active = true;
            setTimeout(function () {
                if (lazyElements.length === 0) {
                    lazyElements = findLazyTarget(containers);
                }
                lazyImages = lazyImages.filter(function (lazyImage) {
                    const { bottom, top } = lazyImage.getBoundingClientRect();
                    if ((top <= window.innerHeight && bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                        visitedElements.p
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

/**
 * Exportable APIs
 * ==================
 */

function bindEvents() {
    scrollEventAttached = true;
    const options = passiveSupport() ? { passive: true } : false;
    window.addEventListener('scroll', lazyLoading, options);
}

function unbindEvents() {
    scrollEventAttached = false;
    const options = passiveSupport() ? { passive: true } : false;
    window.removeEventListener('scroll', lazyLoading, options);
}

function lazyLoad() {
    if (isIOSupported()) {
        return;
    }
    !scrollEventAttached && init('.lazy-container');
}

export {
    lazyLoad,
    unbindEvents
};

export default lazyLoad;
