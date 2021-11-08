
//<--for.webpack.begin-->
//针对在 webpack 环境中，自动引入样式。
if ('webpackPolyfill' in module) {
    require('./modules/panel.less');
    require('./modules/panel.html.js');
}
//<--for.webpack.end-->

module.exports = require('./modules/TableResizer');
module.exports.defaults = require('./modules/TableResizer.defaults');