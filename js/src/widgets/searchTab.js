(function($) {

    $.SearchTab = function(options) {
        jQuery.extend(true, this, {
            element:           null,
            appendTo:          null,
            manifest:          null,
            visible:           null,
            canvasID: 	null,
            windowId: null,	
        }, options);

        this.init();
    };

    $.SearchTab.prototype = {
        init: function() {
        	console.log("test");
            var _this = this;
            this.windowId = this.windowId;

            this.state({
                id: 'searchTab',
                visible: this.visible,
            }, true);

            this.listenForActions();
            this.render(this.state());
            this.loadTabComponents();
            this.bindEvents();
        },
        state: function(state, initial) {
            if (!arguments.length) return this.searchTabState;
            this.searchTabState = state;

            if (!initial) {
                jQuery.publish('searchTabStateUpdated.' + this.windowId, this.searchTabState);
            }

            return this.searchTabState;
        },
        loadTabComponents: function() {
            var _this = this;

        },
        tabStateUpdated: function(visible) {
            var state = this.state();
            state.visible = state.visible ? false : true;

            this.state(state);
        },
        
        
        toggle: function() {},
        listenForActions: function() {
            var _this = this;

            jQuery.subscribe('searchTabStateUpdated.' + _this.windowId, function(_, data) {
                _this.render(data);
            });

            jQuery.subscribe('tabStateUpdated.' + _this.windowId, function(_, data) {
                _this.tabStateUpdated(data.annotationsTab);
            });

            jQuery.subscribe('currentCanvasIDUpdated.' + _this.windowId, function(event) {


            });

            

        },
        displaySearchWithin: function(query){
		    var _this = this;
		    if (query !== "") {
		      searchService = (_this.manifest.getSearchWithinService());
		      this.searchObject = new $.SearchWithinResults({
		        manifest: _this.manifest,
		        appendTo: _this.element.find(".search-results-list"),
		        panel: true,
		        canvasID: _this.canvasID,
		        windowId: _this.windowId, 
		        imagesList: _this.imagesList,
		        thumbInfo: {thumbsHeight: 80, listingCssCls: 'panel-listing-thumbs', thumbnailCls: 'panel-thumbnail-view'},
		        query: query
		      });
		    }
		 },
        bindEvents: function() {
            var _this = this;
                

            this.element.find(".js-perform-query").on('submit', function(event){
        		event.preventDefault();
        		console.log("test");
        		var query = _this.element.find(".js-query").val();
        		_this.displaySearchWithin(query);
    			});

            //jQuery.subscribe('tabStateUpdated.' + _this.windowId, function(_, data) {
              //  _this.tabStateUpdated(data);
            //});

            

        },
        render: function(state) {
            var _this = this,
                templateData = {
                    
                };
            if (!this.element) {
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            } else {
                _this.appendTo.find(".searchResults").remove();
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            }
            _this.bindEvents();


            if (state.visible) {
                this.element.show();
            } else {
                this.element.hide();
            }
        },
        template: Handlebars.compile([
            '<div class="searchResults">',
                '<form id="search-form" class="js-perform-query">',
                  '<input class="js-query" type="text" placeholder="search"/>',
                  '<input type="submit"/>',
                '</form>',
            '<div class="search-results-list"></div>',
            '</div>',
        ].join(''))
    };

}(Mirador));

