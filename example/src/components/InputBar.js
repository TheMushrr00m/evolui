import html from 'evolui'
import store, { ADD_TODO, UPDATE_TEXT } from '../store'

const InputBar = () => {
  const onKeyDown = e => {
    if (e.which === 13) store.dispatch({ type: ADD_TODO, text: e.target.value })
  }

  const onInput = e =>
    store.dispatch({ type: UPDATE_TEXT, text: e.target.value })

  return html`
    <input
      value="${store.state.map(({ text }) => text)}"
      oninput=${onInput}
      onkeydown=${onKeyDown} />
  `
}

export default InputBar
