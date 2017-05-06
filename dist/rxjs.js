'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failureObs = undefined;
exports.catchAction = catchAction;
exports.mapAction = mapAction;

var _rxjs = require('rxjs');

var _factory = require('./factory');

/**
 * Appends a catch to a call for handling `failure` action with the error as payload.
 * Best used with the this-bind syntax, ie: obs::action(LOAD_TODOS)
 *
 * @method mapAction
 * @param  {Object}  actionSlice the Action Slice object
 * @param  {Object}  context    a Context payload object
 * @return {Observable}
 */
/**
 * A RXJS Observable type for Redux Observable
 * @external {Observable} http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
 */

var failureObs = exports.failureObs = function failureObs(actionSlice, context) {
  return function (payload) {
    return _rxjs.Observable.of((0, _factory.failure)(actionSlice, context)(payload));
  };
};

/**
 * Appends a catch to a call for handling `failure` action with the error as payload.
 * Best used with the this-bind syntax, ie: obs::action(LOAD_TODOS)
 *
 * @method mapAction
 * @param  {Object}  actionSlice the Action Slice object
 * @param  {Object}  context    a Context payload object
 * @return {Observable}
 * @this-bind
 */
function catchAction(actionSlice, context) {
  return this.catch(function (e) {
    return failureObs(actionSlice, context)(e);
  });
}

/**
 * Wrap data in a this-bound observable to success/failure actions based on observable state
 *
 * A `catch` transformation is run on this observable converting the failed observable to one carrying the `failure` action with the error as payload.
 * Best used with the this-bind syntax, ie: obs::action(LOAD_TODOS)
 *
 * @method mapAction
 * @param  {Object}  actionSlice the Action Slice object
 * @param  {Object}  context    a Context payload object
 * @return {Observable}
 * @this-bind
 */
function mapAction(actionSlice, context) {
  var self = this.map((0, _factory.success)(actionSlice, context));
  return catchAction.apply(self, [actionSlice, context]);
}