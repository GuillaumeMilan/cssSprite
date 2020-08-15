/* TODO LICENSE is to be defined */

class FSMTransitions {
  constructor() {
    return;
  }

  addAction(action_name, action) {
      this[action_name] = {action: action, allowed_transitions: {}}
  }

  addTransition(action_name, origin_state, allowed_next_states) {
    if(!this[action_name]) console.error("[FSMTransitions] Unexpected action name: "+action_name+".\nPlease considere declaring it with: ", this.addAction)
    this[action_name].allowed_transitions[origin_state] = allowed_next_states
  }
}

export default FSMTransitions;
