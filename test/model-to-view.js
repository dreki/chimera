/**
 * @extends {jQuery}
 * @type {jQuery}
 */
var $ = window.Sprint;

/**
 * @class
 * @extends {Backbone.Model}
 */
var MyModel = Backbone.Model.extend({});

/**
 * @class
 * @extends {Backbone.View}
 */
var MyView = Backbone.View.extend({
  /**
   * @constructor
   */
  initialize: function() {
    if (Backbone.View.prototype.initialize) {  // call super method
      Backbone.View.prototype.initialize.apply(this, arguments);
    }
    console.log('- here');
    console.log(this.el);
  }
});


QUnit.test(
  'model-view binding tests',
  function (assert) {
    var viewEl = document.createElement('div');
    viewEl.classList.add('js-test-el');
    var view = new MyView({ el: viewEl });
    assert.ok(view);
    assert.ok(view.el);
  }
);
