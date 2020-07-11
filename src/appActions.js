export default {
    setText(text) {
        return { type: 'SET_TEXT', payload: text }
    },
    setApiUrl(text) {
        return { type: 'SET_APIURL', payload: text }
    }
}