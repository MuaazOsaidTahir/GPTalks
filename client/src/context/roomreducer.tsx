function roomreducer(state: any, action: any) {
    switch (action.type) {
        case "SELECTED_ROOM":
            state = action.payload;
            return state;

        default:
            return state
    }
}

export default roomreducer