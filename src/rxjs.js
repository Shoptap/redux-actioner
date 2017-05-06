/**
 * A RXJS Observable type for Redux Observable
 * @external {Observable} http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
 */

import { Observable } from 'rxjs';
import { success, failure } from './factory';

/**
 * Appends a catch to a call for handling `failure` action with the error as payload.
 * Best used with the this-bind syntax, ie: obs::action(LOAD_TODOS)
 *
 * @method mapAction
 * @param  {Object}  actionSlice the Action Slice object
 * @param  {Object}  context    a Context payload object
 * @return {Observable}
 */
export const failureObs =
  (actionSlice, context) =>
    (payload) =>
      Observable.of(failure(actionSlice, context)(payload));


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
export function catchAction(actionSlice, context) {
  return this.catch(e => failureObs(actionSlice, context)(e));
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
export function mapAction(actionSlice, context) {
  const self = this.map(success(actionSlice, context));
  return catchAction.apply(self, [actionSlice, context]);
}
