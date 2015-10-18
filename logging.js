;(function($) {
  'use strict';

  /*
   * methods: Plugin public methods
   *
   * You can invoke the methods here through jquery objects.
   *
   * ex.
   * var $inputs = $('.watch-me').logging();
   *
   * $('#stop-button').on('click', function(e) {
   *   $inputs.logging('off');
   * });
   *
   */
  var methods = {
    init: function(options) {
      var settings = $.extend({
        /*
         * Write default options here.
         * Use camelcase for its keys because they'd be overriden with data attributes.
         *   greatWonderfulOption ... OK
         *   great_wonderful_option ... NG
         */
        label: '[changed]',
      }, options);

      return this.each(function() {
        var $this = $(this);
        var logging = new Logging($this, mergeOptions($this, settings));

        // Write initializing code here.
        logging.observe();

        $this.data('plugin_logging', logging);
      });
    },

    off: function() {
      return this.each(function() {
        var logging = $(this).data('plugin_logging');
        logging.stopObserving();
      });
    },
  };

  /*
   * Merge options with each element's data attributes.
   *
   * ex.
   * <input type="text" class="watch-me" data-great-wonderful-option="value" />
   */
  var mergeOptions = function($el, settings) {
    return $.extend({}, settings, $el.data());
  };

  /*
   * Make it jQuery plugin
   */
  $.fn.logging = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.logging');
    }
  };


  /*
   * Plugin class
   */
  var Logging = (function() {

    var NAMESPACE = '.logging';

    /*
     * Constructor
     */
    var Logging = function($el, settings) {
      this.$el = $el;
      this.settings = settings;
    };

    // Class method (if you want)
    // Logging.classMethod = function() {};

    /*
     * Instance methods
     */
    $.extend(Logging.prototype, { /* BaseClass.prototype（if you need）*/ }, {

      observe: function() {
        this.$el.on('focus' + NAMESPACE, this._bind('onFocus'));
        this.$el.on('change' + NAMESPACE, this._bind('onChange'));
      },

      stopObserving: function() {
        this.$el.off(NAMESPACE);
      },

      onFocus: function(e) {
        this.originalValue = this.$el.val();
      },

      onChange: function(e) {
        console.debug([this.settings.label, this.originalValue, '->', this.$el.val()].join(' '));
      },

      /*
       * Bind 'this' on Logging class's instance in indicated functions.
       */
      _bind: function(funcName) {
        var that = this;
        return function() { that[funcName].apply(that, arguments) };
      },
    });

    return Logging;
  })();

})(jQuery);
