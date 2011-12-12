require('MooTools').apply(GLOBAL);

var GLOBAL_ITEMS = function(){
	var items = [];
	for(var key in this) items.push(key);
	return items;
}();

(function(){
    if(!this.AsciiArt) this.AsciiArt = {
        value : 'variant1',
        valueScales : {
            variant1 : ' .,:;i1tfLCG08@'.split(''),
            variant2 : '@%#*+=-:. '.split('').reverse(),
            variant3 : '#´´¨¨¯¯$$¿0oo¡++=-,.    '.split('').reverse(),
            variant4 : '#WMBRXVYIti+=;:,. '.split('').reverse(),
            'ultra-wide' : ('MMMMMMM@@@@@@@WWWWWWWWWBBBBBBBB000000008888888ZZZZZZZZZaZaaaaaa2222222SSS'
                +'SSSSXXXXXXXXXXX7777777rrrrrrr;;;;;;;;iiiiiiiii:::::::,:,,,,,,.........       ').split('').reverse(),
            wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split('').reverse(),
            hatching : '##XXxxx+++===---;;,,...    '.split('').reverse(),
            bits : '# '.split('').reverse(),
            binary : '01 '.split('').reverse(),
            greyscale : '"???? '.split('').reverse()
        },
        color : ' CGO08@'.split(''),
        font : 'courier new',
        fontPath : 'fonts/',
        invert : false,
        alpha : false,
        errorMode : 'console',
    };
    this.AsciiArt.Figlet = {
        fonts: {},
        parseFont: function(name, fn) { 
            if (name in this.AsciiArt.Figlet.fonts) {
                fn();
            }
            this.AsciiArt.Figlet.loadFont(name, function(defn) {          
                this.AsciiArt.Figlet._parseFont(name, defn, fn);
            });
        },
        _parseFont: function(name, defn, fn) {
            var lines = defn.split("\n"),
            header = lines[0].split(" "),
            hardblank = header[0].charAt(header[0].length - 1),
            height = +header[1],
            comments = +header[5];
            this.AsciiArt.Figlet.fonts[name] = {
                defn: lines.slice(comments + 1),
                hardblank: hardblank,
                height: height,
                char: {}
            };
            fn();
        },
        parseChar: function(char, font) {
            if(char > 122) return;
            var fontDefn = this.AsciiArt.Figlet.fonts[font];
            if (char in fontDefn.char) return fontDefn.char[char];
            var height = fontDefn.height,
                start = (char - 32) * height,
                charDefn = [],
                i;
            for (i = 0; i < height; i++) {
                if(!fontDefn.defn[start + i]) return;
                charDefn[i] = fontDefn.defn[start + i].replace(/@/g, "")
                .replace(RegExp("\\" + fontDefn.hardblank, "g"), " ");
            }
            return fontDefn.char[char] = charDefn;
        },
        loadFont: function(name, fn) {
            var myRequest = new Request({
                url: this.fontPath + name+ '.flf',
                onSuccess: function(data) {
                    //console.log('Parsed an FLF('+this.fontPath + name+ '.flf)');
                    fn(data);
                }.bind(this)
            }).send();
        },
        preloadDirectory : function(path, callback){
            //todo
        }
    };
    this.AsciiArt.font = function(str, font, callback) {
        this.AsciiArt.Figlet.parseFont(font, function() {
            var chars = {},
            result = "";
            for (var i = 0, len = str.length; i < len; i++) {
                chars[i] = this.AsciiArt.Figlet.parseChar(str.charCodeAt(i), font);
            }
            for (i = 0, height = chars[0].length; i < height; i++) {
                for (var j = 0; j < len; j++) {
                    if(chars[j]) result += chars[j][i];
                }
                result += "\n";
            }
            fn(result, font);
        });
    },
    this.AsciiArt.ansiCodes = function(str, color) {
        if(!color) return str;
        if(!this.codes){
            this.codes = {
                "off"       : 0,
                "bold"      : 1,
                "italic"    : 3,
                "underline" : 4,
                "overline"  : 53,
                "blink"     : 5,
                "inverse"   : 7,
                "hidden"    : 8,
                "black"     : 30,
                "red"       : 31,
                "green"     : 32,
                "yellow"    : 33,
                "blue"      : 34,
                "magenta"   : 35,
                "cyan"      : 36,
                "white"     : 37,
                "black_bg"  : 40,
                "red_bg"    : 41,
                "green_bg"  : 42,
                "yellow_bg" : 43,
                "blue_bg"   : 44,
                "magenta_bg": 45,
                "cyan_bg"   : 46,
                "white_bg"  : 47
            };
        }
        var color_attrs = color.split("+");
        var ansi_str = "";
        for(var i=0, attr; attr = color_attrs[i]; i++) {
            ansi_str += "\033[" + this.codes[attr] + "m";
        }
        ansi_str += str + "\033[" + this.codes["off"] + "m";
        return ansi_str;
    };
    this.AA = this.AsciiArt;
})();

if (typeof exports != 'undefined') (function(){
    for (var key in this) if (!GLOBAL_ITEMS.contains(key)){
        exports[key] = this[key];
    }
    exports.apply = function(object){
        Object.append(object, exports);
    };
})();

