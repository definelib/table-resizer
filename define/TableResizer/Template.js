

define('TableResizer/Template', function (require, module) {
    const Template = require('@definejs/template');




    return {
        create: function (meta) {
            let tpl = new Template(meta.template);

            tpl.process({
                'colgroup': {
                    '': function () {

                        let cols = this.fill('col', meta.columns);

                        return {
                            'cols': cols,
                        };
                    },

                    'col': function (column, index) {

                        return {
                            'cid': column.cid,
                            'width': column.width,
                        };
                    },
                },

                'resizer': {
                    '': function (column, index) {
                        //指定了不可拖拽，则不生成 html。
                        if (!column.dragable) {
                            return '';
                        }

                        let indicator = this.fill('indicator', { index, });

                        return {
                            'id': column.id,
                            'indicator': indicator,
                        };
                    },

                    'indicator': function ({ index, }) {
                        if (!meta.indicator) {
                            return '';
                        }

                        let maxIndex = meta.columns.length - 1;

                        return {
                            'class': index == maxIndex ? 'last' : '',
                        };
                    },


                },
            });

            return tpl;

        },

    };

});

