var wnd = document.querySelectorAll(".wnd_modal")[0];

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.dir(mutation);
    });
});

var xxx = { attributes: true, childList: true, characterData: true , subtree: true, characterData: true,attributeOldValue: true, characterDataOldValue: true};


function make_tag(tag, fn){
    document.createElement(tag);
    var inst = document.getElementsByTagName(tag);
    for ( var i = 0; i < inst.length; i++) {
        fn(inst[i]);
    }
}

function top_menu(element){
    if (element.attributes.data){
        var data =  element.attributes.data.value;
        data = JSON.parse(data);
        var html = "<menu class = 'menu_main'>";
        html +=    "<label style = 'position: absolute;'> &nbsp;</label>";
        data.forEach(function (item, i, arr) {
            html += "<label> " +
                "<input type = 'radio' name = 'main_menu_tmp' /> " +
                "<span class = 'menu_main_item_inactive'>" + item.label + "</span> " +
                "</label>";
        });
        element.innerHTML = html;
    }
    observer.observe(element, xxx);
}

var _input_block = null;
function input_block(element){
    if(_input_block == null) {
        if (element.attributes.data) {
            var data = element.attributes.data.value;
            data = JSON.parse(data);
            var html =
                "<div   class = 'input_container'>" +
                "<label class = 'input_name'>" + data.topLabel + "</label>" +
                "<label class = 'input_top_label'>" + data.help + "</label>" +
                "<input class = 'input_in_block'></input> " +
                "<label class = 'input_bottom_label'>" + data.bottomLabel + "</label> </div>";

            element.innerHTML = html;
            _input_block = element;
        }
    } else{
        var clone =  _input_block.cloneNode(true);
        clone.setAttribute('data',element.attributes.data.value);
        //console.log(clone.attributes);
        element.parentNode.replaceChild(clone, element);
    }
    observer.observe(element, xxx);
}


make_tag("top-menu",top_menu);
make_tag("input-block",input_block);



