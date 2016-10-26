

(function ($, w, undefined) {
  w.ResponsiveTable = {
    options:{
      columnsToFix: [0],
      minWidth: 930,
      maxWidth: 9999
    }
  };

  var instanceCount = 0;

  $.fn.responsiveTable = function(options){
    options = options || {};
    var o = $.extend(true, {}, w.ResponsiveTable.options, options);

    return this.each(function(){
      instanceCount++;
      var responsiveTable = new ResponsiveTable(this, o, instanceCount);
      $(this).data('responsiveTable', responsiveTable)
    })
  }

  ///<summary>Inits a new instance of the plugin.</summary>
  ///<param name="t">The main table element to apply this plugin to.</param>
  ///<param name="o">The options supplied to the plugin. Check the defaults object to see all available options.</param>
  function ResponsiveTable(t, o)
  {
    var rt = this;

    rt.table = t;
    rt.tableCopy = $(t).clone();
    rt.options = o;
    rt.isTableResponsive = false;

    $(document).ready(function(){rt.updateTable()});

    //TODO SAA: Find a solution to fix the resizing
    //$(window).resize(function(){rt.updateTable()}).trigger('resize');

    rt.updateTable = function(){
        if (($(window).width() > o.minWidth) && !rt.isTableResponsive && $(window).width() < o.maxWidth){      
          rt.splitTable();
          rt.isTableResponsive = true;
          return true;
        }

        else if (rt.isTableResponsive && $(window).width() < o.minWidth && $(window).width() > o.maxWidth){
          rt.unsplitTable($(table));
          rt.isTableResponsive = false;
        }
    }

    rt.splitTable = function(){
        $(rt.table).wrap("<div class='table-wrapper' />");
        $(rt.tableCopy).removeClass("responsive");        
        $(rt.table).closest(".table-wrapper").append(rt.tableCopy);

        var allTableRowsOriginal = $(rt.table).find('tr');
        rt.removeSelectedElements(allTableRowsOriginal, true);

        var allTableRowsCopy = $(rt.tableCopy).find('tr');
        rt.removeSelectedElements(allTableRowsCopy, false);
            
        $(rt.tableCopy).wrap("<div class='pinned' />");
        $(rt.table).wrap("<div class='scrollable' />");

        rt.setCellHeights();
    }

    rt.removeSelectedElements = function(allTableRows, isOriginal)
    {
      $.each(allTableRows, function(key, value)
      {
        var allTableEntries = $(value).find('> td, > th');

        $.each(allTableEntries, function(keyEntry, valueEntry){
            if(isOriginal && $.inArray(keyEntry, rt.options.columnsToFix) !== -1)
            {
              $(valueEntry).hide();
            }

            if(!isOriginal && $.inArray(keyEntry, rt.options.columnsToFix) === -1)
            {
              $(valueEntry).hide();
            }
        });
      });
    }
      
    rt.unsplitTable = function() {
      $(rt.table).closest(".table-wrapper").find(".pinned").remove();
      $(rt.table).unwrap();
      $(rt.table).unwrap();
    }

    rt.setCellHeights = function() {
      var tr = rt.table.find('tr'),
          tr_copy = rt.tableCopy.find('tr'),
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


  }

})(jQuery, window);



