# Redux Actioner
Make Redux actions simple, predictable, and maintainable.

# Introduction
Creating actions should be easy and consistent. Inspired by Flux Standard Actions, this framework facilitates the implementation of Redux actions for the sake of simplicity, testing, and maintainability.

# Installation
```
yarn add redux-actioner
```

## Simplicity
Manage your actions like reducers. Redux Actioner provides `createActionFactory` which you can use to namespace your actions and add **Action Slices** that are broken down into three types: `REQUEST`, `SUCCESS`, and `FAILURE`.

```javascript
{
  type: 'TODO/ADD/REQUEST',
  baseType: 'TODO/ADD',
  payload: {
    text: 'Do something great.'
  },
  actionType: 'REQUEST'
}
```
Here is our `REQUEST` action that is namespaced in the `TODO` factory > `ADD` slice. The `baseType` property contains the factory namespace and the slice name for the ease of handling in reducers.

## Maintainability
Redux Actioner abstracts the frustration from creating objects and maintaining an application. Request action creators are reusable and easy to update when your API changes. Components remain pure of API versioning and integration with [Redux Saga](https://github.com/redux-saga/redux-saga) and [Redux Observable](https://github.com/redux-observable/redux-observable) is seamless.

## Usage
### Define Actions
```javascript
import { createActionFactory, request } from 'redux-actioner';
const createSliceAction = createActionFactory('TODO');

export const ADD = createSliceAction('ADD', ({ text, title, listId: list_id })
  => ({ text, title, list_id }));

/*
ADD = {
  baseType: 'TODO/ADD',
  REQUEST: 'TODO/ADD/REQUEST',
  SUCCESS: 'TODO/ADD/SUCCESS',
  FAILURE: 'TODO/ADD/FAILURE',
  requestPayloadCreator: ({ text, title, listId: list_id })
    => ({ text, title, list_id }))
}
*/
```
In the example above we have created a namespace called "TODO" and added an action to it called "ADD." In the comment we can see the `baseType` is `TODO/ADD` which will make it easy to bind and reduce. The payload creator is included for creating request action types which makes for a predictable payload.


### Bind to Dispatch
```javascript
import { connect } from 'react-redux';
import { bindRequestActions } from 'redux-actioner';
import * as TodoActions from '../actions';

class TodoForm extends React.Component {
  state = { text: "Do something greatest.", title: "Tomorrow..." }

  onSubmit() {
    this.props.actions.addTodoItem({
      listId: this.props.listID,
      ...this.state.form
    });
  }

  render() {
    <Form onSubmit={() => this.onSubmit()} />
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindRequestActions({
      addTodoItem: TodoActions.ADD
    }, dispatch);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoForm);
```

The example above will feel familiar with the only difference being that Actioner does not require action creators in your components. ActionSlice objects are given to `bindRequestActions` which will return an object of action creators similar to Redux's `bindActionCreators`. This keeps components clean of API changes and minimizes redundancies.

### Reduce and Slice

```javascript
import * as TodoActions from '../actions';

function todoReducer(state = { items: [], isSubmitting: null }, action) {
  const { baseType } = action;

  switch(baseType) {
    case TodoActions.ADD.BASE_TYPE:
      return addSlice(state, action);
    case TodoActions.REMOVE.BASE_TYPE:
      return removeSlice(state, action);
  }
}

function addSlice(state, action) {
  const { actionType, payload } = action;
  switch (actionType ) {
    case 'REQUEST':
      return { ...state, isSubmitting: true };
    case 'SUCCESS':
      const newTodo = { createdAt: new Date(), ...payload };
      return { isSubmitting: false, items: state.items.concat(newTodo) };
    break;
  }
}
```

In the example above you will see our `todoReducer` which has been abstracted into slices to deal with ActionSlice types. When working with large reducers and many actions it becomes a necessity to break out into slices. The end result is cleaner and easier to manage.

### Action Context
When managing side effects it can be difficult to keep track of data as it flows from action to action. Maintaining context is important to ensure actions that respond to requests can resolve later on when reducing.

Payload data from a request action can be abstracted and dispatched in success or failure actions by providing `context` to `success(actionSlice, context)` or `failure(actionSlice, context)`:

```javascript
const requestAction = request(TodoActions.ADD)({ text: "Do something most great."});
const { payload } = requestAction;
const { text } = payload;
fetch(apiRequest)
  .then(response =>
    const successAction = success(TodoActions.ADD, { text })(response);
    store.dispatch(successAction);
  )
  .catch(error =>
    const errorAction = failure(TodoActions.ADD, { text })(error);
    store.dispatch(errorAction);
  );
```

## Testing
By using standardized payload creators, action data becomes more predictable and easier to test.

The payload to a `REQUEST` action is reduced through a function to prepare the `payload` parameters for dispatch. It makes API changes flexible and easy to manage in action creators.


```javascript
describe("TODO/ADD request action", () => {
  const payload = { text: 'Do something greater.', title: 'Today...', listId: 1 };

  it("converts from camel case to snake case", () => {
    expect(request(TodoActions.ADD)(payload))
      .toEqual(jasmine.objectContaining({
        text: payload.text,
        title: payload.title,
        list_id: payload.listId
      }));
  }
})
```

# Manual

- [API Reference](https://Shoptap.github.io/redux-actioner)
- [Integration with Redux Saga](/manual/saga.md)
- [Integration with Redux Observable](/manual/observable.md)

# Contributors
- [Peter Salanki](https://github.com/salanki)
- [Cole Turner](https://github.com/colepatrickturner)
