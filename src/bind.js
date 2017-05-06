/**
 * A helper for binding request actions to Redux Store.dispatch
 * @external {bindActionCreators} http://redux.js.org/docs/api/bindActionCreators.html
 */

import { bindActionCreators } from 'redux';
import { request } from './factory';

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
export default function bindRequestActions(actions, dispatch) {
  const actionCreators = {};

  Object.keys(actions).forEach(key => {
    if (typeof actions[key] === 'undefined') {
      throw new 'Invalid type undefined in action `bindRequestActions`.';
    }

    actionCreators[key] = request(actions[key]);
  });

  return bindActionCreators(actionCreators, dispatch);
}
