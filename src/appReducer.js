const initialState = { text: 'Login', apiUrl: 'http://localhost:8000/api/', dataMenu:[] }

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TEXT':
            return { ...state, text: action.payload }
        case 'SET_APIURL':
            return { ...state, apiUrl: action.payload }
        default:
            return state
    }
}