---
slug: use-roving-tabindex-part-1
title: Building a Reusable Roving Tabindex Strategy in React, Part 1
authors: [silviuaavram]
tags:
  [
    react,
    roving tabindex,
    accessibility,
    testing library,
    how to,
    open source software,
    downshift,
  ]
hide_table_of_contents: false
---

![a collection of limestone-karst islands, maya bay, thailand](./maya-bay-island-collection.webp)
<em style={{textAlign: "center", display: 'block'}}>A collection of
limestone-karst islands at Maya Bay, Thailand.</em>

_Sweet! But things are going to become more complex in a bit._

The _Roving Tabindex_ pattern has been around for some time. It's a very useful
pattern when it comes to collections of items that are actionable. Without it,
each item in the collection is a tab stop, and if the collection is quite large,
maybe more than 5 item large, keyboard users might experience frustration moving
pass it. Also, it might be easier for keyboard users to just use arrow keys to
move between items instead of using Tab or Shift Tab. For me, at least, it's
faster and way more intuitive.

## Benefits

Before going into the details, I believe it's crucial to explain the benefits,
so the purpose of building a Roving Tabindex, or importing one at least, is a
great step towards improving your App or Design System's UX and Accessibility.
Let's list them:

1. Reducing the tab stops from a collection of items.
2. Improve navigation between the items with arrow keys, Home, End and possibly
   character keys.
3. After tabbing away from the collection, tabbing back brings you back to the
   previously focused item.
4. Necessary for collections such as nested menus.
5. Circular navigation in the collection.

## Requirements

The UX benefits are real, so let's create a list of requirements for our
tabindex strategy:

1. Only one item in the collection should be tabbable at a time.
   - the item should have tabindex="0".
   - the rest of the items should have tabindex="-1".
2. tabindex="0" should follow focus.
   - that means that when an item is focused by any means (keyboard, click,
     programatic), it should be the one receiving tabindex="0".
3. Tabbing from and back to the collection should apply focus to the item that
   was last focused.
   - this is why #2 is crucial.
4. Keyboard navigation should work with Arrow Keys, as well as Home and End.
5. Navigation orientation should be both horizontal and vertical.
6. RTL should also be considered for horizontal navigation.
7. Disabled items should be skipped when navigating, but how do we mark a
   disabled item?
   - "disabled" attribute.
   - "aria-disabled" attribute of value "true".
   - no "tabindex" value.
   - custom implementation.
8. Navigation might be circular or not, so we should support both.
9. It has to be re-usable.
   - We might have many components in our app or design system that need this
     pattern: lists, menus, tabs, steppers etc.
   - If the codebase is mature enough, these components have a lot of custom
     logic added to them, so integrating our tabindex should not be a
     refactoring pain.
10. Some componenents might need to change focus based on some custom
    requirement (character key navigation), so our tabindex utility should be
    aware of that.

There are a lot of things to take into consideration, and this is the reason for
me writing about the Roving Tabindex pattern. We are building this utility in
MUI in order to bring consistency and correct pattern implementation, and I
believe that the lessons we learned as we developed it will be useful for anyone
that needs this utility in their project.

## Implementation Strategy

It's not a very hard pattern to understand, but given the many requirements, it
might be hard to hit the nail exactly right. And I believe it's about time web
apps get this pattern 100% right. We need great Accessibility and UX from our
apps. Now, with the great help the AI tools bring us, it's a great opportunity
for us to understand the pattern and deliver it in our apps.

As we understand something very well before we actually implement it, test
driving the implementation is a great way to ensure we are building the right
thing. For this reason, I will develop the utility using a TDD strategy, and
it's going to be very rewarding to see those tests turning from red to green, as
we continue to iterate and add value to our utility. Iterating this way is very
helpful both for an Engineer, as well as for an AI agent, or an Engineer using
AI. Wins across the board, let's go!

## Implementation

### Setting Up

In order for this article to be super intuitive, I will actually start by
addressing #9 in our requirements list: the utility being reusable. I will pick
React to implement the utility, but I'm sure there is going to be an equivalent
implementation in Angular or Vue if the strategy is clear enough. Reusable logic
in React is best implemented via a custom hook, so we'll do just that.

#### Create Project

I will set up a
[new React project](https://react.dev/learn/creating-a-react-app) with
[Vite](https://vite.dev/guide/). I will be using TypesScript, by the way. After
scaffolding the project, I will create a new GitHub repo and
[add my new project](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
to that repo. We can do our first commit now.

#### Testing Example

In our `App.tsx` file I will go ahead and add a supporting component which will
act as our testing example.

```tsx
// App.tsx
function App() {
  const {getContainerProps, getItemProps} = useRovingTabIndex()
  return (
    <div {...getContainerProps()} data-testid="container" role="tablist">
      <button {...getItemProps(0)} data-testid="button-1" role="tab">
        Button 1
      </button>
      <button {...getItemProps(1)} data-testid="button-2" role="tab">
        Button 2
      </button>
      <button {...getItemProps(2)} data-testid="button-3" role="tab" disabled>
        Button 3
      </button>
      <button {...getItemProps(3)} data-testid="button-4" role="tab">
        Button 4
      </button>
      <button {...getItemProps(4)} data-testid="button-5" role="tab">
        Button 5
      </button>
    </div>
  )
}
```

It's a Tabs component wannabe, implemented using buttons, and also has a
disabled button in the middle. Now, the API I chose is clear: Getter Props. Our
hook will return a couple of functions, called getter props, which will be
called and their object result will be de-structured on both the container and
the items.

It's a great way to support re-usability through this pattern, which is
available in Downshift for quite some time, even before hooks were introduced.
Notice that `getItemProps` is called with the index, so we know which item is
which behind the scenes.

The object that is returned by our getter props contains event handlers and HTML
attributes, which are going to make the roving tabindex strategy possible. The
consumer shouldn't care what's going on, as long as they call the API correctly.

#### The API

So, we need to return those 2 getter props from the hook, so we can go ahead and
actually create the file for it, along with the API:

```tsx
// useRovingTabIndex.ts
import * as React from 'react'

type RovingTabIndexOptions = {}

type RovingTabIndexReturn = {
  getContainerProps: () => {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
    onFocus: (event: React.FocusEvent<HTMLElement>) => void
  }
  getItemProps: <T extends HTMLElement = HTMLElement>(
    index: number,
  ) => {
    ref: React.Ref<T>
    tabIndex: number
  }
}

export function useRovingTabIndex(
  options: RovingTabIndexOptions,
): RovingTabIndexReturn {
  // ToDo: Implement me!
}
```

So, there we go, our second commit. And we made sure requirement #9 is achieved!
We're so on the right track!

#### Testing Infrastrucutre

I promised we structure the implementation with a TDD strategy, so we'll do one
more setup, the unit tests. I'll be using [Vitest](https://vitest.dev/guide/)
and
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/),
including [UserEvent](https://testing-library.com/docs/user-event/intro).

I'll be reusing the same testing markup from `App.tsx` and create test file for
our hook:

```tsx
// useRovingTabIndex.test.tsx
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {useRovingTabIndex} from './useRovingTabIndex'

function Tabs() {
  const {getContainerProps, getItemProps} = useRovingTabIndex()

  return (
    <div
      {...getContainerProps()}
      data-testid="container"
      tabIndex={-1}
      role="tablist"
    >
      <button {...getItemProps(0)} data-testid="button-1" role="tab">
        Button 1
      </button>
      <button {...getItemProps(1)} data-testid="button-2" role="tab">
        Button 2
      </button>
      <button {...getItemProps(2)} data-testid="button-3" role="tab" disabled>
        Button 3
      </button>
      <button {...getItemProps(3)} data-testid="button-4" role="tab">
        Button 4
      </button>
      <button {...getItemProps(4)} data-testid="button-5" role="tab">
        Button 5
      </button>
    </div>
  )
}

function renderTabs() {
  const utils = render(<Tabs />)
  const user = userEvent.setup()

  return {
    ...utils,
    user,
  }
}
```

The same API is used on the markup, and we render it with RTL's `render` method.
We will abstract this away in `renderTabs` and also setup the `user` object for
future interactions.

We can create another commit with `setup infrastructure`. Now we're truly ready
to begin.

#### Other Infrastructure Stuff

Up to you, you can setup ESLint, Prettier and anything else that's going to help
out your development setup.

### Implementing one Tab Stop

This time, we'll address the requirements in order.

> Only one item in the collection should be tabbable at a time.

We expect, from the initial render of the Tabs, that only one tab has
tabindex="0", while every other tab has tabindex="-1". And we will also consider
the initial focusable item to be the first one. This is our test.

```tsx
// useRovingTabindex.test.tsx
describe('useRovingTabIndex', () => {
  it('should render tabs with tabindex attributes', () => {
    const {getByTestId} = renderTabs()

    expect(getByTestId('button-1')).toHaveAttribute('tabindex', '0')
    expect(getByTestId('button-2')).toHaveAttribute('tabindex', '-1')
    expect(getByTestId('button-3')).toHaveAttribute('tabindex', '-1')
    expect(getByTestId('button-4')).toHaveAttribute('tabindex', '-1')
    expect(getByTestId('button-5')).toHaveAttribute('tabindex', '-1')
  })
})
```

Of course, it fails when we use `npm t` (`vitest`) to run it. Fixing it is quite
simple, `getItemProps` just needs to return tabindex="0" only for the focusable
index and "-1" for rest. We will use a state value to keep track of what index
is going to be focusable, and return the tabindex value based on that.

```tsx
// useRovingTabIndex.ts
export function useRovingTabIndex(
  options: RovingTabIndexOptions,
): RovingTabIndexReturn {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  return {
    getContainerProps: () => ({}),
    getItemProps: (index: number) => ({
      tabIndex: index === currentIndex ? 0 : -1,
    }),
  }
}
```

That's it, the test passes. #1 requirement is done. We can also check the live
example, if hit Tab, the focus moves to the first button. Then, on the second
Tab, the focus moves away from the pace. On Shift Tab, it goes back to the first
button. Sweet! But things are going to become more complex in a bit.

### Tabindex should follow focus

> tabindex="0" should follow focus.

This is requirement #2. And it's a necessary requirement since our hook needs to
know whenever one element receives focus so it updates the `currentIndex`
accordingly, and, consequently, the tabindex values.

We will add another test, to account for focus change by mouse click, or
programatic focus:

```tsx
// useRovingTabIndex.test.ts
it('should set tabindex to 0 whenever an item is focused', async () => {
  const {getByTestId, user} = renderTabs()

  await user.click(getByTestId('button-4'))
  expect(getByTestId('button-4')).toHaveFocus()
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '-1')

  fireEvent.focus(getByTestId('button-2'))
  expect(getByTestId('button-2')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '-1')
})
```

A general way to handle this is by intercepting the `focus` event from the
container, identify its `target`, and get the index of that element in order to
perform the state update for the currentIndex.

```tsx
// useRovingTabIndex.tsx
const getContainerProps = (): React.HTMLAttributes<HTMLElement> => ({
  onFocus: event => {
    const target = event.target as HTMLElement
    const index = Array.from(target.parentElement?.children || []).indexOf(
      target,
    )
    setCurrentIndex(index)
  },
})
```

So, we get the `target`, and then check its siblings for the position of the
element inside the collection. This implementation will have to do for now, even
though the are some obvious flaws here:

- what if the DOM structure is different, and we have siblings nested 2 or more
  levels deep, or other DOM related differences?
- what if not all siblings are focusable, and instead we have separators or
  subheadings in our collection?

We'll get there when we get there, for now it's important we acknowledge the
gaps, write them down in our list of requirements, and handle them at the
appropriate time. With the above implementation, our new test should pass. And
we will add another requirement, #11:

> Being able to skip items that should not be focusable: dividers, subheaders,
> etc.

### Tabbing Back and Forth

If our tabindex strategy was correctly implemented so far, the following test
should actually pass without any further implementation:

```tsx
// useRovingTabindex.test.tsx
it('should return focus to the previously focused element when tabbing out', async () => {
  const {getByTestId, user} = renderTabs()

  await user.click(getByTestId('button-2'))
  await user.tab()

  expect(document.body).toHaveFocus()

  await user.tab({shift: true})
  expect(getByTestId('button-2')).toHaveFocus()
})
```

We manually set focus to button 2, tab away, the focus moves to the next element
in the tab order (here there's none, so it's going to be `<body>`), then when we
shift tab, the focus returns to the element we tabbed from. Very important
detail to handle!

### Keyboard Navigation

> Keyboard navigation should work with Arrow Keys, as well as Home and End.

Now the fun part, let's make our collection navigable by keyboard. I will keep
this shorter and only implement the arrow navigation with left and right. We'll
do the rest later. Our test, first and foremost:

```tsx
//useRovingTabIndex.test.tsx
it('should update tabindex on next and previous arrow key navigation', async () => {
  const {getByTestId, user} = renderTabs()

  await user.tab()
  expect(getByTestId('button-1')).toHaveFocus()
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '0')

  await user.keyboard('{ArrowRight}')
  expect(getByTestId('button-2')).toHaveFocus()
  expect(getByTestId('button-2')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '-1')

  await user.keyboard('{ArrowLeft}')
  expect(getByTestId('button-1')).toHaveFocus()
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-2')).toHaveAttribute('tabindex', '-1')
})
```

Basically, we need to check if the focus moves correctly, and if the tabindex
value follows focus. So, in our implementation, we need to capture the keyboard
event, identify the next focusable element, its index, update the state and
programatically focus the element.

We will add this handler on the container, since there's no need to do it on the
individual item. Our `getContainerProps` will now have `onKeyDown` returned from
the result as well:

```tsx
// useRovingTabIndex.tsx
// inside getContainerProps return object
    onKeyDown: event => {
      if (event.key === 'ArrowRight') {
        setCurrentIndex(prev => prev + 1)

        const nextElement = document.activeElement
          ?.nextElementSibling as HTMLElement
        nextElement?.focus()
      } else if (event.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev - 1)

        const prevElement = document.activeElement
          ?.previousElementSibling as HTMLElement
        prevElement?.focus()
      }
    },
```

So, we capture the ArrowRight and ArrowLeft keydowns, we set the new index
state, and focus the relevant item element. We get the element with the help of
the DOM API, and obviously, again, it has its downsides, as we assume the DOM
structure of the component. By now, you are probably guessing that we'll
refactor the implementation, and you're right, we're going to, but for now, and
for the purpose of addressing our requirements as simply as possible, we'll use
this API.

### Skipping Disabled Items

I propose we go straight to #7 because this actually will be a great opportunity
to also refactor our `keydown` handler and make our hook more robust.

> Disabled items should be skipped when navigating, but how do we mark a
> disabled item?

First things first, the test:

```tsx
// useRovingTabIndex.tsx
it('should skip disabled items when navigating with arrow keys', async () => {
  const {getByTestId, user} = renderTabs()

  await user.click(getByTestId('button-2'))

  await user.keyboard('{ArrowRight}')
  expect(getByTestId('button-4')).toHaveFocus()
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-2')).toHaveAttribute('tabindex', '-1')

  await user.keyboard('{ArrowLeft}')
  expect(getByTestId('button-2')).toHaveFocus()
  expect(getByTestId('button-2')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '-1')
})
```

#### Abstract DOM parsing

We want our arrow navigation to be able to skip past button 3 and move straing
to button 4 on arrow right, and back to button 2 on arrow left. Now, we will use
this requirement to refactor our siblings strategy. Since parsing the DOM has
some contraints, we need to work around this. One way would be to add some
functions to our hook `options` such as:

- getNextSibling / getPreviousSibling, which could be used to parse the DOM
  depending on the DOM structure of the component that the hook is going to be
  used for.

```ts
function getNextSibling(element: HTMLElement): HTMLElement
```

- getItems, similar thing, but get the collection of all the items that are
  relevant to the roving tabindex.

```ts
function getItems(element: HTMLElement): HTMLElement[]
```

We could provide hook defaults for these functions (our current strategy) and
advertise the API. It should do the job. However, there's another option as
well:

#### Using Item Refs

Since we're returning an object for each item, via `getItemProps`, why not
return a `ref` as well? And with our `ref` function, we could add the item in
our own item refs array and use that to look for item indeces and also to check
the element directly, if it's disabled or not.

I honestly prefer this second option. Our hook, with the same functionality,
becomes:

```tsx
// useRovingTabIndex.ts
export function useRovingTabIndex(): RovingTabIndexReturn {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const itemRefs = React.useRef<(HTMLElement | null)[]>([])

  const getContainerProps = (): React.HTMLAttributes<HTMLElement> => ({
    onKeyDown: event => {
      if (event.key === 'ArrowRight') {
        setCurrentIndex(prev => prev + 1)
        const nextElement = itemRefs[currentIndex + 1]

        nextElement?.focus()
      } else if (event.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev - 1)

        const prevElement = itemRefs[currentIndex - 1]
        prevElement?.focus()
      }
    },
    onFocus: event => {
      const target = event.target as HTMLElement
      const index = Array.from(target.parentElement?.children || []).indexOf(
        target,
      )
      setCurrentIndex(index)
    },
  })

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      itemRefs.current[index] = el
    },
    tabIndex: index === currentIndex ? 0 : -1,
  })
}
```

#### Looking for that Next Focusable Element

Much better, but our test is still failing. Of course, now we need to check it
the next item is going to be disabled, and if so, look for the next non disabled
item. This is not that straightforward, and it involves a solid lookup strategy:

1. Look for the next focusable item in the direction the user was navigation to.
2. If there are no focusable items in that direction, start from the other end
   of the array and look again.
3. If we still did not find any focusable item, keep focus on that item.
4. Make sure we stop searching after the first wrap.

With this in mind, our keydown handler becomes more complex:

```tsx
// useRovingTabIndex.tsx
type Direction = 'next' | 'previous'

// inside getContainerProps return object
function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  let direction: Direction

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      direction = 'next'
      break
    case 'ArrowLeft':
      event.preventDefault()
      direction = 'previous'
      break
    default:
      return
  }

  let wrapped = false
  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

  while (nextIndex >= 0 && nextIndex < itemRefs.current.length) {
    if (nextIndex === 0) {
      if (wrapped) {
        break
      }

      wrapped = true
    }

    const nextElement = itemRefs.current[nextIndex]

    if (nextElement && !nextElement.hasAttribute('disabled')) {
      setCurrentIndex(nextIndex)
      nextElement.focus()
      break
    } else {
      nextIndex = direction === 'next' ? nextIndex + 1 : nextIndex - 1
    }
  }
}
```

This is what happens:

1. We get the direction by parsing the arrow keys.
2. We assume that we can search the array twice: one in the initial direction,
   and only one more time, starting from the other end. We will keep track of
   this using `wrapped`.
3. We initialize the `nextIndex` based on `direction`.
4. While we are still in bounds:
5. We check if we're at the end, and if we wrapped, we exit, otherwise we mark
   that we wrapped, so next time we exit if needed.
6. We get the element candidate for focus.
7. If it's focusable, we update the index, focus the element, and exit.
8. Otherwise, we update the `nextIndex`, and loop again.

#### Fixing the Wrapping Lookup

Our test is now green, but it's not done, since we kind of missed a use case
here. Actually, it's more like a bug. When we reach the end of the list, we're
not updating nextIndex accordingly. When reaching the end of the list, the
`nextIndex` needs to go to the other end of the list. So it clearly needs to
become more robust.

A relevant test case to catch this regression:

```tsx
// useRovingTabIndex.test.ts
it('should wrap one to look for the next focusable item ', async () => {
  const {getByTestId, user} = renderTabs()

  await user.click(getByTestId('button-4'))
  getByTestId('button-5').setAttribute('disabled', 'true')

  await user.keyboard('{ArrowRight}')
  expect(getByTestId('button-1')).toHaveFocus()
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '-1')

  await user.keyboard('{ArrowLeft}')
  expect(getByTestId('button-4')).toHaveFocus()
  expect(getByTestId('button-4')).toHaveAttribute('tabindex', '0')
  expect(getByTestId('button-1')).toHaveAttribute('tabindex', '-1')
})
```

I will go ahead and move this logic to a new function:

```ts
function getNextIndex(
  currentIndex: number,
  direction: Direction,
  listSize: number,
): number {
  if (currentIndex === 0 && direction === 'previous') {
    return listSize - 1
  }

  if (currentIndex === listSize - 1 && direction === 'next') {
    return 0
  }

  return direction === 'next' ? currentIndex + 1 : currentIndex - 1
}
```

#### Final Version

And we replace the calls in the keydown handler. We will also do a small change
to the `getContainerProps` function to be wrapped in `React.useCallback` since
we might not want to render our list every time, if nothing changes, just
because we create the function each time.

```tsx
// useRovingTabIndex.tsx
const getContainerProps = React.useCallback(() => {
  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    let direction: Direction

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        direction = 'next'
        break
      case 'ArrowLeft':
        event.preventDefault()
        direction = 'previous'
        break
      default:
        return
    }

    const listSize = itemRefs.current.length
    let wrapped = false
    let nextIndex = getNextIndex(currentIndex, direction, listSize)

    while (nextIndex >= 0 && nextIndex < listSize) {
      if (nextIndex === 0) {
        if (wrapped) {
          break
        }

        wrapped = true
      }

      const nextElement = itemRefs.current[nextIndex]

      if (nextElement && !nextElement.hasAttribute('disabled')) {
        setCurrentIndex(nextIndex)
        nextElement.focus()
        break
      } else {
        nextIndex = getNextIndex(nextIndex, direction, listSize)
      }
    }
  }

  function onFocus(event: React.FocusEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    const index = Array.from(target.parentElement?.children || []).indexOf(
      target,
    )
    setCurrentIndex(index)
  }

  return {
    onKeyDown,
    onFocus,
  }
}, [currentIndex])
```

We're in a great spot right now, and most of our core functionality is
implemented.

### Wrapping up for now

With our core functionality done, I believe we can review our requirements list
and prepare v2 for our `useRovingTabIndex` hook. I will cover this part in a
subsequent article, but you can go ahead and already implement the rest of the
requirements yourself and we can compare notes in the second part.

So, the list, and with some updates, starting from #11. These new requirements
will be more or less obvious as we implement, if not from the beginning.

1. Only one item in the collection should be tabbable at a time.
   > Done ✅
2. tabindex="0" should follow focus.
   > Done ✅
3. Tabbing from and back to the collection should apply focus to the item that
   was last focused.
   > Done ✅
4. Keyboard navigation should work with Arrow Keys, as well as Home and End.
   > Partially done, we need to implement Home and End. 📋
5. Navigation orientation should be both horizontal and vertical.
   > WIP📋
6. RTL should also be considered for horizontal navigation.
   > WIP📋
7. Disabled items should be skipped when navigating, but how do we mark a
   disabled item?
   > Partially done, we only considered `disabled` attributes. 📋
8. Navigation might be circular or not, so we should support both.
   > Partially done, we considered circular by default. 📋
9. It has to be re-usable.
   > Done ✅
10. Some components might need to change focus based on some custom requirement
    (character key navigation), so our tabindex utility should be aware of that.

    > WIP📋

11. Being able to skip items that should not be focusable: dividers, subheaders,
    etc.

    > WIP📋

12. If initial item is disabled, we need to move focus to the next focusable
    item.

    > WIP📋

13. If the component needs to update the focusable index based on some custom
    logic, our hook needs to be in sync with that change too.
    > WIP📋

I believe we achieved great progress so far, both in our implementation and our
understanding of the strategy. Looking forward to getting the rest of the
requirements implemented and adding this into production.
