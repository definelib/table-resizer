
/**
* 
*/
define('TableResizer/Meta', function (require, module, exports) {
    const $String = require('@definejs/string');


    return {

        create: function (config, more) {
            let id = $String.random();

            let meta = {
                'id': id,                       //实例 id，不会生成到 DOM 元素中。
                'template': config.template,    //使用的 html 模板的对应的 DOM 节点选择器。
                'class': config.class,          //会添加到 meta.$ 对应的 DOM 元素中。
                'container': config.container,  //原始的 table 选择器。
                'indicator': config.indicator,  //是否显示拖动时的列宽指示器。
                'sumWidth': config.sumWidth,    //是否根据全部列宽的总和给 table 生成总的宽度。
                
                'columns': [],
                'id$column': null,

                '$': null,                      //$(meta.container)
                'this': null,                   //
                'emitter': null,                //

            };

            //设置宽度。 
            //兼做两件事：
            //  一，设定指定列的宽度。
            //  二，计算所有列宽的总和，并生成到所在的 table 里。
            meta.setWidth = function (column, width, info) {
                let sum = 0;

                if (column) {
                    column.width = width;
                    column.$ = column.$ || $(`#${column.cid}`);
                    column.$.width(width);
                }

                //计算所有列宽的总和，并生成到所在的 table 里。
                if (meta.sumWidth) {
                    sum = meta.columns.reduce((sum, item) => {
                        sum += item.width;
                        return sum;
                    }, 0);

                    meta.$.width(sum);
                }

                //此时 column 一定有。
                if (info) {
                    if (typeof info.index != 'number') {
                        info.index = meta.columns.findIndex((item) => {
                            return item === column;
                        });
                    }

                    info.columns = meta.columns;

                    if (meta.sumWidth) {
                        info.sum = sum;
                    }
                    
                    let args = [column, info];

                    meta.emitter.fire('change', column.name, args);
                    meta.emitter.fire('change', args);
                }
            };

            Object.assign(meta, more);

            return meta;
           
        },


    };
    
});


