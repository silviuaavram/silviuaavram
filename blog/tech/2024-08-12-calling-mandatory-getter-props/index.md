---
slug: calling-mandatory-getter-props
title: Calling Mandatory Getter props
authors: [silviuaavram]
tags: [react, testing library, how to, open source software, downshift]
hide_table_of_contents: false
---

![hilly landscape in the village of simon, brasov](./hilly-landscape-simon.jpg) <em
style={{textAlign: "center", display: 'block'}}>Hilly Landscape in the Village
of Şimon.</em>

_...there's a lot going on with the attributes and the handlers and the ref and
the other properties..._

Let's assume that we have the following scenario. We have a custom hook that
returns getter props, and we want to make sure that those getter props are
called correctly. But, first things first:

> What is a getter prop?

It's a function that gets returned from the custom hook, which is supposed to be
called and its result used for some reason. Let's take the `getInputProps`
getter prop from downshift:

```jsx
import * as React from 'react'
import {useCombobox} from 'downshift'

const items = ['red', 'green', 'blue']

const {getInputProps} = useCombobox({
  items,
})

return (
  <div>
    <input {...getInputProps()} />
  </div>
)
```

The `getInputProps` result is an object with properties such as:
`aria-labelledby`, `aria-expanded`, `role`, `onChange`, `onClick` etc. These
properties are going to make our input more or less acting like a combobox. The
combobox logic is kept inside the custom hook, the inputs are retrieved through
the event handler functions (`onClick`, `onChange`) and the combobox related
information is passed through the other attributes (`aria-labelledby`,
`aria-expanded`). Of course, there are many more handlers and properties, but we
are keeping it simple for now.

There's also the `ref` property that is going to be returned from
`getInputProps`, and this is needed in order to allow `useCombobox` to access
the `input` element and perform some custom `.focus()` actions when needed.

## The Problem

Given that there's a lot going on with the attributes and the handlers and the
ref and the other properties, we want to make sure that the `getInputProps`
getter function is called correctly.

- First of all, we want to make sure that it is called.
- Secondly, that is called on an `<input>` element, or in such a way that it has
  access to an `<input>` element.
- Thirdly, in case it is not called correctly, we want to inform the user
  through a console error and give them enough information to fix the getter
  function call.
- Moreover, we also want to show the console error in the development
  environment, not production. -In addition, we would like to show this error
  only on the first render, as we believe it's enough in terms of checks and
  informations.
- Last, but not least, we will also provide an _escape hatch_ to avoid getting
  this error if the consumer just cannot call `getInputProps` properly on the
  first render.
  - We are going to document this escape hatch and make sure the consumer knows
    why we are adding it. Ideally, if a consumer will use the escape hatch, they
    are aware how `getInputProps` works, how it should be called, and if they,
    for some reason, cannot call it on first render (using a Portal for
    example), they will use the escape hatch to avoid the error, but they will
    test their implementation to make sure that it works as it would by calling
    `getInputProps` normally.

## The Solution

Inside the `getInputProps` function we return, we would like to have a mechanism
that checks whether the function is called withing the right conditions. We can
do so with a function to which we supply the call parameters. This function will
be called at render time, since `getInputProps` is called on render time. The
actual check happens after the first render, so we will involve a
`React.useEffect` hook. After a bit of thinking, the solution is actually
simple: a custom React hook that will keep call information inside a React ref.
This call information will be supplied by a function which we will return from
the hook. The returned function will store the call information inside that ref.
And inside the effect function, we will perform the check and show the errors if
needed.

## The Tests

We actually have a good and simple solution in mind, so let's see what do we
actually expect from this solution.

- we want an error displayed when `getInputProps` is not called.
- we want an error displayed if `getInputProps` is not called with a ref
  pointing to an element.
- we don't want an error displayed if `getInputProps` is not called on
  subsequent renders.
- we don't want an error displayed if `getInputProps` is called correctly.
- we don't want an error displayed if we use the escape hatch provided and
  `getInputProps` is not called with a ref pointing to an element.

We will use
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
`renderHook` and together with [Jest](https://jestjs.io/), we will set up our
tests suite.

```js
describe('non production errors', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('will be displayed if getInputProps is not called', () => {
    renderHook(() => {
      // we just render the hook, we don't call getInputProps.
      useCombobox({items})
    })

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: You forgot to call the getInputProps getter function on your component / element.`,
    )
  })

  test('will be displayed if element ref is not set and suppressRefError is false', () => {
    renderHook(() => {
      const {getInputProps} = useCombobox({
        items,
      })

      getInputProps()
    })

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: The ref prop "ref" from getInputProps was not applied correctly on your element.`,
    )
  })

  test('will not be displayed if getInputProps is not called on subsequent renders', () => {
    let firstRender = true
    const {rerender} = renderHook(() => {
      const {getInputProps} = useCombobox({
        items,
      })

      if (firstRender) {
        firstRender = false
        getInputProps({}, {suppressRefError: true})
      }
    })

    rerender()

    expect(console.error).not.toHaveBeenCalled()
  })

  test('will not be displayed if called with a correct ref', () => {
    // we supply a mock ref function to getInputProps.
    const refFn = jest.fn()
    const inputNode = {}

    renderHook(() => {
      const {getInputProps} = useCombobox({
        items,
      })

      // getInputProps returns a ref function which will make the element
      // usable both outside and inside useCombobox.
      const {ref} = getInputProps({
        ref: refFn,
      })

      // we call the final ref function received with a dummy node.
      ref(inputNode)
    })

    expect(console.error).not.toHaveBeenCalled()
  })

  test('will not be displayed if element ref is not set and suppressRefError is true', () => {
    renderHook(() => {
      const {getInputProps} = useCombobox({
        items,
      })

      getInputProps({}, {suppressRefError: true})
    })

    expect(console.error).not.toHaveBeenCalled()
  })
})
```

The tests are quite self explanatory given our 5 expected use cases. For now,
they will obviously fail, and we will consider our job done once we write the
implementation and the tests are green.

## The Implementation

To recap, the getter prop is called on render, so we would like our check to be
performed after the render. We will store the call information inside a React
ref, and we will check it using a React useEffect. Since we need our check to be
performed in development mode, not production, we will define the custom hook
like this:

```js
let useGetterPropsCalledChecker = () => {}

if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = () => {
    // the actual implementation.
  }
}
```

First and foremost, we would like to set up our ref object that we will use for
the check.

```js
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (...propKeys) => {
    const getterPropsCalledRef = useRef(
      propKeys.reduce((acc, propKey) => {
        acc[propKey] = {}

        return acc
      }, {}),
    )
  }
}
```

And we will call this hook inside useCombobox like this:

```js
useGetterPropsCalledChecker(
  'getInputProps',
  'getToggleButtonProps',
  'getMenuProps',
)
```

Notice that we will most definitely want the hook to check that other getter
props are called correctly as well. We are going to stick to getInputProps here
purely for explanatory purposes. Anyway, for each prop key we pass to the hook,
we will create an empty object container inside the ref. We add this empty
object as we want, during our checking phase, to be able to tell if the getter
prop with that prop name was not called. We cannot perform this check if we do
not store any initial information about the getter props. What prop keys should
we actually check, right?

Next, we want to give the consumer, which is the getter prop function, to be
able to store the call information. For that, we will return a function from the
hook, which stores this information within the ref.

```js
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (...propKeys) => {
    const getterPropsCalledRef = useRef(
      propKeys.reduce((acc, propKey) => {
        acc[propKey] = {}

        return acc
      }, {}),
    )
  }

  const setGetterPropCallInfo = useCallback(
    (propKey, suppressRefError, refKey, elementRef) => {
      getterPropsCalledRef.current[propKey] = {
        suppressRefError,
        refKey,
        elementRef,
      }
    },
    [],
  )

  return setGetterPropCallInfo
}
```

And the usage within getInputProps is going to be something like this:

```js
// this is going to end up on the input element via getInputProps
const inputRef = React.useRef(null)

const getInputProps = useCallback(
  ({refKey = 'ref', ref, ...rest} = {}, {suppressRefError = false} = {}) => {
    setGetterPropCallInfo('getInputProps', suppressRefError, refKey, inputRef)

    // rest of the logic

    return {
      [refKey]: mergeRefsUtil(ref, inputNode => {
        inputRef.current = inputNode
      }),
      // the rest of the attributes and handlers that will end on the input
    }
  },
)
```

In case the above _ref_ logic is not clear, it ensures that all ref objects have
access to the same input element. We need the input ref in useCombobox. The
consumer might also need the input ref for some additional logic, hence the
merge of these ref objects and passing the merged object to the `<input>`
element. Also, _suppressRefError_ is the escape hatch we talked about
previously.

Now the checking part. We have the initial object created for each getter prop
on render phase, when `useGetterPropsCalledChecker` is called. We have the call
information stored when `getInputProps` is called, also on render phase. Now we
have to check if the function is called correctly, on first render only, so we
add a React useEffect hook inside our custom hook:

```js
useEffect(() => {
  Object.keys(getterPropsCalledRef.current).forEach(propKey => {
    const propCallInfo = getterPropsCalledRef.current[propKey]

    if (!Object.keys(propCallInfo).length) {
      // eslint-disable-next-line no-console
      console.error(
        `downshift: You forgot to call the ${propKey} getter function on your component / element.`,
      )
      return
    }
  })
})
```

Our first test should pass. If the object is empty, then it means that we did
not call the getter prop at all, so we show an error. If the getter prop is
actually called, then we need to check if the element exists, which means that
the getter prop is called correctly on an element.

```js
useEffect(() => {
  Object.keys(getterPropsCalledRef.current).forEach(propKey => {
    const propCallInfo = getterPropsCalledRef.current[propKey]

    if (!Object.keys(propCallInfo).length) {
      // eslint-disable-next-line no-console
      console.error(
        `downshift: You forgot to call the ${propKey} getter function on your component / element.`,
      )
      return
    }

    const {refKey, elementRef} = propCallInfo

    if (!elementRef?.current) {
      // eslint-disable-next-line no-console
      console.error(
        `downshift: The ref prop "${refKey}" from ${propKey} was not applied correctly on your element.`,
      )
    }
  })
})
```

Our second test should now pass. The element check is, sure, not ideal, since
we're not checking for an actual HTML input element, but let's say it suffices
for now. The fourth test which checks that there is no error logged was passing
already, but now with the actual element check, we make sure that, when it's
passing, it does so for the right reason.

To fix the second test, we need our hook to be called only once, on first
render, so we add `[]` as the second parameter to useEffect.

And to fix the fifth test, which checks the escape hatch, we will also involve
the `suppressRefError` parameter from the call information. Our final
implementation will look like this.

```js
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (...propKeys) => {
    const getterPropsCalledRef = useRef(
      propKeys.reduce((acc, propKey) => {
        acc[propKey] = {}

        return acc
      }, {}),
    )

    useEffect(() => {
      Object.keys(getterPropsCalledRef.current).forEach(propKey => {
        const propCallInfo = getterPropsCalledRef.current[propKey]

        if (!Object.keys(propCallInfo).length) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: You forgot to call the ${propKey} getter function on your component / element.`,
          )
          return
        }

        const {suppressRefError, refKey, elementRef} = propCallInfo

        if (suppressRefError) {
          return
        }

        if (!elementRef?.current) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: The ref prop "${refKey}" from ${propKey} was not applied correctly on your element.`,
          )
        }
      })
    }, [])

    const setGetterPropCallInfo = useCallback(
      (propKey, suppressRefError, refKey, elementRef) => {
        getterPropsCalledRef.current[propKey] = {
          suppressRefError,
          refKey,
          elementRef,
        }
      },
      [],
    )

    return setGetterPropCallInfo
  }
}
```

## Recap

Basically, we initialize an empty object for each getter prop we want to check,
using the `getterPropsCalledRef` React ref object. Then we return the
`setGetterPropCallInfo` function that will store information for each getter
function when called. Finally, inside the useEffect function, for each getter
prop, we get the call info from the ref, we check for an empty object and show
the getter function not getting called error. In case we our object in not
empty, we get the call information, and do nothing if `suppressRefError` is
true. Otherwise, we check the actual element ref and show an error if it's
falsy.

We may go even further with the tests and check if the hook is actually an empty
object on production environments, but at this point I'm not sure if it's
possible to implement such a test, or if it's even worth it. Bottom line is
that, using this custom hook, we are able to perform the function getting called
check, or other checks as well, in order to make sure our consumers are doing
the right thing and the solution we ship works for them.
