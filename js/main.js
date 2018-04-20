var wnd = document.querySelectorAll(".wnd_modal")[0];
var wnd_last = null;
var screen = document.getElementsByTagName("top-menu")[0];
var nodes  = document.querySelectorAll(".screen");

var settings = {
    show_animate:'pt-page-scaleUp',
    hide_animate:'pt-page-scaleDown'
};

function init(){
    /* animations */
    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    var evt_name = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];


    setTimeout(function () {
        nodes.forEach(function (item, i, arr){
            document.body.removeChild(item);
            item.addEventListener(evt_name, function (event) {
                var el = event.target;

                if(el.classList.contains(settings.show_animate)){
                    // show
                    el.classList.remove(settings.show_animate);
                    console.log('show');
                }else{
                    // hide
                    el.classList.remove(settings.hide_animate);
                    document.body.removeChild(el);
                    console.log('hide');
                }


            });
        });

    },1000);

}

init();


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

function show_screen(name) {
    var cur_wnd = null;
    nodes.forEach(function(item, i, arr){

        if(item.attributes.sys_name.value == name){
            cur_wnd = item;
            return;
        }
    });

    if(wnd_last == cur_wnd){
        console.log("equal");
        return;
    }

    // hiding pev screen
    if(wnd_last){
        wnd_last.classList.add(settings.hide_animate);
    }
    // showing called screen
    cur_wnd.style.visibility = 'visible';
    cur_wnd.classList.add(settings.show_animate);
    document.body.appendChild(cur_wnd);


    wnd_last = cur_wnd;

}

function top_menu(element){
    if (element.attributes.data){
        var data =  element.attributes.data.value;
        data = JSON.parse(data);
        var html = "<menu class = 'menu_main'>";
        html +=    "<label style = 'position: absolute;'> &nbsp;</label>";
        data.forEach(function (item, i, arr) {
            html += "<label> " +
                "<input type = 'radio' name = 'main_menu_tmp' sys_name = " + item.sysName + "> " +
                "<span class = 'menu_main_item_inactive'>" + item.label + "</span> " +
                "</label>";
        });
        element.innerHTML = html;
    }
    observer.observe(element, xxx);

    element.addEventListener("click", function(event){
        var evt = event.target.attributes.sys_name;
        if(evt)

                show_screen(evt.value);

    }
    );

}

var _input_block = null;
function input_block(element){

    var time = performance.now();
    if (element.attributes.data === undefined)
        return;
    var  data = JSON.parse(element.attributes.data.value);

    if(_input_block == null) {

            var html = [];
                html.push("<div   class = 'input_container'>");
                html.push("<label class = 'input_name'>" + data.topLabel + "</label>");
                html.push("<label class = 'input_top_label'>" + data.help + "</label>");
                html.push("<input class = 'input_in_block'></input> ");
                html.push("<label class = 'input_bottom_label'>" + data.bottomLabel + "</label> </div>");

            element.innerHTML = html.join('');

            _input_block = element;

    } else{
        var clone =  _input_block.cloneNode(true);
        var node  = clone.childNodes[0].childNodes;
        clone.setAttribute('data',element.attributes.data.value);
        node[0].innerHTML = data.topLabel;
        node[1].innerHTML = data.help;
        node[3].innerHTML = data.bottomLabel;
        element.parentNode.replaceChild(clone, element);
       // console.log('clone');
    }
    observer.observe(element, xxx);
    time = performance.now() - time;
  //  console.log('Время выполнения = ', time);

}





make_tag("top-menu",top_menu);
make_tag("input-block",input_block);



