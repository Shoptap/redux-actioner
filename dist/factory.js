'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Default method for preparing payload fields
 * @method preparePayload
 * @param  {Object} [value={}] fields to return in payload
 * @return {Object}            payload fields
 */
var preparePayload = function preparePayload() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return value;
};

/**
 * Names for the subtypes of ActionSlice
 * @constant
 * @type {Object}
 * @default
 * @enum {String}
 */
var ActionType = exports.ActionType = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

/**
 * Creates an ActionSlice
 * @method createActionTypeFactory
 * @param  {String}       factoryName                             Namespace for a group of actions
 * @param  {String}       factorySlice                            Namespace for a specific action slice
 * @param  {Function}     [requestPayloadCreator=preparePayload]  For transforming request payloads
 * @return {Function}                                             An action creator function
 */
var createActionTypeFactory = exports.createActionTypeFactory = function createActionTypeFactory(factoryName, factorySlice) {
  var actionTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ActionType;
  var requestPayloadCreator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : preparePayload;

  var BASE_TYPE = factoryName + '/' + factorySlice;

  var namespacedActionTypes = {};
  Object.keys(actionTypes).forEach(function (key) {
    namespacedActionTypes[key] = BASE_TYPE + '/' + actionTypes[key];
  });

  /**
   * An object containing base type, subtypes, and a payload creator
   * @typedef {object} ActionSlice
   * @property {String}     BASE_TYPE                               Action base type with factory and slice name
   * @property {...Object}     ...actionTypes                       Type names for each actionType given
   * @property {Function}   requestPayloadCreator                   For creating payloads of REQUEST actions*
   * @example
   * {
   *  BASE_TYPE: "TODO/ADD",
   *  REQUEST: "TODO/ADD/REQUEST",
   *  SUCCESS: "TODO/ADD/SUCCESS",
   *  FAILURE: "TODO/ADD/FAILURE"
   *  requestPayloadCreator: ({ text, title, listId: list_id }) => ({ text, title, list_id})
   * }
   */
  return Object.assign({}, namespacedActionTypes, {
    BASE_TYPE: BASE_TYPE,
    requestPayloadCreator: requestPayloadCreator
  });
};

/**
 * Creates an object consumable by Redux
 * @typedef {function} ActionCreator
 */

/**
 * Action creator for REQUEST type actions
 * @method request
 * @param  {Object} actionSlice an Action Slice object
 * @return {Function}        an action creator for a Slice's REQUEST type
 * @example
 * request(TodoActions.ADD)({ text: "Do something great." })
 */
var request = exports.request = function request(actionSlice) {
  return function () {
    return {
      type: actionSlice.REQUEST,
      baseType: actionSlice.BASE_TYPE,
      payload: actionSlice.requestPayloadCreator.apply(actionSlice, arguments),
      actionType: ActionType.REQUEST
    };
  };
};

/**
 * Action creator for SUCCESS type actions
 * @method success
 * @param  {Object} actionSlice  an Action Slice object
 * @param  {Object} context a Context payload object
 * @return {ActionCreator}         an action creator for a Slices' SUCCESS type
 * @example
 * request(TodoActions.ADD, { text: "Do something great." })({ itemId: 1 })
 */
var success = exports.success = function success(actionSlice, context) {
  return function (payload) {
    return {
      type: actionSlice.SUCCESS,
      baseType: actionSlice.BASE_TYPE,
      payload: Object.assign({}, context, payload),
      error: null,
      actionType: ActionType.SUCCESS
    };
  };
};

/**
 * Action creator for FAILURE type actions
 * @method failure
 * @param  {Object} actionSlice  an Action Slice object
 * @param  {Object} context a Context payload object
 * @return {ActionCreator}         an action creator for a Slices' FAILURE type
 * @example
 * request(TodoActions.ADD, { text: "Do something great." })(new Error("Please add a title..."))
 */
var failure = exports.failure = function failure(actionSlice) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (payload) {
    return {
      type: actionSlice.FAILURE,
      baseType: actionSlice.BASE_TYPE,
      payload: context,
      error: payload,
      actionType: ActionType.FAILURE
    };
  };
};

/**
 * Creates an Action Factory
 * @method createActionFactory
 * @param  {String}            factoryName Namespace for a group of Action Slices
 * @return {Function}                   A factory function for creating Action Slices in the same namespace
 * @example
 * const createSliceAction = createActionFactory('TODO');
 * export const ADD = createSliceAction('ADD', ({ text, title, listId: list_id })
 *  => ({ text, title, list_id }));
 */
var createActionFactory = exports.createActionFactory = function createActionFactory(factoryName) {
  return (
    /**
     * A function that defines a namespace for creating slices
     * @typedef {function} ActionFactory
     * @return {ActionFactory} ActionSlice creator
     */
    function (factorySlice) {
      var requestPayloadCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : preparePayload;
      var actionTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ActionType;
      return createActionTypeFactory(factoryName, factorySlice, actionTypes, requestPayloadCreator);
    }
  );
};