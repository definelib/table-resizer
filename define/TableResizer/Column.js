

define('TableResizer/Column', function (require, module, exports) {
    const $String = require('@definejs/string');

   


    return {

        /**
        * 
        * @param {*} fields 
        * @returns 
        */
        parse(config) {
            let id$column = {};
            

            let columns = config.fields.map((field) => {
                let id = $String.random();
                let cid = `col-${id}`;
                let { width, minWidth, maxWidth, dragable, } = field;

                //每一列可以指定自己所允许的最小宽度，如果不指定，则使用全局的。
                minWidth = typeof minWidth == 'number' ? minWidth : config.minWidth;
                maxWidth = typeof maxWidth == 'number' ? maxWidth : config.maxWidth;

                dragable = dragable === false ? false : true;

                let column = id$column[id] ={
                    'id': id,
                    'cid': cid,
                    'width': width,
                    'minWidth': minWidth,   //所允许的最小宽度。 如果为 0，则不限制。
                    'maxWidth': maxWidth,   //所允许的最大宽度。 如果为 0，则不限制。
                    'dragable': dragable,   //只有显式指定了为 false 才禁用。
                    'field': field,         //此字段只是存着，本组件不使用。 可以在触发事件时让外部使用。

                    '$': null,              //$(cid); 只是用来暂存，用到时再去获取。
                };


                return column;
            });

            return {
                columns,
                id$column,
            };
        },


        /**
        * 根据索引、列对象或 id 来获取对应的列对象与其与在的索引值。
        * @param {number|Object|string} item 要获取的列对象对应的索引、列对象或 id 值。
        *   如果传入的是一个 number，则当成列的索引值。 如果小于 0，则从后面开始算起。
        *   如果传入的是一个 Object，则当成是列对象进行引用匹配。
        *   如果传入的是一个 string，则当成是 id 进行匹配。
        * @returns {Object} 返回获取到的列对象及描述，结构为：
        *   {
        *       column: {},     //表格行对象。 获取不到时为空。
        *       index: 0,       //所在数组的索引值。 在 column 为空时，此字段值为 -1。
        *       msg: '',        //错误信息描述。 在 column 为空时，有此字段值。
        *   }
        */
        get(meta, item) {
            let column = null;
            let index = -1;
            let msg = ``;

            switch (typeof item) {
                //item 为一个索引。
                case 'number':
                    //传入负数，则从后面开始算起。
                    if (item < 0) {
                        item = meta.columns.length + item; //如 -1 就是最后一项；-2 就是倒数第 2 项。
                    }

                    column = meta.columns[item]; //可能为空。
                    index = column ? item : -1;
                    msg = column ? `` : `不存在索引值为 ${item} 的列。`;
                    break;

                //item 为一个对象。
                case 'object':
                    //可能为 -1。
                    index = meta.columns.findIndex((column) => {
                        return column === item;
                    });

                    column = meta.columns[index];
                    msg = column ? `` : `不存在与传入的对象引用完全相等的列。`;
                    break;


                //item 为一个 id。
                case 'string':
                    column = meta.id$column[item]; //可能为空。

                    index = !column ? -1 : meta.columns.findIndex((column) => {
                        return column.id == item;
                    });
                    msg = column ? `` : `不存在 id 为 ${item} 的列`;
                    break;

            }

            return { column, index, msg, };

        },

    };
});