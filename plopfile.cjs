// plopfile.cjs
const plopSetup = require('./dist/plop-setup.cjs').default;

module.exports = function (plop) {
    plopSetup(plop);
};
