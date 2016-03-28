/*global define*/
/*global undefined*/
/*eslint camelcase: 0*/
var Backbone = require('backbone');
var lodash = require('lodash');
var pluralize = require('pluralize');

/**
 * Chimera Backbone Model-View binding mixin
 * @mixin
 * @extends {Backbone.View} - Since this will be applied to a Backbone.View
 */
var Chimera = {
  /**
   * @type {String}
   */
  _mixinName: 'chimera',

  /**
   * Set up bindings
   * @returns {void}
   */
  initializeChimera: function () {
    this._bindViewToModelChanges();
    this._bindModelToViewChanges();
  },

  /**
   * Create model->view bindings. Supports Collections
   * @private
   */
  _bindViewToModelChanges: function () {
    this.model.on('change', function (model) {
      for (var modelFieldName in model.changed) {
        // reqs
        if (!model.changed.hasOwnProperty(modelFieldName)) { continue; }
        if (!this.modelMapping.hasOwnProperty(modelFieldName)) { continue; }

        var newValue = model.get(modelFieldName);
        var elsToUpdate = this.modelMapping[ modelFieldName ];
        if (!(elsToUpdate instanceof Array)) {  // support single and multiple
          elsToUpdate = [ elsToUpdate ];
        }
        elsToUpdate.forEach(_.wrap(newValue,
          function (newValue, elSelector) {
            /** @type {Element} */
            var el = this.el.querySelector(elSelector);
            console.log(el);
            if (el.type) {  // form field support
              console.log('- is form field');
              console.log('  - ' + newValue);
              el.value = newValue;
            }
            else {
              el.innerHTML = newValue;
            }
          }.bind(this))
        );
      }
    }.bind(this))
  },

  /**
   *
   * @param modelField
   * @param selector
   * @param selectors
   * @returns {void}
   * @private
   */
  _bindToModelField: function (modelField, selector, selectors) {
    var isCollection =
      this.model[modelField] &&
      this.model[modelField].prototype === new Backbone.Collection().prototype;
    if (isCollection) {
      this.events['change ' + selector] = function () {
        var collection = this.model[modelField];
        var fields = this.el.querySelectorAll(selectors.join(','));
        for (var j = 0; j < fields.length; j++) {
          var field = fields[j];
          // replace any existing model
          collection.remove(collection.at(j));
          collection.add({ value: field.value }, { at: j });
        }
      }.bind(this);
    }
    else {
      // warn if plural
      var fieldExists = this.model.get(modelField);
      var fieldIsPlural = pluralize(modelField, 1) !== 'modelField';
      if (fieldExists && fieldIsPlural) {
        console.warn('Chimera.js: Binding to a plural noun. Are you missing a Collection definition?');
      }

      this.events['change ' + selector] = function (ev) {
        this.model.set(modelField, ev.currentTarget.value);
      }.bind(this);
    }
  },

  /**
   * @private
   * @returns {void}
   */
  _bindModelToViewChanges: function () {
    if (!this.events) {
      this.events = {};
    }
    for (var modelField in this.modelMapping) {
      if (!this.modelMapping.hasOwnProperty(modelField)) {
        continue;
      }
      /** @type {String[]} */
      var selectors = this.modelMapping[modelField];
      if (!(selectors instanceof Array)) {
        selectors = [ selectors ];
      }
      if (selectors.length > 1) {
        selectors.forEach(_.wrap({ modelField: modelField, selectors: selectors }, function (params, selector) {
          this._bindToModelField(params.modelField, selector, params.selectors);
        }.bind(this)));
      }
      else {
        this._bindToModelField(modelField, selectors[0], selectors);
      }
      this.delegateEvents();  // bind new event
    }
  }
};

window.Chimera = Chimera;


/**
 * @class {QuizView}
 * @type {Backbone.View}
 * @deprecated
 */
var QuizView = Backbone.View.extend({
  manage: false,  // no layoutmanager

  /**
   * @type {QuizModel}
   */
  model: undefined,

  // EventManager support
  eventManagerEvents: {
    'superlist:sub_buzz:quiz:validate': '_onValidate',
    'quizEditor:save': '_onValidate'
  },

  // model<->view bindings
  /** @type {Object} */
  modelMapping: {
    'description': '.js-qq-form-description',
    'resultDescriptions': '.js-qr-form-description',
    'questions': '.js-qq-form-question',
    'customShareTexts': '.js-qr-custom-share-text',
    'answers': ['.js-qq-answers-add-answer', '.js-qa-form-answer'],
    'imageCredits': '.js-qq-form-credit',
    'shareVerb': '.js-qe-result-share-text-verb',
    'shareSubject': 'js-qe-result-share-text-subject',
  },

  /**
   * Update the DOM with values from the model
   * @returns {void}
   */
  syncWithModel: function () {
    for (var key in this.modelMapping) {
      if (!this.modelMapping.hasOwnProperty(key)) {
        continue;
      }
      /** @type {String[]} */
      var selectors = this.modelMapping[key];
      if (!(selectors instanceof Array)) {  // standardize
        selectors = [selectors,];
      }
      var els = [];
      var values = [];
      // collect model data
      if (this.model[key] instanceof Backbone.Collection) {  // collection support
        values = this.model[key].toJSON();
        values = _.map(values, function (obj) {
          return obj.value;
        });
      }
      else {
        values = [this.model.get(key),];
      }
      // collect el(s) to update
      selectors.forEach(function (selector) {
        var foundEls = this.el.querySelectorAll(selector);
        for (var j = 0; j < foundEls.length; j++) {
          var foundEl = foundEls[j];
          els.push(foundEl);
        }
      }.bind(this));
      for (var i = 0; i < values.length; i++) {
        var el = els[i];
        if (!el) {  // no more els to fill in
          break;
        }
        var value = values[i];
        if (el.nodeName.toLowerCase() === 'input' || el.nodeName.toLowerCase() === 'textarea') {
          el.value = value;
        }
        else {
          el.innerHTML = value;
        }
      }
    }
  },

  _bindToModelField: function (modelField, selector, selectors) {
    if (this.model[modelField] instanceof Backbone.Collection) {
      this.events['change ' + selector] = function () {
        var collection = this.model[modelField];
        var fields = this.el.querySelectorAll(selectors.join(','));
        for (var j = 0; j < fields.length; j++) {
          var field = fields[j];
          // replace any existing model
          collection.remove(collection.at(j));
          collection.add({value: field.value,}, {at: j,});
        }
      }.bind(this);
    }
    else {
      this.events['change ' + selector] = function (ev) {
        this.model.set(modelField, ev.currentTarget.value);
      }.bind(this);
    }
  },

  bindViewChangesToModel: function () {
    console.debug('bindViewChangesToModel');
    if (!this.events) {
      this.events = {};
    }
    for (var modelField in this.modelMapping) {
      if (!this.modelMapping.hasOwnProperty(modelField)) {
        continue;
      }
      /** @type {String[]} */
      var selectors = this.modelMapping[modelField];
      if (!(selectors instanceof Array)) {
        selectors = [selectors,];
      }
      if (selectors.length > 1) {
        selectors.forEach(_.wrap({modelField: modelField, selectors: selectors,}, function (params, selector) {
          this._bindToModelField(params.modelField, selector, params.selectors);
        }.bind(this)));
      }
      else {
        this._bindToModelField(modelField, selectors[0], selectors);
        // this.events[ 'change ' + selectors[ 0 ] ] = _.wrap(modelField, function (modelField, ev) {
        //   this.model.set(modelField, ev.currentTarget.value);
        // }.bind(this));
      }
      // --- old below ---
      // for (var i = 0; i < selectors.length; i++) {
      //   var selector = selectors[ i ];
      //   if (this.model[ modelField ] instanceof Backbone.Collection) {
      //     this.events[ 'change ' + selector ] = _.wrap({modelField: modelField, i: i, }, function (params, ev) {
      //
      //       var collection = this.model[ params.modelField ];
      //       // replace any existing model
      //       collection.remove(collection.at(params.i));
      //       collection.add({ value: ev.currentTarget.value, }, { at: params.i, });
      //     }.bind(this));
      //   }
      //   else {
      //     debugger;
      //     this.events[ 'change ' + selector ] = _.wrap(modelField, function (field, ev) {
      //       debugger;
      //       this.model.set(field, ev.currentTarget.value);
      //     }.bind(this));
      //   }
      //
      //   this.delegateEvents();  // bind new event
      // }
      this.delegateEvents();  // bind new event
    }
  },

  /**
   * @Constructor
   * @returns {void}
   */
  initialize: function () {
    if (Base.View._.prototype.initialize) {  // call super method
      Base.View._.prototype.initialize.apply(this, arguments);
    }
    utils.feature('QuizView init', function () {
      _.extend(this, utils.BackboneMixins.Model.EventManagerListener);
      utils.BackboneMixins.Model.EventManagerListener.initializeEventManagerListener.apply(this);

      // _.extend(QuizView.prototype, utils.BackboneMixins.View.ValidatingView);
      // this.initializeValidatingView({ label: 'Quiz' });

      this.bindViewChangesToModel();
      this.model.on('change', this.render, this);
      this.model.on('validated', this._validationCallback, this);

      this.render();
    }.bind(this));
  },

  /**
   * Called when validation runs
   * @param {boolean} isValid - Did validation pass?
   * @param {QuizModel} model - The model
   * @param {Array} errors - Any errors found
   * @private
   * @returns {void}
   * @callback
   */
  _validationCallback: function (isValid, model, errors) {
    if (!isValid) {
      this._clearErrors();  // Remove existing errors before adding new ones
      this._displayErrors(errors);
    }
    else {
      this._clearErrors();
    }
  },

  /**
   * Run model validations
   * @private
   * @return {void}
   */
  _validateModel: function () {
    this.model.validate();
  },

  /**
   * Create an Element displaying an error for a form field
   * @param {String} errorMessage - The error message to display
   * @returns {Element} - The new element, ready for use in the DOM
   * @private
   */
  _createErrorLabelEl: function (errorMessage) {
    var solidWrapper = document.createElement('div');
    solidWrapper.classList.add('solid');
    var errLabelWrapper = document.createElement('fieldset');
    errLabelWrapper.classList.add('fieldset');
    errLabelWrapper.classList.add('form-fieldset--error');
    solidWrapper.appendChild(errLabelWrapper);
    var errLabel = document.createElement('div');
    errLabel.classList.add('validation-error');
    errLabel.classList.add('form-feedback');
    errLabel.classList.add('js-validation-error');
    errLabel.classList.add('xs-mt0');
    errLabel.textContent = errorMessage;
    errLabelWrapper.appendChild(errLabel);
    return solidWrapper;
  },

  /**
   * Display any encountered validation errors
   * @param {Object} errors - Strings and arrays of objects representing validation errors
   * @private
   * @return {void}
   */
  _displayErrors: function (errors) {
    for (var modelFieldName in errors) {
      if (!errors.hasOwnProperty(modelFieldName)) {
        continue;
      }
      var fieldErrors = errors[modelFieldName];
      if (!(fieldErrors instanceof Array)) {
        fieldErrors = [fieldErrors,];
      }
      var selectors = this.modelMapping[modelFieldName];
      if (!(selectors instanceof Array)) {
        selectors = [selectors,];
      }
      fieldErrors.forEach(_.wrap(selectors, function (selectors, err) {
        // Elements bound to this model field
        var els = this.el.querySelectorAll(selectors.join(','));
        // Element for the current collection index
        /** @type {Element} */
        var el = els[err.index];
        var errorMessageEl = this._createErrorLabelEl(err.error);
        this._errorLabels.push(errorMessageEl);  // so we can remove it later
        $(errorMessageEl).insertAfter(el);
      }.bind(this)));
    }
  },

  /**
   * Remove any displayed errors
   * @private
   * @returns {void}
   */
  _clearErrors: function () {
    if (this._errorLabels) {
      this._errorLabels.forEach(function (errEl) {
        errEl.parentNode.removeChild(errEl);
      }.bind(this));
    }
    this._errorLabels = [];
  },

  /**
   * When told it's time to validate
   * @returns {void}
   * @private
   */
  _onValidate: function () {
    utils.feature('Quiz validation', function () {
      this._validateModel();
    }.bind(this));
  },

  /**
   * @returns {void}
   */
  render: function () {
    // this.stickit();
    this.syncWithModel();
  }
});

// return QuizView;
module.exports = Chimera;
