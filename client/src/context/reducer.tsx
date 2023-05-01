function reducer(state: any, action: any) {
    switch (action.type) {
        case "MESSAGES":
            state = action.payload;
            // debugger
            return state;

        default:
            return state
    }
}

export default reducer