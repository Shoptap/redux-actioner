'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindRequestActions;

var _redux = require('redux');

var _factory = require('./factory');

/**
 * Takes an object with keys as function names and values of action factory slices
 * @method bindRequestActions
 * @param  {Object}           actions  to be bound to redux store dispatch
 * @param  {Function}         dispatch via redux
 * @return {Object}                    an object containing action creators of REQUEST type
 * @example
 * const mapDispatchToProps = (dispatch) => {
 *  return {
 *    actions: bindRequestActions({
 *      addTodoItem: TodoActions.ADD
 *    }, dispatch);
 *  };
 * };
 */
/**
 * A helper for binding request actions to Redux Store.dispatch
 * @external {bindActionCreators} http://redux.js.org/docs/api/bindActionCreators.html
 */

function bindRequestActions(actions, dispatch) {
  var actionCreators = {};

  Object.keys(actions).forEach(function (key) {
    if (typeof actions[key] === 'undefined') {
      throw new 'Invalid type undefined in action `bindRequestActions`.'();
    }

    actionCreators[key] = (0, _factory.request)(actions[key]);
  });

  return (0, _redux.bindActionCreators)(actionCreators, dispatch);
}