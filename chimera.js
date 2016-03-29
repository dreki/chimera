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
   *
   * @param {Object} params
   * @private
   */
  _updateView: function ( params ) {
    var elsToUpdate = params.elsToUpdate;
    var newValue = params.newValue;
    var i = params.index || 0;
    if (!(elsToUpdate instanceof Array)) {  // support single and multiple
      elsToUpdate = [elsToUpdate];
    }
    elsToUpdate.forEach(_.wrap(newValue,
      function ( newValue, elSelector ) {
        /** @type {Element} */
        var el = this.el.querySelectorAll(elSelector)[i];
        if (el.type) {  // form field support
          el.value = newValue;
        }
        else {
          el.innerHTML = newValue;
        }
      }.bind(this))
    );
    return elsToUpdate;
  },

  /**
   * Create model->view bindings. Supports Collections
   * @private
   */
  _bindViewToModelChanges: function () {
    /** @type Backbone.Model */
    var model = this.model;
    model.on('change', function ( model, meta ) {
      if (meta.isCollection) {
        var collection = meta.collection;
        collection.forEach(function ( model, i ) {

          this._updateView(
            {
              elsToUpdate: this.modelMapping[meta.collectionName],
              newValue: model.get('value'),
              index: i
            }
          )
        }.bind(this));
      }
      else {
        for (var modelFieldName in model.changed) {
          // reqs
          if (!model.changed.hasOwnProperty(modelFieldName)) {
            continue;
          }
          if (!this.modelMapping.hasOwnProperty(modelFieldName)) {
            continue;
          }

          var newValue = model.get(modelFieldName);
          var elsToUpdate = this.modelMapping[modelFieldName];
          this._updateView({elsToUpdate: elsToUpdate, newValue: newValue});
        }
      }

    }.bind(this));
    for (var key in model) {
      if (!model.hasOwnProperty(key)) {
        continue;
      }
      if (this._isModelPropertyCollection(key)) {
        model[key].on('change', _.wrap({collection: model[key], collectionName: key}, function ( params ) {
          model.trigger(
            'change',
            null,
            {isCollection: true, collection: params.collection, collectionName: params.collectionName}
          );
        }));
      }
    }
  },

  /**
   *
   * @param modelField
   * @param selector
   * @param selectors
   * @returns {void}
   * @private
   */
  _bindToModelField: function ( modelField, selector, selectors ) {
    var isCollection = this._isModelPropertyCollection(modelField);
    if (isCollection) {
      this.events['change ' + selector] = function () {
        var collection = this.model[modelField];
        var fields = this.el.querySelectorAll(selectors.join(','));
        for (var j = 0; j < fields.length; j++) {
          var field = fields[j];
          // replace any existing model
          collection.remove(collection.at(j));
          collection.add({value: field.value}, {at: j});
        }
      }.bind(this);
    }
    else {
      // warn if plural
      var fieldExists = this.model.get(modelField);
      var fieldExistsAsProperty = this.model[modelField];
      var fieldIsPlural = pluralize(modelField, 1) !== modelField;
      if (!fieldExists && !fieldExistsAsProperty && fieldIsPlural) {
        console.warn(
          'Chimera.js: Binding to a plural noun (' +
          modelField +
          '). Are you missing a Collection definition?');
      }

      this.events['change ' + selector] = function ( ev ) {
        this.model.set(modelField, ev.currentTarget.value);
      }.bind(this);
    }
  },

  /**
   * Convenience method
   * @param {String} modelField
   * @returns {*|boolean}
   * @private
   */
  _isModelPropertyCollection: function ( modelField ) {
    return this.model[modelField] &&
      this.model[modelField].hasOwnProperty('models');
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
        selectors = [selectors];
      }
      if (selectors.length > 1) {
        selectors.forEach(
          _.wrap(
            {modelField: modelField, selectors: selectors},
            function ( params, selector ) {
              this._bindToModelField(params.modelField, selector, params.selectors);
            }.bind(this)
          )
        );
      }
      else {
        this._bindToModelField(modelField, selectors[0], selectors);
      }
      this.delegateEvents();  // bind new event
    }
  }
};

window.Chimera = Chimera;
module.exports = Chimera;
