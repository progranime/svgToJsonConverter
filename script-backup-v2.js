var AVATAR = AVATAR || {};

(function($){
    "use strict";
    AVATAR.initJSONMaker = {
        init: function(){
            this.globalVar();
            this.domCache();
            this.bindEvents();
        }, 

        globalVar: function() {

            /*this.jsonObj = {
                "avatar-hair-front": {},
                "avatar-hair-back": {},
                "avatar-head": {},
                "avatar-eyebrows": {},
                "avatar-eyes": {},
                "avatar-mouth": {},
                "avatar-upper-body": {},
                "avatar-lower-body": {},
                "avatar-background": {}
            };*/

            this.jsonObj = {
                "male" : {
                    "hair": {},
                    "head": {},
                    "eyebrows": {},
                    "eyes": {},
                    "mouth": {},
                    "upperBody": {},
                    "lowerBody": {},
                    "background": {}
                },
                "female" : {
                    "hair": {},
                    "head": {},
                    "eyebrows": {},
                    "eyes": {},
                    "mouth": {},
                    "upperBody": {},
                    "lowerBody": {},
                    "background": {}
                }
            };

            this.idsClasses = {
                "hf": ["avatar-hair-front", "hair"],
                "hb": ["avatar-hair-back", "hair"],
                "hd": ["avatar-head", "head"],
                "eb": ["avatar-eyebrows", "eyebrows"],
                "o" : ["avatar-eyes", "eyes"],
                "up": ["avatar-mouth", "mouth"],
                "lo": ["avatar-upper-body", "upperBody"],
                "sh": ["avatar-lower-body", "lowerBody"],
                "bg": ["avatar-background", "background"]
            };
        },

        domCache: function() {
            this.$svgField = $(".svgField");
            this.$clear = $(".clear");
            this.$content = $(".content");
            this.$minifyField = $(".minifyField");
            this.$minify = $(".minify");
            this.$jsonField = $(".jsonField");
            this.$json = $(".json");
        },

        bindEvents: function() {
            this.$clear.on('click', AVATAR.initJSONMaker.clearHTML);
            this.$minify.on('click', AVATAR.initJSONMaker.minify);
            this.$json.on('click', AVATAR.initJSONMaker.convertToJson);
        },

        addClass: function() {
            var self, value, html, gArr, match, result;
            self = AVATAR.initJSONMaker;
            value = self.$svgField.val();
            html = $.parseHTML(value);
            self.$content.append(html)
                         .children().addClass('parent');
            gArr = self.$content.find(".parent > g");

            // console.log(gArr);

            $.each(gArr, function() {
                match = self.getMatch($(this));
                if(match != null) {
                    self.addXmlns($(this));
                    // console.log(self.idsClasses[match][0]);
                    $(this).attr('class', self.idsClasses[match][0]);
                    self.addDataAttr($(this).find("path, line, rect"), match.toString());
                    // $(this).removeAttr('id');
                }

            });

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

        convertToJson: function() {
            var self, content, match, gender;
            
            self = AVATAR.initJSONMaker;
            self.addClass();
            content = self.$content.find('.parent');

            $.each(content.children(), function(index, obj) {
                match = self.getMatch($(this));
                gender = self.getGender($(this));

                if(match != null) {
                    // console.log(match.toString());
                    console.log(index);
                    self.passingObj(match.toString(), index, obj, gender);

                }

            });

            self.$jsonField.val(JSON.stringify(self.jsonObj).replace(/(\\n|\\t)/g, ""));
        },

        passingObj: function(part, index, obj, gender) {
            console.log("Part: " + part + "\nIndex: " + index);
            console.log("Classes: " + this.idsClasses[part][1]);
            // console.log("Classes: " + this.jsonObj[this.idsClasses[part]][0]);

            //get gender mhf or fhf by getting the first character of the word
            //either male or female (done)
            // hair-front and back must only in one obj key ex. mhr1
            this.jsonObj[gender][this.idsClasses[part][1]][$(obj).attr('id')] = $(obj)[0].outerHTML.replace(/\"/g,"\'");
        },

        getMatch: function(obj) {
            var id = $(obj).attr('id');
            var match = id.match(/(hf|hb|hd|eb|ey|no|up|lo|sh|bg)/g);

            return match;
        },

        getGender: function(obj) {
            var id = $(obj).attr('id');
            
            return id.substring(0,1) == "m" ? "male" : "female";
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

        clearHTML: function() {
            var self = AVATAR.initJSONMaker;
            // console.log("clear");
            self.$content.empty();
            self.$svgField.val("");
            self.$minifyField.val("");
            self.$jsonField.val("");
        }
        
    }


    // this will initialize the functions
    $(function(){
        // this will call the loadPage.init function
        AVATAR.initJSONMaker.init();
    });

})(jQuery);
