

export
const wait_until = (obj, event) => new Promise(resolve => obj.once(event, resolve));

export
const wait_on = (obj, event) => new Promise(resolve => obj.on(event, resolve));

export
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
