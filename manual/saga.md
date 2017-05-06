# Integration with Redux saga
Working with Redux Saga is simple. Listen for `REQUEST` action types and perform side effects. When your saga is ready to continue, emit a `SUCCESS` or `FAILURE` action to respond to the request.

## Example
```javascript
import { success, failure } from 'redux-actioner';

export function* onTodoAdd(action) {
  const { payload } = action;
  const { text, title } = payload;

  const context = yield {
    item: {
      text,
      title
    }
  };

  const apiRequest = new Request("http://localhost/todo/add", { method: "POST" });

  const responseAction = yield fetch(apiRequest, context)
    .then(body => body.json())
    .then(success(TodoActions.ADD, context))
    .catch(failure(TodoActions.ADD, context));
  yield put(responseAction);
}


export function* todoSaga() {
  yield takeEvery(TodoActions.ADD.REQUEST, onAddTodo);
}
```

In the above example `context` is the API body and is also included in `responseAction.payload` along with the response from the server fetch. The functions `success` and `failure` make it simple to transform payload between request and response actions. This makes the application logic clear and predictable.
