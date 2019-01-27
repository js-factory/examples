let supportsPassive = false;
try {
    const opts = Object.defineProperty({}, 'passive', {
        get() { // eslint-disable-line
            supportsPassive = true;
        }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
} catch (e) { }// eslint-disable-line

const isPassiveSupported = () => supportsPassive;
export {
    isPassiveSupported
};

export default isPassiveSupported;
