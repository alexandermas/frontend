var wnd = document.querySelectorAll(".wnd_modal")[0];
var wnd_last = null;
var screen = document.getElementsByTagName("top-menu")[0];
var nodes  = document.querySelectorAll(".screen");
var bisy   = false;

/*
var settings = {
    show_animate:'pt-page-scaleUp',
    hide_animate:'pt-page-scaleDown'
};
*/
var settings = {
    show_animate:'pt-page-moveFromTop',
    hide_animate:'pt-page-moveToTop',
    active_screen: null
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
    nodes.forEach(function (item, i, arr){
            document.body.removeChild(item);
            item.addEventListener(evt_name, function (event) {
                var el = event.target;

                if(el.classList.contains(settings.show_animate)){
                    // show
                    make_stiky_wrappers(event.target); // обертки к липким элементам

                }else{
                    // hide
                    document.body.removeChild(el);
                }
                el.classList.remove(settings.show_animate);
                el.classList.remove(settings.hide_animate);
                bisy = false;
            });
        });
}




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
    bisy = true;
    nodes.forEach(function(item, i, arr){

        if(item.attributes.sys_name.value == name){
            cur_wnd = item;
            settings.active_screen = item;
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
        element.insertAdjacentHTML('beforeend', html);
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

            var html = "<div   class = 'input_container'>" +
                       "<label class = 'input_name'>" + data.topLabel + "</label>" +
                       "<label class = 'input_top_label'>" + data.help + "</label>" +
                       "<input class = 'input_in_block'></input> "+
                       "<label class = 'input_bottom_label'>" + data.bottomLabel + "</label> </div>";
             element.insertAdjacentHTML('beforeend',html);
           // _input_block = element;

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

/* sticky section */
function reset_stiky() {

}

function make_stiky_wrappers(screen){

    if(screen.stiky) {
        window.scrollTo(0, settings.active_screen.scroll_offset);
        return;
    }

    screen.stiky     = stiky = {};
    stiky.tbl = [];

    stiky.next_top      = document.getElementsByTagName('top-menu')[0].getBoundingClientRect().height;
    stiky.nodes         = screen.querySelectorAll(".sticky");

    if(stiky.nodes.length == 0)
        return;

    stiky.nodes.forEach(function (item, index, array) {
        var wrapper          = document.createElement('div');
        var rect             = item.getBoundingClientRect();
        wrapper.style.height = rect.height + 'px';
        stiky.tbl[index]     = rect.y;
        item.parentNode.replaceChild(wrapper, item);
        wrapper.appendChild(item);
    });

    stiky.idx = 0;
    stiky.node             = stiky.nodes[0];
    stiky.wrapper          = stiky.node.parentNode;

    console.log(screen.stiky.tbl);
    console.log(stiky.nodes.length);
}

var up_lock = true;
var down_lock = false;


window.onscroll = function(ev) {
        if(bisy || settings.active_screen == null)
            return;
        settings.active_screen.scroll_offset = window.pageYOffset || document.documentElement.scrollTop;
        var stiky = settings.active_screen.stiky;
        if(this.oldScroll > this.scrollY){
            // scroll up
            while((this.scrollY + stiky.next_top)  < stiky.tbl[stiky.idx] && stiky.idx >= 0 && up_lock == false){
                var x = stiky.nodes[stiky.idx--].style;
                stiky.next_top -= 30;
                x.position = 'relative';
                x.top = 0 + 'px';
                console.log('-');
                down_lock = false;
                if(stiky.idx <= 0){
                    stiky.idx = 0
                    up_lock = true;
                    stiky.next_top =  document.getElementsByTagName('top-menu')[0].getBoundingClientRect().height;
                }
            }
        }else{
           // scroll down
            while(this.scrollY   > (stiky.tbl[stiky.idx] - stiky.next_top ) && stiky.idx <= (stiky.nodes.length - 1) && down_lock == false){
                var x = stiky.nodes[stiky.idx++].style;

                x.position = 'fixed';
                x.top      = stiky.next_top + 'px';
                x.width    = 1300 + 'px';
               stiky.next_top += 30;
                up_lock = false;
               if(stiky.idx == stiky.nodes.length) {
                   stiky.idx--;
                   down_lock = true;
                   console.log('d lock');
               }
               console.log('+');
            }
        }
        this.oldScroll = this.scrollY;
}

init();