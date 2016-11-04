(function ($, w) {
    w.ResponsiveTable = {
        options: {
            columnsToFix: [0],
            minWidth: 930,
            maxWidth: 9999,
            events: {
                updated: 'responsive-table_updated'
            },
            triggers: {
                initialize: 'responsive-table_init',
                redraw: 'responsive-table_redraw',
                resize: 'responsive-table_resize'
            },
            classes: {
                loaded: 'responsive-table_loaded'
}
        }
    };

    var instanceCount = 0;

    $.fn.responsiveTable = function (options) {
        options = options || {};
        var o = $.extend(true, {}, w.ResponsiveTable.options, options);

        return this.each(function() {
            instanceCount++;
            var responsiveTable = new ResponsiveTable(this, o, instanceCount);
            $(this).data('responsiveTable', responsiveTable);
        });
    }

    ///<summary>Inits a new instance of the plugin.</summary>
    ///<param name="t">The main table element to apply this plugin to.</param>
    ///<param name="o">The options supplied to the plugin. Check the defaults object to see all available options.</param>
    function ResponsiveTable(t, o) {
        var rt = this;
        rt.table = t;
        rt.tableCopy = $(t).clone();
        rt.options = o;
        rt.isTableResponsive = false;
        
        var opt = rt.options,
            evt = opt.events,
            trg = opt.triggers,
            cls = opt.classes;

        rt.init = function() {
            $(rt.table)
                .off(trg.initialize)
                .on(trg.initialize, function () {
                    $(rt.table).remove(cls.loaded);
                    $(rt.table).trigger(trg.resize);
                    $(rt.table).addClass(cls.loaded);
                })
                .off(trg.redraw)
                .on(trg.redraw, function () {
                    $(rt.table).remove(cls.loaded);
                    rt.updateTable();
                    $(rt.table).addClass(cls.loaded);
                    $(rt.table).trigger(evt.updated);
                })
                .off(trg.resize)
                .on(trg.resize, function () {
                    $(rt.table).remove(cls.loaded);
                    rt.updateTable();
                    $(rt.table).addClass(cls.loaded);
                    $(rt.table).trigger(evt.updated);
                });
            
            $(rt.table).trigger(trg.initialize);
            
            $(window).on('resize', function () {
                $(rt.table).trigger(trg.resize);
            });
        }

        rt.updateTable = function () {
            if (($(window).width() > o.minWidth) && !rt.isTableResponsive && $(window).width() < o.maxWidth) {
                rt.splitTable();
                rt.isTableResponsive = true;
            } else if (rt.isTableResponsive && $(window).width() < o.minWidth || $(window).width() > o.maxWidth) {
                rt.unsplitTable($(rt.table));
                rt.isTableResponsive = false;
            }
        }

        rt.splitTable = function () {
            $(rt.table).wrap("<div class='table-wrapper' />");
            $(rt.tableCopy).removeClass("responsive");
            $(rt.table).closest(".table-wrapper").append(rt.tableCopy);
            $(rt.tableCopy).wrap("<div class='pinned' />");
            $(rt.table).wrap("<div class='scrollable' />");
            
            var allTableRowsOriginal = $(rt.table).find('tr');
            var allTableRowsCopy = $(rt.tableCopy).find('tr');
            
            rt.removeSelectedElements(allTableRowsOriginal, true, rt.setCellHeights);
            rt.removeSelectedElements(allTableRowsCopy, false, rt.setCellHeights);
        }
        
        rt.unsplitTable = function () {
            $(rt.table).closest(".table-wrapper").find(".pinned").remove();
            $(rt.table).unwrap();
            $(rt.table).unwrap();
        }

        rt.setCellHeights = function () {
            var tr = $(rt.table).find('tr'),
                tr_copy = $(rt.tableCopy).find('tr'),
                heights = [];

            tr.each(function (index) {
                var self = $(this),
                    tx = self.find('th, td');

                tx.each(function () {
                    var height = $(this).outerHeight(true);
                    heights[index] = heights[index] || 0;
                    if (height > heights[index]) heights[index] = height;
                });

            });

            tr_copy.each(function (index) {
                $(this).height(heights[index]);
            });
        }

        rt.removeSelectedElements = function(allTableRows, isOriginal, callback) {
            $.each(allTableRows, function(key, value) {
                var allTableEntries = $(value).find('> td, > th');

                $.each(allTableEntries, function(keyEntry, valueEntry) {
                    if (isOriginal && $.inArray(keyEntry, rt.options.columnsToFix) !== -1) {
                        $(valueEntry).hide();
                    }

                    if (!isOriginal && $.inArray(keyEntry, rt.options.columnsToFix) === -1) {
                        $(valueEntry).hide();
                    }
                });
            });
            callback();
        };

        rt.init();
        return rt;
    }

})(jQuery, window);



