/**
 * @extends {jQuery}
 * @type {jQuery}
 */
var $ = window.Sprint;

/**
 * @class
 * @extends {Backbone.Model}
 * @extends {Chimera}
 */
var MyModel = Backbone.Model.extend({
  /**
   * @constructor
   */
  initialize: function () {
    _.extend(MyModel.prototype, Chimera);
  }
});

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
    _.extend(this, assert);
    // model init
    var model = new MyModel();
    ok(model._mixinName, 'mixin sanity');  // rather than `assert.ok(...)`

    // view init
    var viewEl = document.createElement('div');
    viewEl.classList.add('js-test-el');
    var boundEl = document.createElement('div');
    boundEl.classList.add('js-bound-el');
    viewEl.appendChild(boundEl);
    document.querySelector('#qunit-fixture').appendChild(viewEl);
    var view = new MyView({ el: viewEl });
    ok(view, 'view sanity');
    ok(view.el, 'view.el sanity');
    equal(document.querySelector('.js-test-el').innerText, '', 'initial innerText');

    // binding
  }
);
