
const wait_until = (obj, event) => new Promise(resolve => obj.once(event, resolve));

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
