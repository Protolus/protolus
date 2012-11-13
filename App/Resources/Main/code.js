var Lyza = {
    breakCodeIntoStatements : function(code){
        var inBlock = 0;
        var inParen = 0;
        var inQuote = false;
        var ch;
        var lines = [];
        var current = '';
        var previous;
        for(var lcv=0; lcv < code.length; lcv++){
            previous = ch;
            ch = code[lcv];
            if(ch == '(') inParen++;
            if(ch == ';' && !(inBlock || inQuote)){
                if(current.trim() != ''){
                    lines.push(current.trim());
                    current = '';
                }
            }else current += ch;
            if(ch == ')'){
                inParen--;
                if(previous == '}' && inBlock === 0 && inParen === 0){
                    if(current.trim() != ''){
                        lines.push(current.trim());
                        current = '';
                    }
                    continue;
                }
            }
            if(inQuote){
                if(ch == inQuote) inQuote = false;
            }else{
                if(ch == '\'' || ch == '"'){
                    inQuote = ch;
                    continue;
                }
                if(inBlock){
                    if(ch == '}'){
                        inBlock--;
                        if(inBlock == 0 && inParen == 0){
                            if(current.trim() != ''){
                                lines.push(current.trim());
                                current = '';
                            }
                        }
                    }
                    if(ch == '{') inBlock++;
                }else{
                    if(ch == '{') inBlock++;
                }
            }
        }
        if(current.trim() != '') lines.push(current.trim());
        return lines;
    },
    harvestCommentsFromCode : function(code){
        var matches = code.match(/\/\/(.*)$/gm);
        if(!matches) return [];
        var comments = matches.map(function(item, index, array){ return item.substring(2)});
        //todo: handle multi-line comments + markup
        return comments;
    },
    removeCommentsFromCode : function(code){
        var cleanCode = code.replace(/\/\/(.*)$/gm, '');
        //todo: handle multi-line comments + markup
        return cleanCode;
    },
};