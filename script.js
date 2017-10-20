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
                "hf": {
                    "class": "avatar-hair-front",
                    "bodyPart": "hair"
                },
                "hb": {
                    "class": "avatar-hair-back",
                    "bodyPart": "hair"
                },
                "hd": {
                    "class": "avatar-head",
                    "bodyPart": "head"
                },
                "eb": {
                    "class": "avatar-eyebrows",
                    "bodyPart": "eyebrows"
                },
                "o": {
                    "class": "avatar-eyes",
                    "bodyPart": "eyes"
                },
                "up": {
                    "class": "avatar-mouth",
                    "bodyPart": "mouth"
                },
                "lo": {
                    "class": "avatar-upper-body",
                    "bodyPart": "upperBody"
                },
                "sh": {
                    "class": "avatar-lower-body",
                    "bodyPart": "lowerBody"
                },
                "bg": {
                    "class": "avatar-background",
                    "bodyPart": "background"
                }
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
            //get the value of svg
            value = self.$svgField.val();
            //parse in HTML in order to add it in document
            html = $.parseHTML(value);
            self.$content.append(html)
                         .children().addClass('parent');
            //find all children with parent class
            gArr = self.$content.find(".parent > g");

            $.each(gArr, function() {
                //get the match to know which body part is selected
                match = self.getMatch($(this));
                if(match != null) {
                    self.addXmlns($(this));
                    $(this).attr('class', self.idsClasses[match]["class"]);
                    self.addDataAttr($(this).find("path, line, rect"), match.toString());
                    //delete id
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
                    self.convertIdToDataAttr($(this), id[x]);
                }

            });

        },

        addXmlns: function(elem) {
            elem.attr("xmlns", "http://www.w3.org/2000/svg");
        },

        convertIdToDataAttr: function(elem, id) {
            var convert;
            var style = id.match("fill") ? "fill" : "stroke";

            //replace with hypen the camelCase and lowercase it
            convert = (id.replace(/([a-z](?=[A-Z]))/g, '$1-')).toLowerCase();
            convert = convert.replace('color-','color_');
            convert = convert.replace(style + "-", "");
            elem.attr('data-' + style, convert);
            elem.removeAttr('id');
        },

        convertToJson: function() {
            var self, content, match, gender, pointer;
            
            self = AVATAR.initJSONMaker;

            self.addClass();

            content = self.$content.find('.parent');

            $.each(content.children(), function(index, obj) {
                match = self.getMatch($(this));
                gender = self.getGender($(this));
                pointer = self.getIndex($(this));

                if(match != null) {
                    // console.log(match.toString());
                    console.log(index);
                    self.passingObj(match.toString(), index, obj, gender, pointer);

                }

            });

            self.$jsonField.val(JSON.stringify(self.jsonObj).replace(/(\\n|\\t)/g, ""));
        },

        passingObj: function(part, index, obj, gender, pointer) {
            console.log("Part: " + part + "\nIndex: " + index);
            console.log("Classes: " + this.idsClasses[part]["bodyPart"]);
            // console.log("Classes: " + this.jsonObj[this.idsClasses[part]]["class"]);

            //get gender mhf or fhf by getting the first character of the word
            //either male or female (done)
            // hair-front and back must only in one obj key ex. mhr1
            if(part == "hf" || part == "hb") {
                console.log("hair");
                console.log("Object: " + this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][ gender.charAt(0) + "hr" + pointer ]);

                // (this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][ gender.charAt(0) + "hr" + pointer ]) == "undefined" ? "" : "";

                this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][ gender.charAt(0) + "hr" + pointer ] += $(obj)[0].outerHTML.replace(/\"/g,"\'");
                // console.log(this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][ gender.charAt(0) + "hr" + pointer ].match("undefined"));
            } else { 
                console.log("not hair");
                // console.log("Gender: " + gender);
                if(gender.charAt(0) == "u") {
                    //Change the the initial with "m" and "f"
                    console.log("Unisex");
                    this.jsonObj[ "male" ][ this.idsClasses[ part ]["bodyPart"] ][$(obj).attr('id').replace("u", "m")] = $(obj)[0].outerHTML.replace(/\"/g,"\'");
                    this.jsonObj[ "female" ][ this.idsClasses[ part ]["bodyPart"] ][$(obj).attr('id').replace("u", "f")] = $(obj)[0].outerHTML.replace(/\"/g,"\'");
                }else {
                    this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][$(obj).attr('id')] = $(obj)[0].outerHTML.replace(/\"/g,"\'");
                }

            }
            // this.jsonObj[ gender ][ this.idsClasses[ part ]["bodyPart"] ][$(obj).attr('id')] = $(obj)[0].outerHTML.replace(/\"/g,"\'");

        },

        getMatch: function(obj) {
            var id = $(obj).attr('id');
            var match = id.match(/(hf|hb|hd|eb|ey|no|up|lo|sh|bg)/g);

            return match;
        },

        getGender: function(obj) {
            var initial = $(obj).attr('id').charAt(0);
            var gender = "";
            // return $(obj).attr('id').substring(0,1) == "m" ? "male" : "female";

            if(initial == "m") {
                gender =  "male";
            } else if(initial == "f"){
                gender = "female";
            } else{
                gender = "unisex";
            }

            return gender;
        },

        getIndex: function(obj) {
            return $(obj).attr('id').match(/[0-9]/g);
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
