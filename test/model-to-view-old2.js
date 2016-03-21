var Backbone = require('backbone');
var tap = require('tap');
var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var _ = require('lodash');
require('backbone.nativeview');

/**
 *
 * @class
 * @type Backbone.Model
 */
var MyModel = Backbone.Model.extend({});

/**
 *
 * @class
 * @type Backbone.View
 */
var MyView = Backbone.NativeView.extend({
  /**
   * @temporary
   * @constructor
   */
  initialize: function () {
    this.model.on('change', 'render', this);
  },

  /**
   * @temporary
   */
  render: function () {
    console.log('- render');
    this.el.querySelector('.js-target').innerHTML = this.model.get('val');
  }
});

jsdom.jQueryify(
  window,
  'node_modules/jquery/dist/jquery.js',
  function () {
    var document = window.document;
    // global.document = window.document;
    var $ = window.$;
    document.onload = function() {
      console.log('LOAD');
    }
    $('body').prepend('<div class="js-target"></div>');
    // console.log('>>' + $('.js-target').html() + '<<');
    try {
      // Backbone.setDomLibrary = function(lib) {
      //   $ = lib;
      // };
      // Backbone.setDomLibrary(window.$);
      var model = new MyModel();
      // var view = new MyView({ el: '.js-target', model: model });
      model.set('val', 'hello there');
      tap.ok(document.querySelector('.js-target').innerHTML === 'hello there');
    }
    catch (ex) {
      console.error(ex);
    }
  }
);
