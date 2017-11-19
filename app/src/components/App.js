import { Observable } from 'rxjs'
import { html } from '../framework'
import {
  CreateElement,
  CreateTextNode,
  CloseElement
} from '../framework/Operation'

// const World = () => {
//   return html([
//     [
//       new CreateTextNode('World'),
//     ],
//   ]);
// };

export default () => {
  return html(
    [
      [new CreateElement('h1'), new CreateTextNode('Hello ')],
      [new CloseElement()]
      // ], World());
    ],
    new Observable(sink => {
      sink.next('.')
      let handle = setTimeout(() => {
        sink.next('..')
        handle = setTimeout(() => {
          sink.next('...')
          handle = setTimeout(() => {
            sink.next('World!')
          }, 1000)
        }, 1000)
      }, 1000)
      return () => clearTimeout(handle)
    })
  )
}