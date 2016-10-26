$(document).ready(function(){
    initResponsiveTable();
});

function initResponsiveTable()
{
    $('table.responsive').responsiveTable({
        columnsToFix: [0,1]
    });
}