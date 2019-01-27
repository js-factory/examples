const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const renderDate = (timestamp) => {
    const d = new Date(timestamp);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export {
    renderDate
};
