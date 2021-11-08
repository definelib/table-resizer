
define('TableResizer/Events', function (require, module, exports) {
    const $ = require('$');

    return {
        bind(meta) {
            let draging = false;    //表示鼠标左键是否已按下并还没释放。
            let x = 0;              //鼠标按下时的 pageX 值。
            let cursor = '';        //鼠标按下时的 cursor 指针值。
            let width = 0;

            let column = null;
            let $b = null;
            let tid = null;

            let $body = $(document.body);


            //开始按下鼠标左键。
            $body.on('mousedown', function (event) {
                //只针对左键。
                if (event.which != 1) {
                    return;
                }

                column = meta.id$column[event.target.id];

                if (!column) {
                    return;
                }

                draging = true;
                x = event.pageX;
                width = column.width;
                cursor = document.body.style.cursor;
                document.body.style.cursor = 'ew-resize';
                
                $b = $(`#${column.id}>b`);
                $b.html(`${column.width}px`);

                //延迟显示，在双击时显示。
                //即快速双击时不会显示，长按住时才会显示。
                tid = setTimeout(function () {
                    $b.addClass('on');
                }, 200);
                
            });

            //按住鼠标左键进行移动。
            $body.on('mousemove', function (event) {
                if (!draging) {
                    return;
                }

                //防止按住鼠标左键移动到 body 外面。
                //再进入时，恢复为松开的状态。
                if (event.which == 0) {
                    $body.trigger('mouseup');
                    return;
                }

                let dx = event.pageX - x;   //delta width
                let cw = width + dx;        //cell width
                let { minWidth, maxWidth, } = column;

                //列宽不能小于指定的最小宽度。
                if (minWidth > 0 && cw < minWidth) {
                    return;
                }

                //列宽不能大于指定的最大宽度。
                if (maxWidth > 0 && cw > maxWidth) {
                    return;
                }


                $b.html(`${cw}px`);

                meta.setWidth(column, cw, {
                    'type': 'drag',
                    'dx': dx,
                });

                
            });

            //释放鼠标左键。
            $body.on('mouseup', function (event) {
                if (!draging) {
                    return;
                }

        

                clearTimeout(tid); //可能是快速的单击，也取消。
                draging = false;
                document.body.style.cursor = cursor;
                $b.removeClass('on');

                //看看调整完的值是否生效。
                //如果没生效，则使用实际的宽度。
                let resizer = document.getElementById(column.id);
                let cell = resizer.parentNode;
                let width = cell.offsetWidth;

                if (column.width < width) {
                    meta.setWidth(column, width, {
                        'type': 'drag',
                        'dx': 0,
                    });
                }

                //性能起见。
                column.$ = null;
                column = null;
                $b = null;
                tid = null;
            });



            //双击。
            meta.$.on('dblclick', 'i', function (event) {
                let column = meta.id$column[event.target.id];
                if (!column) {
                    return;
                }

                let { columns, } = meta;

                let index = columns.findIndex((item) => {
                    return item === column;
                });
                
                meta.emitter.fire('dblclick', [column, { columns, event, index, }]);
            });

        },
    };
});
