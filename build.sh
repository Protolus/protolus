#!/bin/sh

#node,extensions,core,image

#init
dr="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
name=$2
moduleList=$1
header=""
footer=""
fileList=""
type="client"

#default module list
if [$moduleList -eq '']; then
    moduleList="node,extensions,core"
fi

#split all the module names, accumulate the required files
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
        audio)
            fileList=$fileList"Audio/Protolus.Audio.Source,Audio/Protolus.Audio.Filter,Audio/Protolus.Audio.Generator,Audio/Protolus.Audio.Instrument,Audio/Protolus.Audio.Mixer,Audio/Protolus.Audio.Sequencer,Audio/Generators/Protolus.Audio.Generator.Sine"
        ;;
        image)
            fileList=$fileList"Image/Protolus.Image, Image/Protolus.Image.Booth,Image/Protolus.Image.Layer,Image/Protolus.Image.Filter,Image/Protolus.Image.Tool,Image/Protolus.Image.Brush,Image/Protolus.Image.Operation,Image/Brushes/Protolus.Image.Brush.Scatter10px,Image/Brushes/Protolus.Image.Brush.Round3px,Image/Brushes/Protolus.Image.Brush.SoftRound10px,Image/Brushes/Protolus.Image.Brush.SoftRound40px,Image/Brushes/Protolus.Image.Brush.SoftRound15px,Image/Brushes/Protolus.Image.Brush.Round5px,Image/Brushes/Protolus.Image.Brush.Square1px,Image/Brushes/Protolus.Image.Brush.SoftRound5px,Image/Brushes/Protolus.Image.Brush.SoftRound20px,Image/Brushes/Protolus.Image.Brush.Square5px,Image/Filters/Protolus.Image.Filter.Emboss,Image/Filters/Protolus.Image.Filter.Laplacian,Image/Filters/Protolus.Image.Filter.GaussianBlur,Image/Filters/Protolus.Image.Filter.Sharpen,Image/Filters/Protolus.Image.Filter.HighPass,Image/Filters/Protolus.Image.Filter.Sobel,Image/Tools/Protolus.Image.Tool.Clone,Image/Tools/Protolus.Image.Tool.Paintbrush,Image/Tools/Protolus.Image.Tool.Eraser,Image/Tools/Protolus.Image.Tool.Paintbucket,Image/Tools/Protolus.Image.Tool.Eyedropper,Image/Operations/Protolus.Image.Operation.BrightnessContrast,Image/Operations/Protolus.Image.Operation.Negative,"
        ;;
        game)
            fileList=$fileList""
        ;;
        parsers)
            fileList=$fileList"Parsers/Protolus.TagParser,Protolus.Template,Parsers/Protolus.HTMLParser,Templating/Protolus.Template.Smarty,"
        ;;
    esac
done
IFS=${old_IFS}

#sort out the name
name=$2
if [$2 -eq '']; then
    name="Build/Protolus."$type".js"
fi
filename="$name"

#output to file 
echo $header >> $filename
old_IFS=${IFS}
IFS=","
for v in $fileList; do
    cat "$dr/Source/$v.js" >>$filename
done
IFS=${old_IFS}
echo $footer >> $filename

#dump the results
echo "Built "$moduleList" for "$type" as "$filename