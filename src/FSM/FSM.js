/* TODO LICENSE is to be defined */

class FSM {
/*
 * transitions: {action_name: {action: function(), allowed_transitions: {parent_state_name: Array(allowed_next_state)}}}
 */
  constructor(initialState, transitions, setState) {
    /* TODO Verify transitions format */
    this.transitions = transitions;
    this.state = initialState;
    this.setState = setState;
    this.timeouts = {}

  }

  clearTimeouts(opts) {
    if(!opts) return;
    if(opts.type === "all")
      return this.clearAllTimeouts();
    if(opts.type === "group")
      return this.clearTypedTimeouts(opts.group)
  }

  clearAllTimeouts() {
    const self = this;
    Object.keys(self.timeouts).forEach(function(timeout_type) {
      self.timeouts[timeout_type].forEach((timeout) => clearTimeout(timeout));
    });
    self.timeouts = {};
    return;
  }

  clearTypedTimeouts(timeout_type) {
    this.timeouts[timeout_type].forEach((timeout) => clearTimeout(timeout));
    this.timeouts[timeout_type] = undefined;
    return;
  }

  addTimeouts(timeouts) {
    const self = this;

    if(!timeouts) return

    timeouts.forEach(function(timeout) {
      if(!self.timeouts[timeout.type])
        self.timeouts[timeout.type] = []
      self.timeouts[timeout.type].push(setTimeout(timeout.callback, timeout.delay))
    })
  }

  applyNextState(action_name, previous_state, action_result) {
    if(!action_result.new_state && (this.transitions[action_name].allowed_transitions[previous_state].length === 1))
      return this.setState(this.transitions[action_name].allowed_transitions[previous_state][0], action_result.data)
    if(this.transitions[action_name].allowed_transitions[previous_state].indexOf(action_result.new_state) !== -1)
      return this.setState(action_result.new_state, action_result.data)
    else
      throw("[FSM] Unexpected next_state result: "+action_result.new_state+".\nExpected one of " + this.transitions[previous_state].allowed_transitions.toString())
  }

  keepState(action_name, previous_state, action_result) {
    if(this.transitions[previous_state].allowed_transitions.indexOf(previous_state) === -1)
      throw("[FSM] Unexpected keep_state result: "+previous_state+".\nExpected a transition to one of " + this.transitions[previous_state].allowed_transitions.toString())
    return this.setState(action_result.previous_state, action_result.data)
  }

  parseActionResult(action_name, previous_state, action_result) {
    const self = this;
    ({
      "next_state": self.applyNextState.bind(self),
      "keep_state": self.keepState.bind(self),
    })[action_result.type](action_name, previous_state, action_result)
    this.clearTimeouts(action_result.clearTimeouts)
    this.addTimeouts(action_result.timeouts)
    return
  }

  canExecuteAction(action_name, current_state) {
    const next_states = this.transitions[action_name].allowed_transitions[current_state]
    return !!next_states
  }

  onEvent(e, action_name, current_state) {
    const next_states = this.transitions[action_name].allowed_transitions[current_state]
    if(!next_states) {
      throw("[FSM] Unexpected action "+action_name+" on state " + current_state)
    }
    const action_result = this.transitions[action_name].action(e)
    return this.parseActionResult(action_name, current_state, action_result)
  }
}

export default FSM;
