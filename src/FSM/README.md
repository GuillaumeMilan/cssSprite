# FSM manager

This package implement a Finite State and Transitions Machine handler.
It doesn't handle the transactionality.

In this package we use the following types:

```javascript
state: String()
action: String()
data: any()
action_result: {
}
```

## Design
Before declaring transactional object, you should design the behavior they will respect. It can be done as follows:

```javascript
const myFSMTransitions = new FSMTransitions()

myFSMTransitions.addAction(action, transition_fun)
myFSMTransitions.addTransition(action, previous_state, allowed_next_states)
```

Where:

```javascript
previous_state: state()
allowed_next_states: Array(state())

tansition_fun: function(action_params) :: action_result()
```

`action_params` and `action_result` are discussed in the **Events** section.

## Init
You can initialize a new FSM object by declaring a new `FSM` object:


```javascript
const myFSM = new FSM(initial_state, myFSMTransitions, store_function)
```

Where:
```javascript
initial_state: state()
new_state: state()
metadata: data()
store_function(new_state, metadata) :: any()
```

`metadata` will be discussed in the **Events** section.

## Events

Now you can apply events on your FSM object

```javascript
myFSM.onEvent(params, action, current_state)
```

Then the state will be updated
