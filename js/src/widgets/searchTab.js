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
      var _this = this;
      this.windowId = this.windowId;

      this.state({
        id: 'searchTab',
        visible: this.visible,
      }, true);

      this.listenForActions();
      this.render(this.state());
      this.loadTabComponents();
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

    tabStateUpdated: function(data) {
      if (data.tabs[data.selectedTabIndex].options.id === 'searchTab') {
        this.element.show();
      }
      else {
        this.element.hide();
      }
    },

    toggle: function() {},

    listenForActions: function() {
      var _this = this;

      //jQuery.subscribe('searchTabStateUpdated.' + _this.windowId, function(_, data) {
      //    _this.render(data);
      //});

      jQuery.subscribe('tabStateUpdated.' + _this.windowId, function(_, data) {
        _this.tabStateUpdated(data);
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
    		var query = _this.element.find(".js-query").val();
    		_this.displaySearchWithin(query);
			});

      this.element.find(".js-search-expand").on('click', function(event){
        event.preventDefault();

        _this.element.find(".js-search-expanded").slideToggle("slow", function(){
        });

        if (jQuery(this).text() === "more"){
          jQuery(this).html("less");
        }
        else if (jQuery(this).text() === "less"){
          jQuery(this).html("more");
        }
      });

    },

    render: function(state) {
      var _this = this;

      templateData = {
        searchService: this.manifest.getSearchWithinService()["@id"]
      };

      if (!this.element) {
        this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
        _this.bindEvents();
      } else {
        _this.appendTo.find(".searchResults").remove();
        this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
      }

      if (state.visible) {
        this.element.show();
      } else {
        this.element.hide();
      }
    },

    template: Handlebars.compile([
      '<div class="searchResults">',
        '<select style="width: 100%">',
          '<option>Select Search Services</option>',
          '<option>{{ searchService }}</option>',
        '</select>',
        '<form id="search-form" class="js-perform-query">',
          '<input class="js-query" type="text" placeholder="search"/>',

          '<input style="margin: 10px 0" type="submit"/>',

          '<a class="js-search-expand" style="display: block; margin: 0 0 5px 0">more</a>',
          '<div class="js-search-expanded" style="display: none;">',
            '<input class="js-motivation" type="text" placeholder="painting"/>',
            '<input class="js-date" type="text" placeholder="date"/>',
            '<input class="js-user" type="text" placeholder="user"/>',
            '<input class="js-box" type="text" placeholder="box"/>',
          '</div>',
        '</form>',
        '<div class="search-results-list"></div>',
      '</div>',
    ].join(''))
  };

}(Mirador));
