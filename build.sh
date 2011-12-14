#!/bin/sh
dr=`dirname "$0"`
name=$2
moduleList=$1
if [$moduleList -eq '']; then
    moduleList="node,extensions,core"
fi
header=""
footer=""
fileList=""
type="client"

#split all the module names
old_IFS=${IFS}
IFS=","
for module in $moduleList; do
    case "$module" in
        core)
            fileList=$fileList"Protolus,Protolus.Registry,"
        ;;
        node)
            fileList=$fileList"Node/Request.extensions,Node/Element.extensions,"
            header="var GLOBAL_ITEMS = function(){
    var items = [];
    for (var key in this) items.push(key);
    return items;
}();
(function(){"
            footer="this.Protolus = Protolus; })();
if (typeof exports != 'undefined') (function(){
    for (var key in this) if (!GLOBAL_ITEMS.contains(key)){
        exports[key] = this[key];
    }
    exports.apply = function(object){
        Object.append(object, exports);
    };
})();"
            type="node"
        ;;
        extensions)
            fileList=$fileList"Extensions/Array.extensions,Extensions/Element.extensions,Extensions/NodeList.extensions,Extensions/Function.extensions,Extensions/Number.extensions,Extensions/Object.extensions,Extensions/Request.Pool,Extensions/Request.Stable,Extensions/String.extensions,"
        ;;
        image)
            fileList=$fileList"Image/Protolus.Image.Booth,Image/Protolus.Image,Image/Protolus.Image.Layer,Image/Protolus.Image.Filter,Image/Protolus.Image.Tool,Image/Protolus.Image.Brush,Image/Protolus.Image.Operation,Image/Brushes/Protolus.Image.Brush.10pxScatter.js,Image/Brushes/Protolus.Image.Brush.3pxRound.js,Image/Brushes/Protolus.Image.Brush.10pxSoftRound.js,Image/Brushes/Protolus.Image.Brush.40pxSoftRound.js,Image/Brushes/Protolus.Image.Brush.15pxSoftRound.js,Image/Brushes/Protolus.Image.Brush.5pxRound.js,Image/Brushes/Protolus.Image.Brush.1pxSquare.js,Image/Brushes/Protolus.Image.Brush.5pxSoftRound.js,Image/Brushes/Protolus.Image.Brush.20pxSoftRound.js,Image/Brushes/Protolus.Image.Brush.5pxSquare.js,Image/Filters/Protolus.Image.Filter.Emboss.js,Image/Filters/Protolus.Image.Filter.Laplacian.js,Image/Filters/Protolus.Image.Filter.GaussianBlur.js,Image/Filters/Protolus.Image.Filter.Sharpen.js,Image/Filters/Protolus.Image.Filter.HighPass.js,Image/Filters/Protolus.Image.Filter.Sobel.js,Image/Tools/Protolus.Image.Tool.Clone.js,Image/Tools/Protolus.Image.Tool.Paintbrush.js,Image/Tools/Protolus.Image.Tool.Eraser.js,Image/Tools/Protolus.Image.Tool.Paintbucket.js,Image/Tools/Protolus.Image.Tool.Eyedropper.js,Image/Operations/Protolus.Image.Operation.BrightnessContrast.js,Image/Operations/Protolus.Image.Operation.Negative.js,"
        ;;
        game)
            fileList=$fileList""
        ;;
        parsers)
            fileList=$fileList"Parsers/Protolus.TagParser,Protolus.Template,Parsers/Protolus.HTMLParser,Templating/Protolus.Template.Smarty"
        ;;
    esac
done
IFS=${old_IFS}

#sort out the name
name=$2
if [$2 -eq '']; then
    name="Protolus."$type".js"
fi
filename="Build/$name"

echo "Built "$moduleList" for "$type" as "$filename

#output to file 
echo $header >> $filename
old_IFS=${IFS}
IFS=","
for v in $fileList; do
    cat "Source/$dr/$v.js" >>$filename
done
IFS=${old_IFS}
echo $footer >> $filename