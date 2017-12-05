import {
  OpenElement,
  CloseElement,
  SetAttribute,
  CreateTextNode
} from './Operation'

const tagNamePattern = '[^(\\s|<|>)]+'
const attrNamePattern = '[^\\s|=]+'
const restPattern = '(.|\n)*'

// data State a = Element | AttributeName | AttributeValue a
const createState = (type, value) => ({
  type,
  value
})

// parser :: String -> State -> Generator Operation State
export function* parser(htmlFragment, state = { type: 'Element' }) {
  const trimed = htmlFragment.trimLeft()
  if (!trimed) return state

  if (state.type === 'Element') return yield* elementParser(trimed)

  if (state.type === 'AttributeName') return yield* attributeNameParser(trimed)

  if (state.type === 'AttributeValue')
    return yield* attributeValueParser(trimed, state.value)
}

// supports strings, open element and close elements
function* elementParser(htmlFragment) {
  const isOpenElement = /^<[^\/]/.test(htmlFragment)

  if (isOpenElement) {
    const [_, nodeName, rest] = htmlFragment.match(
      new RegExp(`^<(${tagNamePattern})((>|\\s)(${restPattern}))`)
    )
    yield new OpenElement(nodeName)
    return yield* parser(rest, createState('AttributeName'))
  }

  const isCloseElement = /^<\//.test(htmlFragment)

  if (isCloseElement) {
    const [_, nodeName, rest] = htmlFragment.match(
      new RegExp(`^<\\/(${tagNamePattern})>(${restPattern})`)
    )
    yield new CloseElement()
    return yield* parser(rest, createState('Element'))
  }

  const [_, str, rest] = htmlFragment.match(
    new RegExp(`^([^<]*)(<?(${restPattern}))`)
  )
  yield new CreateTextNode(str)
  return yield* parser(rest, createState('Element'))
}

// supports closing tag, self closing tags, single attributes names
function* attributeNameParser(htmlFragment) {
  const isClosing = /^>/.test(htmlFragment)
  if (isClosing)
    return yield* parser(htmlFragment.slice(1), createState('Element'))

  const isSelfClosing = /^\/>/.test(htmlFragment)
  if (isSelfClosing) {
    yield new CloseElement()
    return yield* parser(htmlFragment.slice(2), createState('Element'))
  }

  const withoutvalueRegExp = new RegExp(
    `^(${attrNamePattern})(\\s(${restPattern})|$)`
  )
  const isAttributeWithoutValue = withoutvalueRegExp.test(htmlFragment)
  if (isAttributeWithoutValue) {
    const [_, attrName, rest] = htmlFragment.match(withoutvalueRegExp)
    yield new SetAttribute(attrName, '')
    return yield* parser(rest, createState('AttributeName'))
  }

  const [_, attrName, rest] = htmlFragment.match(
    new RegExp(`^(${attrNamePattern})=(${restPattern})`)
  )
  return yield* parser(rest, createState('AttributeValue', attrName))
}

// supports string attribute
function* attributeValueParser(htmlFragment, attrName) {
  const isDoubleQuoteAttr = /^"/.test(htmlFragment)
  if (isDoubleQuoteAttr) {
    const [_, attrValue, rest] = htmlFragment.match(
      new RegExp(`^"([^"]+)"(${restPattern})`)
    )
    yield new SetAttribute(attrName, attrValue)
    return yield* parser(rest, createState('AttributeName'))
  }

  const isSimpleQuoteAttr = /^'/.test(htmlFragment)
  if (isSimpleQuoteAttr) {
    const [_, attrValue, rest] = htmlFragment.match(
      new RexExp(`^'([^']+)'(${restPattern})`)
    )
    yield new SetAttribute(attrName, attrValue)
    return yield* parser(rest, createState('AttributeName'))
  }

  // no quote attr
  const [_, attrValue, rest] = htmlFragment.match(
    new RexExp(`(.*)\\s(${restPattern})`)
  )
  yield new SetAttribute(attrName, attrValue)
  return yield* parser(rest, createState('AttributeName'))
}