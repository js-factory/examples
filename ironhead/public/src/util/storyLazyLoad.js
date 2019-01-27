import passiveSupport from './passiveSupport';

/**
 * Lazy loading module for content
 * ===============================
 * 
 * This module is created with IO and has polyfill setup with conventional scroll based approach
 */


/**
 * Common utilities & variables
 * ============================
 */

// Configurations
const DEFAULT_CLASS_NAME_LIV = 'story-load-in-vw';
let lazyLoading;
let lazyImageObserver;
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
 * Intersection Observer implementation 
 * ====================================
 */

/**
 * @description Intersection observer callback
 * @param {object} entry IO parameters
 */
const ioCallback = function (entry) {
    if (entry.isIntersecting) {
        const lazyTarget = entry.target;
        lazyTarget.onload = onLoadCallback;
        lazyImageObserver.unobserve(lazyTarget);
    }
};

/**
 * @description creates a single IO instance and reuse it for future use
 * @returns IO instance
 */
const getIOInstance = () => {
    if (!lazyImageObserver) {
        lazyImageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(ioCallback);
        });
    }
    return lazyImageObserver;
};

/**
 * @description IO lazy load init function
 * @param {string} target a reference to dom element
 */
const lazyLoadWithIo = (target) => {
    const containers = document.querySelector(target);
    let lazyImageObserver = getIOInstance();
    getLazyImages(containers).forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
};

const unbindIO = () => lazyImageObserver.disconnect();

/**
 * Lazy load polyfill
 * ==================
 * This is simple scroll event based implementation for browsers that do not support IO
 */

function loadImageInViewport(target) {
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
    if (isIOSupported()) {
        return unbindIO();
    }
    scrollEventAttached = false;
    const options = passiveSupport() ? { passive: true } : false;
    window.removeEventListener('scroll', lazyLoading, options);
}

function lazyLoad() {
    const init = isIOSupported() ? lazyLoadWithIo : loadImageInViewport;
    !scrollEventAttached && init('.lazy-container');
}

export {
    lazyLoad,
    unbindEvents
};

export default lazyLoad;
