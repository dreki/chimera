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
    this.comments = new Backbone.Collection();
  },

  comments: undefined //new Backbone.Collection()
});

/**
 * @class
 * @extends {Backbone.View}
 * @mixes {Chimera}
 */
var MyView = Backbone.View.extend({
  modelMapping: {
    'firstName': '.js-first-name',
    'firstNameForTextInputEl': ['.js-text-input'],
    'comments': ['.js-comment'],
    'buttnut': ['.js-buttnut-1', '.js-buttnut-2']
  },

  /**
   * @constructor
   */
  initialize: function () {
    _.extend(MyView.prototype, Chimera);
    this.initializeChimera();
  }
});

/**
 * Create DOM elements for testing
 * @returns {{mainEl: Element, $mainEl: jQuery, firstNameEl: Element, $firstNameEl: jQuery, textInputEl: Element,
 *   $textInputEl: jQuery}}
 */
var createTestEls;
createTestEls = function () {
  var viewEl = document.createElement('div');  // main parent el
  viewEl.classList.add('js-test-el');
  var firstNameEl = document.createElement('div');
  firstNameEl.classList.add('js-first-name');
  viewEl.appendChild(firstNameEl);
  var textInputEl = document.createElement('input');
  textInputEl.classList.add('js-text-input');
  viewEl.appendChild(textInputEl);
  return {
    mainEl: viewEl,
    $mainEl: $(viewEl),
    firstNameEl: firstNameEl,
    $firstNameEl: $(firstNameEl),
    textInputEl: textInputEl,
    $textInputEl: $(textInputEl)
  };
};

QUnit.test(
  'model-view binding tests',
  function (assert) {
    _.extend(this, assert);  // rather than `assert.ok(...)` etc.
    // model init
    var model = new MyModel();

    // view init
    var testEls = createTestEls();
    document.querySelector('#qunit-fixture').appendChild(testEls.mainEl);
    var view = new MyView({el: testEls.mainEl, model: model});
    ok(view, 'view sanity');
    ok(view.el, 'view.el sanity');
    ok(view._mixinName, 'mixin sanity');

    equal(document.querySelector('.js-test-el').innerText, '', 'initial innerText');

    // binding
    // regular elements
    model.set('firstName', 'Rickety');
    model.set('lastName', 'Fingersplats');
    equal(testEls.firstNameEl.innerText, 'Rickety', 'view updated');

    // form elements
    model.set('firstNameForTextInputEl', 'Rachet');
    equal(testEls.textInputEl.value, 'Rachet');

    // view to model
    $(testEls.textInputEl).val('Clink').trigger('change');
    equal(model.get('firstNameForTextInputEl'), 'Clink');

    // collections
    var inputs =
      crel('ul',
        crel('li',
          crel('input', {class: 'js-comment'})),
        crel('li',
          crel('input', {class: 'js-comment'})),
        crel('li',
          crel('input', {class: 'js-comment'}))
      );
    var $mainEl = testEls.$mainEl;
    $mainEl.append(inputs);
    $mainEl.find('.js-comment:eq(0)').val('a new comment');
    $mainEl.find('.js-comment:eq(1)').val('1 comment');
    $mainEl.find('.js-comment:eq(2)').val('2 comment time');
    $mainEl.find('.js-comment:eq(0)').trigger('change');
    ok(model.comments);  // exist
    ok(model.comments.length === 3);
    ok(model.comments.at(0).get('value') === 'a new comment');
    $mainEl.find('.js-comment:eq(1)').trigger('change');
    $mainEl.find('.js-comment:eq(2)').trigger('change');
    ok(model.comments.at(0).get('value') === 'a new comment');
    ok(model.comments.at(1).get('value') === '1 comment');
    ok(model.comments.at(2).get('value') === '2 comment time');

    // updating collection updates view
    var whatigot = 'life is too short so love the one you got cuz you might get run over or you might get shot';
    model.comments.at(1).set('value', whatigot);
    equal($mainEl.find('.js-comment:eq(1)').val(), whatigot);

    // multiple elements bound to one form field
    $mainEl.append('<div class="js-buttnut-1">');
    $mainEl.append('<div class="js-buttnut-2">');
    equal($mainEl.find('.js-buttnut-1').text(), '');
    equal($mainEl.find('.js-buttnut-2').text(), '');
    model.set('buttnut', 'gravevoice lafalsie');
    equal($mainEl.find('.js-buttnut-1').text(), 'gravevoice lafalsie');
    equal($mainEl.find('.js-buttnut-2').text(), 'gravevoice lafalsie');
  }
);
