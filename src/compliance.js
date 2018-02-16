/**
 * Ensures that all payloads in actions are in the form of objects
 * @method complianceMiddleware
 * @return {Function}                 middleware function
 * @example
 * import { applyMiddleware, createStore } from 'redux';
 * const store = createStore(reducers, initialState, applyMiddleware(complianceMiddleware));
 */
export const complianceMiddleware = () => next => action => {
  if ((action.payload || action.actionType) && action.payload instanceof Object === false) {
    throw new Error(`${action.type} has payload of type ${typeof action.payload} should be Object`);
  }

  return next(action);
};
