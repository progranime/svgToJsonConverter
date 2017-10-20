var AVATAR = AVATAR || {};

(function($){
    "use strict";
    AVATAR.initJSONMaker = {
        init: function(){
            this.domCache();
            this.bindEvents();

            this.globalVar();
        }, 

        globalVar: function() {

            this.jsonObj = {
                "avatar-hair-front": {},
                "avatar-hair-back": {},
                "avatar-head": {},
                "avatar-eyebrows": {},
                "avatar-eyes": {},
                "avatar-mouth": {},
                "avatar-upper-body": {},
                "avatar-lower-body": {},
                "avatar-background": {}
            };

            this.idsClasses = {
                "hf": "avatar-hair-front",
                "hb": "avatar-hair-back",
                "hd": "avatar-head",
                "eb": "avatar-eyebrows",
                "o" : "avatar-eyes",
                "up": "avatar-mouth",
                "lo": "avatar-upper-body",
                "sh": "avatar-lower-body",
                "bg": "avatar-background"
            };
        },

        domCache: function() {
            this.$svgField = $(".svgField");
            this.$result = $(".result");
            this.$submit = $(".submit");
            this.$clear = $(".clear");
            this.$content = $(".content");
            this.$minifyField = $(".minifyField");
            this.$minify = $(".minify");
            this.$jsonField = $(".jsonField");
            this.$json = $(".json");
        },

        bindEvents: function() {
            this.$submit.on('click', AVATAR.initJSONMaker.addClass);
            this.$clear.on('click', AVATAR.initJSONMaker.clearHTML);
            this.$minify.on('click', AVATAR.initJSONMaker.minify);
            this.$json.on('click', AVATAR.initJSONMaker.convertToJson);
        },

        addClass: function() {

             //clear body content

            var self = AVATAR.initJSONMaker;
            var value = self.$svgField.val();
            var html = $.parseHTML(value);
            self.$content.append(html);
            var gArr = $(".parent > g");
            

            var id, match, result;

            $.each(gArr, function() {
                id = $(this).attr('id');
                match = id.match(/(hf|hb|hd|eb|ey|no|up|lo|sh|bg)/g);
                if(match != null) {
                    self.addXmlns($(this));
                    $(this).attr('class', self.idsClasses[match]);

                    self.addDataAttr($(this).find("path, line, rect"), match.toString());
                    // $(this).removeAttr('id');
                }
            });

            //replace the " with '
            result = self.$content.find(".parent").html().replace(/\"/g,"\'");
            // result = self.$content.find(".parent").html().replace(/\s+/g, ' ');
            self.$result.val(result);

            //remove spaces
            // self.$result.val(self.$content.find(".parent").html().replace(/\s+/g, ' '));


        },

        addDataAttr: function(elemArr,match) {
            var self = AVATAR.initJSONMaker;
            var id;
            
            $.each(elemArr, function(index,val) {

                id = $(this).attr('id').split('_');

                for(var x=0; x < id.length; x++) {
                    self.converting($(this), id[x]);
                }

            });

        },

        addXmlns: function(elem) {

            elem.attr("xmlns", "http://www.w3.org/2000/svg");

        },

        converting: function(elem, id) {
            var convert;
            var style = id.match("fill") ? "fill" : "stroke";

            //replace with hypen the camelCase and lowercase it
            convert = (id.replace(/([a-z](?=[A-Z]))/g, '$1-')).toLowerCase();
            // convert = convert.replace('fill',parts[match]);
            convert = convert.replace('color-','color_');
            convert = convert.replace(style + "-", "");
            elem.attr('data-' + style, convert);
            elem.removeAttr('id');
        },

        clearHTML: function() {
            var self = AVATAR.initJSONMaker;
            console.log("clear");
            self.$content.empty();


            self.$svgField.val("");
            self.$result.val("");
            self.$minifyField.val("");
        },

        minify: function() {
            var self = AVATAR.initJSONMaker;
            var value = self.$minifyField.val();
            var minify = value.replace(/\s+/g, ' ');

            self.$minifyField.val(minify);
            //copy the minified code
            self.$minifyField.select();
            document.execCommand('copy');
        },

        convertToJson: function() {
            var self = AVATAR.initJSONMaker;
            var content = $(".parent");
            var id, match;
            $.each(content.children(), function(index, obj) {
                console.log($(obj).attr('id'));

                id = $(this).attr('id');
                match = id.match(/(hf|hb|hd|eb|ey|no|up|lo|sh|bg)/g);
                if(match != null) {
                    console.log(match.toString());
                    self.passingObj(match.toString(), index, obj);

                }
            });

            console.log(self.jsonObj);
        },

        passingObj: function(part, index, obj) {
            console.log("Part: " + part + "\n" + index);
            this.jsonObj[this.idsClasses[part]][index] = $(obj)[0].outerHTML.replace(/\"/g,"\'");
        }
    }


    // this will initialize the functions
    $(function(){
        // this will call the loadPage.init function
        AVATAR.initJSONMaker.init();
    });

})(jQuery);
