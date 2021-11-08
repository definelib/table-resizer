
define('TableResizer.defaults', {
    class: 'TableResizer',
    template: '#tpl-TableResizer',
    container: null,
    indicator: true,    //是否显示拖动时的列宽指示器。
    sumWidth: true,     //是否根据全部列宽的总和给 table 生成总的宽度。
    minWidth: 30,       //全部列所允许的最小宽度。 可以在针对每列单独设定一个 minWidth。
    maxWidth: 0,        //全部列所允许的最大宽度。 可以在针对每列单独设定一个 maxWidth。 如果指定为 0，则不限制。
    fields: [   //列的数组
        // {
        //     width: 0,           //列的宽度。 只能是整数的 number 类型。
        //     minWidth: 0,        //所允许的最小宽度。 优先级比上一级的 minWidth 高。
        //     maxWidth: 0,        //所允许的最大宽度。 优先级比上一级的 maxWidth 高。 如果指定为 0，则不限制。
        //     dragable: true,     //是否允许拖拽。 只能明确指定为 false 时才禁用拖拽，否则默认为允许。
        // },
    ],

    //是否公开 meta 对象。
    //如果指定为 true，则外部可以通过 this.meta 来访问。
    //在某些场合需要用到 meta 对象，但要注意不要乱动里面的成员。
    meta: false,

});

