/*jslint bitwise: false, browser: true, evil: false, white: false, plusplus: true, evil:true, regexp:true */

/*! v 0.0.1 - 25 August 2014. Author: Scott van Looy. (C) Copyright AKQA 2014. All Rights Reserved. */

(function () {
    function createAccordion($) {
        "use strict";
        /**
         * Accordion plugin
         * @param  {options} options see below:
         * options {
         *    see above
         * }
         * @return {jQueryObject}         the object passed in.
         */
        function Accordion(options, tablet) {
            
            return {
                moveto : scrollto,
                forward: function () {
                    scrollto(activeSection + 1);
                },
                back: function () {
                    scrollto(activeSection - 1);
                },
                currentOpenSection : function () {
                    return activeSection;
                }
            };
        }
        /**
         * AccordionDispatcher works out what platform we are on and what type of Accordion to build.
         * @param {object} tablet the options for a Accordion on a tablet
         * @param {object} mobile the options for a Accordion on a mobile.
         */
        function AccordionDispatcher(tablet, mobile) {
            if (!mobile) {
                return new Accordion(tablet);
            }
            if (/ipad/i.test(navigator.appVersion) || window.screenX !== 0 || !('ontouchstart' in window) || ((window.screen.width > 1023) && (/android/i.test(navigator.appVersion) && !/mobile/i.test(navigator.appVersion)))) {
                return new Accordion(tablet, true);
            }
            return new Accordion(mobile, false);
        }
        /**
         * jQuery Accordion plugin
         * @param  {object|string} func   Because the Accordion can be called after instantiation with strings that offer functionality, there's two types of first argument.
         *                                When the Accordion is first instantiated, you have to pass in an options object as detailed above. Optionally you can pass in two, one
         *                                for tablet and one for mobile if you have differing behaviours for the two of them.
         * @param  {object} tablet        The options for a tablet Accordion
         * @param  {object} mobile        The options for a mobile Accordion
         * @return {jQueryObject}         The original jqobject this was attached to
         */
        $.fn.akaccordion = function (func, tablet, mobile) {
            if (typeof func !== "string") {
                this.each(function () {
                    var ctablet,
                        cmobile;
                    if (tablet) {
                        cmobile = $.extend({}, tablet);
                        cmobile.node = $(this);
                    }
                    ctablet = $.extend({}, func);
                    ctablet.node = $(this);
                    if (mobile && mobile.node) {
                        cmobile = $.extend({}, mobile);
                        cmobile.node = $(this);
                    }
                    this.akaccordion = new AccordionDispatcher(ctablet, cmobile);
                });
            } else {
                if (func === "move") {
                    this.each(function () {
                        if (this.akaccordion) {
                            if (!isNaN(tablet)) {
                                this.akaccordion.moveto(tablet);
                                return;
                            }
                            if (tablet.indexOf('+') !== -1) {
                                this.akaccordion.forward();
                                return;
                            }
                            if (tablet.indexOf('-') !== -1) {
                                this.akaccordion.back();
                            }
                            return;
                        }
                    });
                    return this;

                } else if (func === "realign") {
                    var ret;
                    this.each(function () {
                        if (this.akaccordion) {
                            this.akaccordion.moveto(this.akaccordion.currentSlide());
                        }
                    });
                    return ret;

                } else if (func === "suspend") {
                    this.each(function () {
                        if (this.akaccordion && this.akaccordion.suspend) {
                            this.akaccordion.suspend();
                        }
                    });
                } else if (func === "resume") {
                    this.each(function () {
                        if (this.akaccordion && this.akaccordion.resume) {
                            this.akaccordion.resume();
                        }
                    });
                } else {
                    if (window.console && window.console.warn) {
                        window.console.warn(this, 'Accordion: function ' + func + ' not recognised');
                    }
                }
            }
            return this;
        };
    }
    function load () {
        if ((window.jQuery || window.Zepto) && ((window.jQuery || window.Zepto).fn || {}).akscroller) {
            createAccordion(window.jQuery || window.Zepto);
        } else {
            setTimeout(load, 100);
        }
    }
    load();
}());
