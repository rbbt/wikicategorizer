var DCPT = DCPT || (function() {
    var wikiFMT = {};
    var L = 0, R = 1;
    var CAT = ['[[Category:', ']]'];
    wikiFMT.categoryToString = (function(arr) {
        var ret = '';
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                ret = CAT[L] + arr[i] + CAT[R];
            }
        }
        return ret;
    });
    var dcpt = {
        results: document.getElementById('results'),
        wq: 'http://en.wikipedia.org/w/api.php?action=query&',
        listsearch: 'list=search&format=jsonfm&srsearch=incategory:',
        categories: 'prop=categories&format=json&cllimit=10&titles=',
        data: {},
        WIKI: {},
        extra:null,
        queryString: ''
    };
    dcpt.WIKI = wikiFMT;
    var cache = false;
    dcpt.set = (function() {
        var ret, ok;
        try {

            console.log('session storage detected');

            sessionStorage.setItem('x', 'x');
            sessionStorage.removeItem('x');
            ok = true;
        } catch (e) {
            console.log('no session storage');
            ok = false;
        }
        if (!ok) {
            console.log('no session storage for user');
            ret = (function(a, b) {
                console.log('alt-storage, currently not implemented');
            });
        } else {
            console.log('session storage is available');
            ret = (function(k, v) {
                sessionStorage.setItem(k, JSON.stringify(v));

            });
        }
        return ret;

    })();

    dcpt.get = (function() {
        var ret, ok;
        try {


            sessionStorage.setItem('x', 'x');
            sessionStorage.removeItem('x');
            console.log('GET: session storage detected');

            ok = true;
        } catch (e) {
            console.log('GET: no session storage');
            ok = false;
        }
        if (!ok) {
            console.log('GET: no session storage for user');
            ret = (function(a) {
                console.log('GET: alt-storage, currently not implemented');
            });
        } else {
            console.log('GET:session storage is available');
            ret = (function(v) {
                var r = sessionStorage.getItem(v);

                if (r !== null) {
                    return JSON.parse(r);
                } else {
                    return false;
                }
            });
        }
        return ret;

    })();

    return dcpt;
})();



function searchJSON(q, t) {
    if (t === "list") {


        return  {
            requestid: q,
            srsearch: encodeURIComponent(q),
            action: "query",
            list: "search",
            format: "json"
        };
    }
    else {
        console.log('gen');
        return  {
            requestid: q,
            action: "query",
            generator: "search",
            gsrsearch: q,
            //gsrsearch: encodeURIComponent(q),
            format: "json",
            exsentences: 1, exlimit: 'max', exintro: true, explaintext: true,
            prop: "categories|categoryinfo|extlinks|info|links|pageprops|extracts",
            gsrlimit: 10,
            cllimit: "max"
        };
    }
}

function getExtraFeatures() {
    //pageID,extLink,extract,link,title
    var ret = {
        extlinks: [],
        extract: [],
        links: [],
        title: []
    };
    for (var j in DCPT.data) {
        console.log(j);
        for (var k in DCPT.data[j]) {
            console.log(k);
            var q = DCPT.data[j][k];
            var kk = 'extlinks';
            for (var o in q) {
                console.log(o);
                var p = q[o];
                if (kk in p) {
                    for (var i = 0; i < p[kk].length; i++) {
                        ret[kk].push(p[kk][i]['*']);
                    }
                }
                kk = 'extract';
                if (kk in p) {
                    ret[kk].push(p[kk]);
                }
                kk = 'title';
                if (kk in p) {
                    ret[kk].push(p[kk]);
                }
                kk = 'links';
                if (kk in p) {
                    for (var i = 0; i < p[kk].length; i++) {
                        ret[kk].push(p[kk][i]['title']);
                    }
                }
            }
        }
    }
    return ret;
}

function categories() {
    return  {
        list: 'allcategories',
        action: "query",
        aclimit: 100,
        acprop: 'size',
        format: "json"
    };
}

$("form").on("submit", function(e) {
    e.stopPropagation();
    e.preventDefault();
});

//$("li").on("click", function() {
//    console.log($(this).text());
//});




function getCategories() {
    // g = null;
    $.getJSON(
            "http://en.wikipedia.org/w/api.php?callback=?",
            categories(),
            function(data) {

                //   g = data;
                $("#results").empty();

                $("#results").append("Categories");
                console.log(data);
                $("#results").append('<ul>');

                $.each(data.query.allcategories, function(i, item) {
                    $("#results ul")
                            .append($("<li>").text(item['*']));
                });
            });
}



function categorizeInput() {
    document.getElementById("categorized").innerHTML = "";
    var cb = document.getElementsByName("check-category");
    gdb = [];
    var c = {};
    var r = [];
    for (var i = 0; i < cb.length; i++) {
        if (cb[i].checked) {
            c[cb[i].parentNode.childNodes[1].textContent] = true;
            //r.push(cb[i]);
//            console.log('checkbox:', cb[i]);
//            console.log('checkbox:', cb[i].parentNode);

// console.log('checkbox:', cb[i]);
            // c[cb[i]] = (typeof c[cb[i]] === 'undefined') ? 1 : c[cb[i]] + 1;
        }
    }

    for (var k in c) {
        r.push(k);
    }
    gdb.push(c);
    gdb.push(r);
    if (r.length < 1) {
        document.getElementById("categorized").innerHTML = '<div class="error">No Tags Selected</div>';
    } else {
        var tmp = '';
        var s = "<ul>Categories";
        for (var i = 0; i < r.length; i++) {
            //s += "<li>" + r[i].parentNode.textContent + "</li>";
            //tmp += DCPT.WIKI.categoryToString([r[i].parentNode.textContent]) + " ";
            s += "<li>" + r[i] + "</li>";
            tmp += DCPT.WIKI.categoryToString([r[i]]) + " ";

        }
        s += "</ul>";
        s += "<textarea>" + DCPT.queryString + "\n" + tmp + '</textarea>';

        document.getElementById("categorized").innerHTML = s;
        var $ext = $('<button id="extra-feat">Get Features</button>');
        $('#categorized').append($ext);
        $('#extra-feat').on('click', (function(){
            if(DCPT.extra===null){
                console.log('is null');
            DCPT.extra=getExtraFeatures();
            }
            var t = '<div id="ex-feat-con">';
            for(var k in DCPT.extra){
                t += '<ul>'+k;
                for (var i=0; i < DCPT.extra[k].length; i++){
                    t+='<li><label><input type="checkbox" name="+k+">'+DCPT.extra[k][i]+'</label></li>';
                }
                t+='</ul>';
            }
            t+='</div>';
                    $("#categorized").append($(t));
            var $bt =$('<button id="add-ex">Add Extras</button>');
                    $('#categorized').append($bt);
                    $('#add-ex').on('click',(function(){
                        console.log('called');
                    }));
        }));
    }
}

var $succ, $fail;
$succ = (function($) {
    var ret;
    ret = (function() {

        var data = DCPT.data;


//        console.log(data);
        //g = data;

        $("#logo").removeClass('anim');
        document.getElementById("results").innerHTML = "";
        //var liTitleBtn='<input name="check-title" type="checkbox">';
        var liTitleBtn = '<button class="special"></button>';
        var $results = $('<form>');
        var totalCat = 0;
        var catSet = {}, catSetList = [];
        for (var qkey in data) {
//            console.log(qkey);
            for (var key in data[qkey].pages) {
                var singleCat = 0;
//                console.log(qkey,key);
                var k = data[qkey].pages[key];
                var $li = $('<fieldset class="category-list">'), $lul = $('<ul>');
                $li.html('<label>' + liTitleBtn + '<a href="http://en.wikipedia.org/wiki/' + encodeURIComponent(k.title) + '">' + k.title + '</a></label>');//'+qkey+'</label>');
                if (typeof k.categories !== 'undefined') {
                    for (var i = 0; i < k.categories.length; i++) {
                        $lul.append($('<li>').html('<label><input name="check-category" type="checkbox">' + k.categories[i].title.substring(9) + '</label>'));
                        singleCat += 1;
                        if (k.categories[i].title.substring(9) in catSet) {
                            catSet[k.categories[i].title.substring(9)] += 1;
                        } else {
                            catSetList.push(k.categories[i].title.substring(9));
                            catSet[k.categories[i].title.substring(9)] = 1;
                        }
                    }
                }
                if (singleCat > 0) {
                    $results.append($li.append($lul));
                    totalCat += singleCat;
                }
            }
        }
        if (totalCat > 0) {
            $results.append('<button id="cat-sub" class="btn-style">Apply Categories</button>');
            var $div = $('<div id="' + 'search-results-content' + '">').append($results);

            var $catList = $('<div id="category-droplist-container">').text("Results: " + catSetList.length + " Categories");

            $catList.append('<button id="display-droplist-btn">List</button>');
            var $catUl = $('<ul id="category-droplist">');
            catSetList = catSetList.sort((function(a, b) {
                var r = catSet[b] - catSet[a];
                return ((r !== 0) ? r : ((a.toLowerCase() < b.toLowerCase()) ? 1 : 0));
            }));
            for (var i = 0; i < catSetList.length; i++) {
                $catUl.append('<li><label><input type="checkbox" name="check-category">' + catSetList[i] + '<label><span>: ' + catSet[catSetList[i]] + '</span></li>');

            }
            $catList.append($catUl);
//            for(var k in catSet){
////                $catList.append('<li><legend><input type="checkbox" name="cat-set">'+k +'<legend></li>'+': '+catSet[k]);
//            }
            //$catList.on('click');
            //;
            $div.prepend($catList);
            $("#results").append($div);
            $("#display-droplist-btn").on('click', function(e) {
                console.log('called button toggle');
                $("#category-droplist-container").toggleClass('display-droplist');
                $("#search-results-content form").toggleClass('display-droplist');
            });
            $("form").on("submit", function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $('a').on('click', (function(e) {
                console.log('a tag');
                e.preventDefault();
                $(this).attr('target', '_blank');
                window.open($(this).attr('href'));
                return false;
            }));

            $("#cat-sub").on('click', categorizeInput);
        } else {
            document.getElementById("results").innerHTML = '<div class="error">Sorry, we did not find anything to categorize</div>';
        }
    });
    return ret;
})($);
$fail = (function($) {
    var ret;
    ret = (function() {
        console.log('oops');
//        document.getElementById('results').innerHTML = '<div class="error">Sorry, request failed</div>';
    });
    return ret;
})($);

function searchSummary() {
    var q = $("#searchterm").val();
    DCPT.queryString = q;
    var sterms = [];
    DCPT.data = {};
        DCPT.extra = null;
    if (q === '') {
        DCPT.results.innerHTML = '<div class="error">Sorry, you entered an empty string</div>';
        return;
    } else {
        sterms = WNLP.searchTerms(q);
        //sterms = [q].concat(sterms);
        console.log(sterms);
    }
    var c = null;
    c = DCPT.get(sterms[0]);
    if (c !== false) {
        // d
        console.log('user entered the same term');
        for (var i = 0; i < sterms.length; i++) {
            c = DCPT.get(sterms[i]);
            if (c === false) {
                console.log('that should not happen');
            } else {
                DCPT.data[sterms[i]] = c;
            }
        }
        $succ();
    } else {
        var $df = [];
        $("#logo").addClass('anim');
        document.getElementById("results").innerHTML = "<div class='anim'>Page is Loading<span>..........</span></div>";
        for (var i = 0; i < sterms.length; i++) {
            c = DCPT.get(sterms[i]);
            if (c !== false) {
                console.log('found', sterms[i], 'in session storage');
                DCPT.data[sterms[i]] = c;
            } else {
                console.log('Did not find', sterms[i], 'in session storage');
                $df.push($.getJSON(
                        "http://en.wikipedia.org/w/api.php?callback=?",
                        searchJSON(sterms[i]),
                        function(data) {
                            //res[data.requestid] = {'pages': data.query.pages};
                            DCPT.data[data.requestid] = {'pages': data.query.pages};
                            DCPT.set(data.requestid, {'pages': data.query.pages});
                            return DCPT.data[data.requestid];

                            //                    


                        }));
            }
            //DCPT.results = res;
            $.when.apply($, $df).done($succ);
//        $.when.apply($, $df).then($succ, $fail);
        }
    }
}

$('a').on('click', (function(e) {
    e.preventDefault();
    $(this).attr('target', '_blank');
    window.open($(this).attr('href'));
    return false;
}));






$("#search").on('click', searchSummary);



function catStr(s) {
    return 'http://en.wikipedia.org/w/api.php?action=query&list=search&format=jsonfm&srsearch=incategory:' + s;
}
var caS = 'http://en.wikipedia.org/w/api.php?action=query&list=search&format=jsonfm&srsearch=incategory:English-language_films';

//http://en.wikipedia.org/w/api.php?action=query&prop=categories&format=json&cllimit=10&titles=Albert%20Einstein