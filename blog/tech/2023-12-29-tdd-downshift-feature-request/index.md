---
slug: tdd-downshift-feature-request
title: TDD a Downshift feature request
authors: [silviuaavram]
tags: [react, testing library, how to, open source software, downshift]
hide_table_of_contents: false
---

![praia da arrifana, portugal](./praia-da-arrifana.jpg) <em
style={{textAlign: "center", display: 'block'}}>Praia da Arrifana,
Portugal.</em>

_I don't always do TDD, but when I do, I write about it._

From the GitHub issue to the next library update on npm, we are going to push a
feature request via the magic of Test Driven Development. It's easier than you
think, and next time when the interviewer asks if you've heard about TDD, you
will smile, say yes, then test drive their Leetcode puzzle and bring home the
biggest offer they could make. TDD is also great in day-to-day work when adding
features for your products, fixing issues and solving open source tickets, which
is what we're going to do here.

## The Problem

Let's take the following
[small feature request from Downshift](https://github.com/downshift-js/downshift/issues/1557):

> Select element doesn't receive focus when the label is clicked.

Test driving this feature means that we need to write the tests before the
feature. And that's a good thing, because writing the tests first will make us
ask the most relevant question, `what exactly do I want to achieve here`.

That usually means drafting a list of requirements, and based on that list of
requirements, we will write the tests. Running the tests will result in test
failures (at least they should) and by implementing the feature the tests will
start turning green. Once all the tests are green, it means our feature is
complete. This is called red-green refactoring.

Before making the list of requirements, let's also visualise how this `select`
element is built with Downshift's `useSelect`.

```jsx
const {getToggleButtonProps, getLabelProps, getMenuProps, isOpen, ...rest} =
  useSelect({
    items,
  })

return (
  <div>
    <label {...getLabelProps()}>Books:</label>
    <div {...getToggleButtonProps()}></div>
    <ul {...getMenuProps()}>
      {isOpen ? items.forEach(/* render books if open */) : null}
    </ul>
  </div>
)
```

This will build a markup similar to:

```html
<div>
  <label id="label-id-1" for="toggle-id-1">Books:</label>
  <div
    role="combobox"
    aria-expanded="false"
    tabindex="0"
    aria-controls="menu-id-1"
    aria-haspopup="listbox"
    aria-activedescendant
    aria-labelledby="label-id-1"
  ></div>
  <ul role="listbox" id="menu-id-1" aria-labelledby="label-id-1">
</div>
```

## The Requirements

1. Clicking the `<label>` should place the focus on the _combobox_ element.

This would have been done automatically if the labelled element would have been
an `<input>` or a `<button>`, given how the label's `for` attribute works by
default. However, if the labelled element, here the combobox, is a `<div>` (ARIA
1.2 spec), the focus must be added manually via a click event. We would have the
same issue if we replace the `<label>` with something else, so another reason to
add this behaviour.

2. Passing an _onClick_ to _getLabelProps_ should not interfere with the default
   focus behaviour we will be adding.

For instance, calling the code below should focus the toggle button and display
the log.

```jsx
<label
  {...getLabelProps({
    onClick() {
      console.log('Clicked!')
    },
  })}
/>
```

3. Passing an _onClick_ to _getLabelProps_ adds the _preventDownshiftDefault_
   attribute on the click event object should not focus the toggle anymore.

It's a practice similar to the event's _preventDefault_, where we can control
the default behaviour of the event. In Downshift's case, we want to be able to
stop the Downshift default behaviour.

```jsx
<label
  {...getLabelProps({
    onClick(e) {
      e.preventDownshiftDefault = true

      document.querySelector('#better-element').focus()
    },
  })}
/>
```

## The Tests

That's the beauty of drafting a list of requirements, you could use it to write
the tests. Downshift is a React library, so we are going to use React Testing
Library and Jest in order to check our changes will be correct.

Our first test is going to be easier, since we only want to render the Select,
click on the label, and check if the toggle has focus. To render the component,
we will use RTL `render` method with a JSX similar to the example when
describing [the problem](#the-problem).

```jsx
function renderSelect() {
  const utils = render(<Select />)

  return utils
}

function Select() {
  const {getToggleButtonProps, getLabelProps, getMenuProps, isOpen, ...rest} =
    useSelect({
      items,
    })

  return (
    <div>
      <label {...getLabelProps()}>Books:</label>
      <div {...getToggleButtonProps()}></div>
      <ul {...getMenuProps()}>
        {isOpen ? items.forEach(/* render books if open */) : null}
      </ul>
    </div>
  )
}
```

With these abstractions in place, our test becomes:

```js
test('clicking the label moves focus on the toggle element', async () => {
  renderSelect()

  // RTL's user-event tool
  await user.click(screen.getByText('Books:', {selector: 'label'}))

  // RTL jest-dom extends Jest's expectations to include "toHaveFocus".
  expect(screen.getByRole('combobox', {name: 'Books:'})).toHaveFocus()
})
```

And we're done. We render, we click the label, we check if the focus is where we
need it to be. We run the test, it will fail, it's a success, we go grab lunch.

Now, something about the other 2 requirements. These are part of Downshift's API
for some time now, and they already have a utility function that chains
callbacks together and calls all of them on a event trigger. This utility also
knows not to call Downshift's default event handler if "preventDownshiftDefault"
has been passed. We are not going to test this utility now, we just want to make
sure it works for our callback. Sure, we can just mock that utility and check
the call, since we also test the utility in isolation to make sure that it
works. But it's better to test for the actual user consequences rather than
implementation details, so let's write the tests for these last requirements.

For the second requirement, if we pass our own _onClick_ to _getLabelProps_, it
should get called along with the default handler that sets focus. For this
particular test, we don't need to render the whole component, we can just render
the hook, like this.

```jsx
export function renderUseSelect(props) {
  // renderHook from RTL
  return renderHook(() => useSelect({items, ...props}))
}
```

Now, we need to find a way to check that our custom _onClick_ is called when the
label gets clicked. Which, in turn, means that we need to actually trigger that
click, since we are not going to render actual markup, we are just testing the
hook. We know that _getLabelProps_ will return an _onClick_ that should end on a
label element, so all we have to do is to pass a Jest spy as an _onClick_
argument to _getLabelProps_, then call the _onClick_ returned, and check the
spy.

```js
test('event handler onClick is called along with downshift handler', () => {
  const userOnClick = jest.fn()
  const {result} = renderUseSelect()

  const {onClick} = result.current.getLabelProps({
    onClick: userOnClick,
  })

  onClick()

  expect(userOnClick).toHaveBeenCalledTimes(1)
})
```

Simple! Now we test that whatever we pass in the onClick, it will be called with
Downshift's handler. Which is something we don't test at the moment, and that's
a huge potential problem over there. We don't want a regression to slip in one
day and ruin everyone's Select elements if they also wanted to pass their own
event handlers to our prop getters, which is a very common use case.

This is the part of the TDD where we need to think about the implementation. To
manually focus the toggle element, we need to use a React _ref_ on the
_combobox_ toggle JSX element, and use that ref object to perform a manual
_.focus()_. Consequently, there's going to be a ref object returned by
_getToggleButtonProps_, as it needs to be passed to the toggle element. We will
use the ref in the _useSelect_ code in order to perform the focus action. In our
test, we just need to grab this returned _ref_ and call it with a mocked object
that has a _focus_ function attached to it, which will be a jest spy. If our
implementation works, the object we pass as argument to the _ref_ function call
is going to be used by the internal code to perform the focus. The test becomes:

```js
test('event handler onClick is called along with downshift handler', () => {
  const userOnClick = jest.fn()
  const mockToggleElement = {focus: jest.fn()}
  const {result} = renderUseSelect()

  const {onClick} = result.current.getLabelProps({
    onClick: userOnClick,
  })
  const {ref} = result.current.getToggleButtonProps()

  ref(mockToggleElement) // simulate that React will add the toggle element in the ref.
  onClick() // now we should have the ref containing the toggle element, we can click the label.

  expect(userOnClick).toHaveBeenCalledTimes(1)
  expect(mockToggleElement.focus).toHaveBeenCalledTimes(1)
})
```

We also need to check that setting "preventDownshiftDefault" will not focus the
toggle element. The test is going to be similar to the previous one, only that
the userOnClick implementation will set this attribute on the event object.

```js
test('event handler onClick is called along with downshift handler', () => {
  const userOnClick = jest.fn(event => {
    event.preventDownshiftDefault = true
  })
  const mockToggleElement = {focus: jest.fn()}
  const {result} = renderUseSelect()

  const {onClick} = result.current.getLabelProps({
    onClick: userOnClick,
  })
  const {ref} = result.current.getToggleButtonProps()

  ref(mockToggleElement) // simulate that React will add the toggle element in the ref.
  onClick() // now we should have the ref containing the toggle element, we can click the label.

  expect(userOnClick).toHaveBeenCalledTimes(1)
  expect(mockToggleElement.focus).not.toHaveBeenCalled()
})
```

We are in a very good spot right now. We have written great tests that
communicate exactly what our goal is, and that will only smoothen the
implementation process. While deciding on the requirements and writing the tests
we can also get better feedback from all stakeholders, since we already have a
list of objectives, and it's easier to collaborate on that. We could get extra
requirements (more tests) or, even better, some may decide that some
requirements are superfluous. So what we may need to remove some already written
tests? Less code is good.

## Implementation

The implementation is rather easy. Given the current code, we will add another
_onClick_ function to be returned from _getLabelProps_, and we will use the
_toggleButtonRef_ we already have in order to focus the element.

Before:

```jsx
const getLabelProps = useCallback(
  labelProps => ({
    id: elementIds.labelId,
    htmlFor: elementIds.toggleButtonId,
    ...labelProps,
  }),
, [elementIds]
)
```

After:

```jsx
const getLabelProps = useCallback(
  ({onClick, ...labelProps} = {}) => {
    const labelHandleClick = () => {
      toggleButtonRef.current?.focus()
    }

    return {
      id: elementIds.labelId,
      htmlFor: elementIds.toggleButtonId,
      onClick,
      ...labelProps,
    }
  },
  [elementIds],
)
```

Success! One test is passing already, with 2 more to go. Once these are green,
we can agree that our implementation is a success. And that's the easiest part.
We will also use our _callAllEventHandlers_ utility in order to chain the
callbacks and also check for the "preventDownshiftDefault" property.

```jsx
const getLabelProps = useCallback(
  ({onClick, ...labelProps} = {}) => {
    const labelHandleClick = () => {
      toggleButtonRef.current?.focus()
    }

    return {
      id: elementIds.labelId,
      htmlFor: elementIds.toggleButtonId,
      onClick: callAllEventHandlers(onClick, labelHandleClick),
      ...labelProps,
    }
  },
  [elementIds],
)
```

## Utility Function for Reference

The _callAllEventHandlers_ utility will call the functions passed to it, in
order, until one of them passes the "preventDownshiftDefault". It's important to
pass the focus setting handler at the end. If you need such a function in your
life, here it is:

```js
/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param {...Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
function callAllEventHandlers(...fns) {
  return (event, ...args) =>
    fns.some(fn => {
      if (fn) {
        fn(event, ...args)
      }
      return (
        event.preventDownshiftDefault ||
        (event.hasOwnProperty('nativeEvent') &&
          event.nativeEvent.preventDownshiftDefault)
      )
    })
}
```

You also need to properly compose the ref objects. In our case, the toggle
element is going to be used by _useSelect_, and it may also be used in the
component using _useSelect_. Also for reference, here's the ref composing
function and its usage.

```jsx
const toggleProps = {
  // refKey could be ref, could be innerRef, up to the user
  [refKey]: handleRefs(ref, toggleButtonNode => {
    toggleButtonRef.current = toggleButtonNode
  }),
  // ... the rest of the props returned by getToggleButtonProps
}

function handleRefs(...refs) {
  return node => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}
```

## Last Changes and Merging

We can create a new branch and commit our new changes. Given the nature of
Downshift, we have TS files separately, and sometimes they also need to be
updated. Now it's such a case, given that we changed the type of a return value:

```ts
export interface UseSelectGetLabelPropsReturnValue
  extends GetLabelPropsReturnValue {
  onClick: React.MouseEventHandler
}
```

We also need to update the documentation, to make it clear to our users that we
added an event handler to the label props. We also want to mention what the
event does.

```
#### Label

- `Click`: It will move focus to the toggle element.
```

Finally, we run the validation script, which in Downshift's case, it runs all
the unit tests, the coverage check, the e2e tests, linting and all that stuff.
Afterwards, we push the changes, create a PR, let the same validation script run
via GitHub actions, and if the changes look good, we will merge the PR, close
the issue, close the laptop and run. We should get an email from npm that the
library has been updated successfully. In our case, it should be a minor version
bump, since it's a feature.

## Conclusion

I don't always do TDD, but when I do, I write about it. It's a very neat
process, and I am super thankful to Kent and his
[Testing Javascript](https://testingjavascript.com/) teachings. I was always
passionate about automated testing, but his course just completely changed
everything for me. If you haven't done it yet, I strongly recommend it, it's so
worth it. Tip: try to get purchase parity for it if you aim to use it in your
own home country only. You will get a discount.

I hope my Downshift TDD experience helps you write better and test better in the
feature. If it sparked your interest in using TDD more or just to learn to test
better, I declare myself happy for it. Good luck in writing great code and
improving the world through your work!
