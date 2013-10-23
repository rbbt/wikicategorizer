var WNLP= window.WNLP || (function(){
    var stopwords = {'the':true,
        'then':true,
        'for':true,
        'when':true,
        'if':true,
        'to':true,
        'in':true,
        'of':true,
        'and':true, 
        'what':true, 
        'who':true, 
        'why':true, 
        'how':true, 
        'he':true, 
        'she':true, 
        'it':true, 
        'is':true, 
        'i':true, 
        'where':true
    };
    var rsplit = /\s+/;
    var patterns = {
'/.*ing$/': 'VBG',               
'/.*ed$/': 'VBD',                
'/.*es$/': 'VBZ',                
'/.*ould$/': 'MD',               
'/.*\'s$/': 'NN$',               
'/.*s$/': 'NNS',                 
'/^-?{0-9}+(.{0-9}+)?$/': 'CD',
'/.*/': 'NN'  
 };


    var wnlp = {};
    
    wnlp.tokenizeRaw=(function (raw){
        return raw.trim().split(rsplit);
    });
    
    
    wnlp.searchTerms = (function(s){
        var l = null;
        if (typeof wnlp.tokenizeRaw === 'undefined'){
            console.log('error:\n\t', wnlp);
        }else{
             l = wnlp.tokenizeRaw(s);
            if (l.length === 1){
                return l;
            }else{
                var ret = [s.trim()];
                var rt = {};
                console.log('else');
                for (var i = 0; i < l.length; i++){
                    var w = l[i].toLowerCase();
                    if(stopwords[w]!==true){
                        rt[w] = true;
                    }
                }
                for (var k in rt){
                    ret.push(k);
                }
                l = ret;
            }
            return l;
        }
        return l;
        
    });
    
    wnlp.get = (function(attr){
        var ret = [];
        switch(attr){
            case "rsplit":
            case "r":
               ret.push(attr);
               break;
           default:
               break;
        }
        return ret;
    });
    return wnlp;
})();