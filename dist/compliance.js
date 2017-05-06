"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Ensures that all payloads in actions are in the form of objects
 * @method complianceMiddleware
 * @param  {Object}             store to apply with middleware
 * @return {Function}                 middleware function
 * @example
 * import { applyMiddleware, createStore } from 'redux';
 * const store = createStore(reducers, initialState, applyMiddleware(complianceMiddleware));
 */
var complianceMiddleware = exports.complianceMiddleware = function complianceMiddleware(store) {
  return function (next) {
    return function (action) {
      if ((action.payload || action.actionType) && action.payload instanceof Object === false) {
        throw new Error(action.type + " has payload of type " + _typeof(action.payload) + " should be Object");
      }

      return next(action);
    };
  };
};