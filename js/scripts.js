//-----------------------
// Parallax
//-----------------------

$(document).ready(function(){
	// Cache the Window object
	$window = $(window);
                
   $('div[data-type="background"]').each(function(){
     var $bgobj = $(this); // assigning the object
                    
      $(window).scroll(function() {
                    
		// Scroll the background at var speed
		// the yPos is a negative value because we're scrolling it UP!								
		var yPos = -($window.scrollTop() / $bgobj.data('speed')); 
		
		// Put together our final background position
		var coords = '50% '+ yPos + 'px';

		// Move the background
		$bgobj.css({ backgroundPosition: coords });
		
}); // window scroll Ends

});	

}); 
/* Create HTML5 elements for IE's sake */

document.createElement("article");
document.createElement("div");

/* Orphan/Widow fix */
(function(a){jQuery.fn.widowFix=function(d){var c={letterLimit:null,prevLimit:null,linkFix:false,dashes:false};var b=a.extend(c,d);if(this.length){return this.each(function(){var i=a(this);var n;if(b.linkFix){var h=i.find("a:last");h.wrap("<var>");var e=a("var").html();n=h.contents()[0];h.contents().unwrap()}var f=a(this).html().split(" "),m=f.pop();if(f.length<=1){return}function k(){if(m===""){m=f.pop();k()}}k();if(b.dashes){var j=["-","–","—"];a.each(j,function(o,p){if(m.indexOf(p)>0){m='<span style="white-space:nowrap;">'+m+"</span>";return false}})}var l=f[f.length-1];if(b.linkFix){if(b.letterLimit!==null&&n.length>=b.letterLimit){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()});return}else{if(b.prevLimit!==null&&l.length>=b.prevLimit){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()});return}}}else{if(b.letterLimit!==null&&m.length>=b.letterLimit){return}else{if(b.prevLimit!==null&&l.length>=b.prevLimit){return}}}var g=f.join(" ")+"&nbsp;"+m;i.html(g);if(b.linkFix){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()})}})}}})(jQuery);

//-----------------------
// Vertical Nav
//-----------------------

jQuery(document).ready(function($){
	var contentSections = $('.cd-section'),
		navigationItems = $('#cd-vertical-nav a');

	updateNavigation();
	$(window).on('scroll', function(){
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });
    //smooth scroll to second section
    $('.cd-scroll-down').on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $('.touch .cd-nav-trigger').on('click', function(){
    	$('.touch #cd-vertical-nav').toggleClass('open');
  
    });
    //close navigation on touch devices when selectin an elemnt from the list
    $('.touch #cd-vertical-nav a').on('click', function(){
    	$('.touch #cd-vertical-nav').removeClass('open');
    });

	function updateNavigation() {
		contentSections.each(function(){
			$this = $(this);
			var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
				navigationItems.eq(activeSection).addClass('is-selected');
			}else {
				navigationItems.eq(activeSection).removeClass('is-selected');
			}
		});
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	600
        );
	}
});

//-----------------------
// Lazy Load
//-----------------------

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "../images/lazyload_placeholder.gif"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);


//-----------------------
// Vanilla Form (Contact)
//-----------------------

/*
 * Vanilla Form v. 1.2.0
 * Author: Michal Szepielak
 */
var VanillaForm = (function (window) {
    "use strict";

    /**
     * Constructor of Vanilla Form
     * @param form {HTMLFormElement}
     * @returns {VanillaForm}
     * @constructor
     */
    var VanillaForm = function (form) {
            var self = this;

            if (!form) {
                console.warn("Couldn't bind to form element");
                return null;
            }
            self.dict = {
                "markedAsSpamError": "Your message was marked as spam and was not sent! Fix your message!",
                "markedAsSpamServerError": "Your message was marked as SPAM and was not send.",
                "sendSuccess": "I have received your message and will respond shortly.",
                "sendError": "Mail server has experienced an error. Please try again.",
                "httpRequestError": "[%s] There was a problem with receiving response from mailing server",
                "timeoutError": "Your request was timeout. Please try again.",
                "parseResponseError": "Response from mailing server was unclear. Please contact administrator."
            };
            self.responseTimeout = 5000;
            self.httpRequest = null;
            self.url = form.action || location.href;
            self.form = form;
            self.processing = false;

            // Binding submit button
            self.submitButton = form.querySelector("[type=\"submit\"]");
            if (!self.submitButton) {
                console.warn("Couldn't bind to submit button");
                return null;
            }


            // Binding to notification box
            self.notificationBox = form.querySelector(".notification-box");
            if (!self.notificationBox) {
                console.warn("Couldn't bind to submit button");
                return null;
            }

            self.notificationBox.addEventListener("click", function () {
                this.classList.remove("show-error");
                this.classList.remove("show-success");
            }, false);

            // BOT prevent
            self.formFocused = false;
            self.focusBound = null;

            // Init
            self.init();
            return self;
        },
        removeErrorBound = {length: 0};

    /**
     * Returns pass phrase
     * @returns {string}
     */
    function getPassPhrase() {
        var token = "9320087105434084715";
        token = token.split("");
        token = token.reverse().join("");
        return token;
    }

    /**
     * Triggered when form field is focused. It's used for simple BOT prevention.
     * @param self {VanillaForm}
     */
    function onFieldFocus(self) {
        self.formFocused = true;
    }

    /**
     * Removes error highlighting from target element and cleans submit button
     * @param self {VanillaForm}
     * @param targetElement {HTMLInputElement|HTMLTextAreaElement}
     */
    function removeError(self, targetElement) {
        targetElement.classList.remove("error");
        targetElement.removeEventListener("focus", removeErrorBound[targetElement.name], false);
        delete removeErrorBound[targetElement.name];
        removeErrorBound.length--;
        if (removeErrorBound.length <= 0) {
            removeErrorBound.length = 0;
            self.setSubmitState("initial");
        }
    }

    /**
     * Scrolls window to make visible target element on the screen.
     * @param element {HTMLElement}
     */
    function scrollToShowElement(element) {
        var bounding = element.getBoundingClientRect(),
            fromTop = Math.round(bounding.top) - 5,
            viewportHeight = window.innerHeight;

        if (fromTop <= 0) {
            window.scrollBy(0, fromTop);
            return;
        }

        if (fromTop >= viewportHeight) {
            window.scrollBy(0, fromTop - viewportHeight + 30);
        }
    }

    /**
     * Logs an error
     * @param msg {string} Error message
     */
    VanillaForm.prototype.logError = function (msg) {
        this.notify(msg, "error");
    };

    /**
     * Shows notification box with given message.
     * @param message {string} Message
     * @param type {string} [type=error] - Notification type
     */
    VanillaForm.prototype.notify = function (message, type) {
        var notificationBox = this.notificationBox;

        if (!notificationBox) {
            console.warn("Notification box not found");
            return;
        }
        notificationBox.innerHTML = message;
        notificationBox.classList.add("show-" + (type || "error"));
        scrollToShowElement(notificationBox);
    };

    /**
     * Sets state to button
     * @param state {string} State of button
     */
    VanillaForm.prototype.setSubmitState = function (state) {
        var self = this,
            submit = self.submitButton,
            stateText = submit.getAttribute("data-" + state),
            className = submit.className.replace(/state-[a-z]+/ig, "");

        self.processing = state === "processing";
        submit.className = className + " state-" + state;
        submit.value = stateText;
    };

    /**
     * Validates form. Returns true if validation is ok, false otherwise.
     * Adds an "error" CSS class if some input is invalid.
     * Changes submit value text if error occurred. Error message should be in data-error attribute
     * @returns {Boolean} validation status
     */
    VanillaForm.prototype.validateForm = function () {
        var self = this,
            form = self.form,
            els = form.elements,
            secretField,
            i,
            el,
            error = false,
            formError = false,
            emailPattern = /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        for (i = els.length - 1; i >= 0; --i) {
            el = els[i];
            error = false;

            if (removeErrorBound[el.name]) {
                removeError(self, el);
            }

            if (el.value === "" && el.required) {
                error = true;
            } else {
                if (el.type === "checkbox" && el.required && !el.checked) {
                    error = true;
                }
                if (el.type === "email" && el.value !== "" && !emailPattern.test(el.value)) {
                    error = true;
                }
            }

            if (error) {
                el.classList.add("error");
                removeErrorBound[el.name] = removeError.bind(null, self, el);
                removeErrorBound.length++;
                el.addEventListener("focus", removeErrorBound[el.name], false);
                formError = true;
            } else {
                el.classList.remove("error");
            }

            if (formError) {
                self.setSubmitState("error");
            }
        }

        // Form content is ok, prepare to send
        if (!formError) {
            if (self.formFocused !== true) {
                self.logError(self.dict.markedAsSpamError);
                return false;
            }
            // Create secret field
            secretField = form.querySelector("[name=\"contact_secret\"]");
            if (!secretField) {
                secretField = document.createElement("input");
                secretField.type = "hidden";
                secretField.name = "contact_secret";
                form.appendChild(secretField);
            }
            secretField.value = getPassPhrase();
        }

        // Fix for fixed top on iPad if keyboard is hidden after submit.
        setTimeout(function () {
            window.scrollBy(0, -1);
        }, 1);
        return !formError;
    };

    VanillaForm.prototype.resetForm = function () {
        var self = this,
            formElements = self.form,
            submitButton = self.submitButton,
            tmpElement,
            i;

        for (i = formElements.length - 1; i >= 0; --i) {
            tmpElement = formElements[i];

            if (tmpElement !== submitButton) {
                tmpElement.classList.remove("success");
                tmpElement.value = "";
            }
        }
        self.setSubmitState("initial");
    };

    VanillaForm.prototype.successForm = function () {
        var self = this;
        self.setSubmitState("success");
        self.notify(self.dict.sendSuccess, "success");
    };

    VanillaForm.prototype.processResponse = function (receivedData) {
        var self = this,
            dict = self.dict,
            response;

        try {
            response = JSON.parse(receivedData);
        } catch (e) {
            console.error(e);
            response = {
                result: "ParseError"
            };
        }

        switch (response.result) {
        case "OK":
            self.successForm(dict.sendSuccess);
            setTimeout(self.resetForm.bind(self), 4000);
            break;
        case "NO_SPAM":
            self.logError(dict.markedAsSpamServerError);
            break;
        case "SEND_ERROR":
            self.logError(dict.sendError);
            self.setSubmitState("initial");
            break;
        case "ParseError":
            self.logError(dict.parseResponseError);
            break;
        }
    };

    VanillaForm.prototype.requestStateChange = function () {
        var self = this,
            httpRequest = self.httpRequest;

        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                self.processResponse(httpRequest.responseText);
            } else {
                self.setSubmitState("initial");
                // Don't log status 0, because it's received when timeout occurs
                if (httpRequest.status !== 0) {
                    self.logError(self.dict.httpRequestError.replace("%s", httpRequest.status));
                }
            }
        }
    };

    VanillaForm.prototype.init = function () {
        var self = this,
            form = self.form,
            submit = self.submitButton,
            requiredElements = form.elements,
            tmpElement,
            i;

        // Bind submit event
        form.addEventListener("submit", self.submitForm.bind(self), true);

        //Prepare httpRequest
        if (window.XMLHttpRequest) {
            self.httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject("Microsoft.XMLHTTP")) {
            self.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        self.focusBound = onFieldFocus.bind(null, self);
        if (!self.httpRequest) {
            console.error("Couldn't init XMLHttpRequest");
            return null;
        }

        // BOT prevent
        self.formFocused = false;
        for (i = requiredElements.length - 1; i >= 0; --i) {
            tmpElement = requiredElements[i];
            if (tmpElement.type !== "submit") {
                tmpElement.addEventListener("focus", self.focusBound, false);
            }
        }

        // Set submit initial value
        if (submit.value !== submit.getAttribute("data-initial")) {
            submit.setAttribute("data-initial", submit.value);
            self.setSubmitState("initial");
        }
    };

    VanillaForm.prototype.send = function (formData) {
        var self = this,
            httpRequest = self.httpRequest;

        httpRequest.open("POST", self.url, true);
        httpRequest.timeout = self.responseTimeout;
        httpRequest.ontimeout = function () {
            self.logError(self.dict.timeoutError);
            self.setSubmitState("initial");
        };
        httpRequest.send(formData);
        httpRequest.onreadystatechange = self.requestStateChange.bind(self);
    };

    /**
     * Submits form
     * @param event {Event}
     * @returns {boolean}
     */
    VanillaForm.prototype.submitForm = function (event) {
        var self = this,
            formData = "";

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Validate form
        if (self.validateForm()) {
            self.setSubmitState("processing");
            formData = new FormData(self.form);
            self.send(formData);
        }

        return false;
    };

    return VanillaForm;

//End of wrapping anonymous function
}(window));

//-----------------------
// Animator.js (PNG Animation on Homepage)
//-----------------------

var bind=function(t,i){return function(){return t.apply(i,arguments)}};!function($,t,i){var s;return s=function(){function t(t,i){this.updateBGPosition=bind(this.updateBGPosition,this),this.animate=bind(this.animate,this),this.buildSteps=bind(this.buildSteps,this),this.setInitial=bind(this.setInitial,this),this.getBGSize=bind(this.getBGSize,this),this.options=$.extend({},this.defaults,i),this.$el=$(t),this.getBGSize()}return t.prototype.defaults={frames:10,speed:1e3/30,current:0,adjustments:{}},t.prototype.getBGSize=function(){var t,i;return i=this.$el.css("background-image").slice(4,-1).replace(/["|']/g,""),t=$("<img />").hide(),t.bind("load",function(i){return function(){return i.options.imgWidth=t.width(),i.options.imgHeight=t.height(),t.remove(),i.setInitial()}}(this)),this.$el.append(t),t.attr("src",i)},t.prototype.setInitial=function(){return this.options.width=this.$el.width(),this.options.height=this.$el.height(),this.buildSteps(),this.updateBGPosition()},t.prototype.buildSteps=function(){var t,i,s;for(this.options.cols=Math.floor(this.options.imgWidth/this.options.width),this.options.rows=Math.floor(this.options.imgHeight/this.options.height),this.options.steps={},t=i=0,s=this.options.frames-1;s>=0?s>=i:i>=s;t=s>=0?++i:--i)this.options.steps[t]=this.options.speed;return this.options.steps=$.extend({},this.options.steps,this.options.adjustments)},t.prototype.animate=function(){return this.options.to=setTimeout(function(t){return function(){return t.options.current+=1,t.options.current===t.options.frames&&(t.options.current=0),t.updateBGPosition()}}(this),this.options.steps[this.options.current])},t.prototype.updateBGPosition=function(){var t,i;return t=this.options.current%this.options.cols*this.options.width*-1,i=(Math.ceil((this.options.current+1)/this.options.cols)-1)*this.options.height*-1,this.$el.css({"background-position":t+"px "+i+"px"}),this.animate()},t}(),$.fn.extend({animator:function(t){return this.each(function(){return $(this).data("Animator",new s(this,t))})}})}(jQuery,window,document);

//-----------------------
// Waypoints.js
//-----------------------

/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!
function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.invokeAll("enable")},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=y+l-f,h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();


/*** my WAYPOINTS ***/

$(document).ready(init);

function init(){
	console.log ("ready");
	
	var $showNav = $(".trigger");
	var $navWrap = document.getElementById("navi");
	
	$showNav.waypoint(function(direction){
		if(direction=="down") {
			$navWrap.style.top = "0";
			$('.logo').addClass('navOn');

		}else{
			$navWrap.style.top = "-80px";
			$('.logo').removeClass('navOn');
		}
	});
}