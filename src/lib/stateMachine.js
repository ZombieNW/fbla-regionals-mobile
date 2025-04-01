class StateMachine {
	constructor(initialState) {
		this.state = initialState;
	}

	transition(newState) {
		this.state = newState;
	}
}

export default StateMachine;
