#!/bin/sh
dr=`dirname "$0"`
name=$2
moduleList=$1
if [$2 -eq '']; then
name="Protolus.client.js"
fi 
filename="Build/$name"
echo "var GLOBAL_ITEMS = function(){
    var items = [];
    for (var key in this) items.push(key);
    return items;
}();
" > $filename
moduleList=$1
if [$moduleList -eq '']; then
moduleList="Source/Extensions/Array.extensions,Source/Extensions/Element.extensions,Source/Extensions/NodeList.extensions,Source/Extensions/Function.extensions,Source/Extensions/Number.extensions,Source/Extensions/Object.extensions,Source/Extensions/Request.Pool,Source/Extensions/Request.Stable,Source/Extensions/String.extensions,Source/Protolus,Source/Protolus.Registry,Source/Parsers/Protolus.TagParser,Source/Protolus.Template,Source/Parsers/Protolus.HTMLParser,Source/Templating/Protolus.Template.Smarty"
fi 
old_IFS=${IFS}
IFS=","
for v in $moduleList; do
    cat "$dr/$v.js" >>$filename
done
IFS=${old_IFS}