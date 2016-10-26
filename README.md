# responsive-tables
All changes are pased on the original repository from ZURB (https://github.com/zurb/responsive-tables)!
Tables that work responsively on small devices.


##Improvements

1. The plugin is now object oriented written. This change was made because it is easier to add new functionality to it and it's easier for another developer to understand.

2. The plugin needs to be initialized from now. The reason behind it is to add options to the plugin which makes it more usable. The responsive table will be initialized like this:

```javascript
$('table').responsiveTable();
```
3. It is now possible to define a range in which the plugin is active. [see options]

4. Which columns are fixed and which are sliding can now be defined in the options. This way it is easy to define which column is always fixed. [see options]

##Options

```javascript
columnsToFix: new Array()
```
With this option it is possible to define which columns are fixed.

```javascript
minWidth: 123
```
The minWidth defines the minimum width for the responsive table. Bellow this width the table will be displayed as usual. This way the plugin can be used in combination with other responsive table plugins like Footable

```javascript
maxWidth: 99
```
The maxWidth defines the maxium width for the responsive table. Above this width the table will be displayed as usual.

##Things that don't work yet

1. The plugin cannot update the table on the ``javascript $(window).resize(); ``


