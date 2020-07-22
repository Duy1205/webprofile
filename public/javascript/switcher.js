window.console = window.console || function() {
    var e = {};
    e.log = e.warn = e.debug = e.info = e.error = e.time = e.dir = e.profile = e.clear = e.exception = e.trace = e.assert = function() {};
    return e
}();

$(document).ready(function() {
    var e =  '<div class="switcher-container">'+
                '<div class="selector-box">'+
                    '<span><a href="#"><i class="fa fa-magic"></i></a></span>'+
                    '<div class="color-box">'+
                     '<a id="color1" class="styleswitch color current"></a>'+
                     '<a id="color2" class="styleswitch color"></a>'+
                     '<a id="color3" class="styleswitch color"></a>'+
                     '<a id="color4" class="styleswitch color"></a>'+
                     '<a id="color5" class="styleswitch color"></a>'+
                    '</div>'+
                    '<div class="clearfix"></div>'+
                '</div>'+
              '</div>';
    $('body').append(e);
    switchColor.loadEvent();
    switchAnimate.loadEvent();
});

var switchColor = {
    colorObj: {
        colorCookie: "colorCookie",
        switchClass: ".styleswitch",
        currentClass: "current",
        headLink: "head link[id=colors]",
        colorItem: ".color-box a.styleswitch",
        reset: "#reset",
        defaultColor: "color1"
    },
    loadEvent: function() {
        var e = switchColor.colorObj;

        if ( $.cookie(e.colorCookie) ) {
            switchColor.setColor($.cookie(e.colorCookie))
        } else {
            switchColor.setColor(e.defaultColor)
        }

        $(e.colorItem).on("click", function() {
            var e = $(this).attr("id");
            switchColor.setColor(e)
        });

        $(e.reset).click(function () {
            switchColor.setColor(e.defaultColor)
        })
    },
    setColor: function(e) {
        var t = switchColor.colorObj;

        $.cookie(t.colorCookie, e);
        $(t.headLink).attr("href", "stylesheets/colors/" + e + ".css");

        var logo = 'images/logo-footer-' + e + '.svg';
        if(e === t.defaultColor){
            logo = 'images/logo-footer.svg'
        }
        $('.logo-footer').find('img').attr('src',logo);

        $(t.switchClass).removeClass(t.currentClass);
        $("#" + e).addClass(t.currentClass)
    }
};

var switchAnimate = {
    loadEvent: function() {
        $(".switcher-container span a").click(function(e) {
            var t = $(".switcher-container");

            if (t.css("right") === "-225px") {
                $(".switcher-container").animate({ right: "0"}, 300, 'easeInOutExpo')
            } else {
                $(".switcher-container").animate({ right: "-225px" }, 300, 'easeInOutExpo')
            }
            e.preventDefault();
        })
    }
};
