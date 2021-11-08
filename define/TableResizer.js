
define('TableResizer', function (require, module) {
    const $ = require('$');
    const Emitter = require('@definejs/emitter');
    const Meta = module.require('Meta');
    const Template = module.require('Template');
    const Events = module.require('Events');
    const Column = module.require('Column');

    let mapper = new Map();

   

    class TableResizer {
        constructor(config) {
            config = Object.assign({}, exports.defaults, config);

            let emitter = new Emitter(this);
            let info = Column.parse(config); // info = { columns, cid$column, };

            let meta = Meta.create(config, {
                'this': this,               //方便内部使用。
                emitter,         //
                ...info,
            });

            meta.tpl = Template.create(meta);
            mapper.set(this, meta);

            //指定了公开 meta 对象。
            if (config.meta) {
                this.meta = meta;
            }

            this.id = meta.id;
            this.$ = meta.$;
        }

        /**
        * 渲染 HTML 到容器中以生成 DOM 节点。
        * @returns
        */
        render() {
            let meta = mapper.get(this);

            //已渲染过。
            if (meta.$) {
                return;
            }

            meta.$ = this.$ = $(meta.container);
            meta.$.addClass(meta.class);

            let rows = [...meta.$.get(0).rows];
            let cells = [...rows[0].cells]; //取表格的第一行。

            //列数可能跟实际不匹配，则进行截断处理。
            meta.columns = meta.columns.filter((column, index) => {
                let cell = cells[index];
                
                //可能 columns.length > cells.length;
                //即指定的 fields 元素多于实际要用到的，则只用一部分，多余的部分丢弃掉。
                if (!cell) {
                    return false;
                }

                //columns.length <= cells.length;
                //则只有部分 cell 能渲染出 resizer，不够的部分则不渲染。
                let html = meta.tpl.fill('resizer', column, index);
                $(cell).append(html);
                
                return true;
            });


            let html = meta.tpl.fill('colgroup', {});
            meta.$.prepend(html);
            meta.setWidth(); //生成总宽度。

            Events.bind(meta);
        }

        /**
        * 设置指定列的宽度。
        * @returns
        */
        set(item, width) {
            let meta = mapper.get(this);
            let { column, index, msg, } = Column.get(meta, item);

            if (!column) {
                throw new Error(msg);
            }

            let { minWidth, maxWidth, } = column;

            //列宽不能小于指定的最小宽度。
            if (minWidth > 0) {
                width = Math.max(width, column.minWidth);
            }

            //列宽不能大于指定的最大宽度。
            if (maxWidth > 0) {
                width = Math.min(width, maxWidth);
            }

            let dx = width - column.width;
         
            //会触发事件。
            meta.setWidth(column, width, { type: 'set', dx, index, });
        }


        /**
        * 清空表格。
        * @returns
        */
        clear() {
            let meta = mapper.get(this);
            let colgroup = meta.$.find('colgroup').get(0);

            colgroup.parentNode.removeChild(colgroup);

            meta.columns.forEach((column) => {
                column.$ = null;

                let resizer = document.getElementById(column.id);
                resizer.parentNode.removeChild(resizer);
            });


            meta.columns = [];
            meta.id$column = {};
        }

        /**
        * 绑定事件。
        */
        on(...args) {
            let meta = mapper.get(this);
            meta.emitter.on(...args);
        }


    }

    module.exports = exports = TableResizer;
    exports.defaults = require('TableResizer.defaults');

});