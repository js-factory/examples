/**
 * @description sets up a new carousel
 * @param {Class} a slider class to be instantiated
 * @returns creates a new carousel
 */
const setUpCarousel = (SliderComponent) => {
    const INTERVAL = 3000;
    const SELECTOR = '.carousel';
    const SLIDE = '.slide';
    const DURATION = 1000;
    return Array.prototype.slice.call(document.querySelectorAll(SELECTOR)).forEach(function (element, index) {
        let autoPlay = element.dataset['autoplay'] === 'true';
        const s = new SliderComponent({
            selector: element,
            loop: true,
            duration: DURATION
        });

        if (autoPlay && element.querySelectorAll(SLIDE).length > 1) {
            setInterval(() => s.next(), INTERVAL);
        }
    });
};
/**
 * @description carousel init module
 * @returns setup a new carousel
 */
const initCarousel = () => {
    if (!window.SliderComponent) {
        import('siema').then((component) => {
            window.SliderComponent = component.default;
            return setUpCarousel(window.SliderComponent);
        });
    } else {
        return setUpCarousel(window.SliderComponent);
    }
};

export {
    initCarousel
};

export default initCarousel;