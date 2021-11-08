$(document.body).append(`
<template id="tpl-TableResizer">
    
    <template name="colgroup">
        <colgroup>
            <template name="col" placeholder="cols">
                <col id="{cid}" style="width: {width}px;"/>
            </template>
        </colgroup>
    </template>

    <template name="resizer">
        <i id="{id}" class="resizer">
            <template name="indicator" placeholder="indicator">
                <b class="{class}"></b>
            </template>
        </i>
    </template>


</template>
 `);