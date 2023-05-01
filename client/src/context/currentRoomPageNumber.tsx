function typingreducer(state: any, action: any) {
    switch (action.type) {
        case "PAGE_NUMBER":
            state = action.payload;
            return state;

        default:
            return state
    }
}

export default typingreducer