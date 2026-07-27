---
slug: forced-colors-support-in-material-ui
title: Forced Colors support in Material UI
authors: [silviuaavram]
tags:
  [
    react,
    accessibility,
    how to,
    open source software,
    material ui,
    windows high contrast mode,
    theming,
    forced colors,
  ]
hide_table_of_contents: false
---

![miami downtown canals view](./miami-downtown-canals.webp) <em
style={{textAlign: "center", display: 'block'}}>A view of the Miami Downtown
Canals</em>

This post explains how Windows High Contrast mode is exposed through CSS forced
colors, the gaps we found in Material UI’s component support, the implementation
approaches we evaluated, and why we ultimately chose an opt-in theme enhancer.

## The problem

Before Material UI v9.1.0, components generally behaved well with forced colors,
but our audit identified several missing states.

The fixes fall into a few groups:

- Form states: `FilledInput`, `Input`, `OutlinedInput`, `FormLabel`,
  `FormHelperText`, `FormControlLabel`, placeholders, and disabled native select
  icons.
- Selection and navigation states: `Autocomplete`, `MenuItem`, `ListItemButton`,
  and `ListItemIcon`.
- Disabled controls: `Checkbox`, `Radio`, `Slider`, and `Switch`.
- Feedback, focus, and overlays: `LinearProgress`, `ButtonBase`, `Tooltip`,
  `AccordionSummary`, and `ToggleButton`.

If these cases are not visible in forced colors mode, users can lose access to
state information: disabled, selected, focused, invalid, or in progress. The
tricky part was not finding a way to style them.

Material UI has many styling entry points. The real challenge was choosing the
right level of the system. The options we considered are documented in this
post, as well as the solution we chose to fix the issues with minimal adoption
effort and upgrade risk.

The following demo shows these affected states side by side.

<iframe src="https://codesandbox.io/embed/vyg89v?view=preview&module=%2Fsrc%2FDemo.tsx"
  style={{
    width: '100%',
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: 'hidden',
  }}
  loading="lazy"
  title="Material UI forced-colors component demo"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[Open the Material UI forced-colors demo in CodeSandbox](https://codesandbox.io/p/devbox/bitter-pond-vyg89v).

{/* truncate */}

## How forced colors work

### Windows High Contrast mode

As described in the
[Microsoft blog](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/),
Windows High Contrast mode is an accessibility feature designed to increase text
legibility and improve readability. In modern Windows versions, users configure
this through High Contrast or Contrast themes, depending on the version.

The user can select a limited palette of system colors that the operating system
applies across the UI. Web developers need to make sure their apps integrate
with those colors instead of fighting them.

#### Windows Themes

To trigger High Contrast mode directly from Windows, you need access to a
Windows machine. Then select a High Contrast theme from the settings:

- Windows 10: Settings > Ease of Access > High contrast.
- Windows 11: Settings > Accessibility > Contrast themes.

From the options, select or customize a contrast theme. Microsoft explicitly
distinguishes contrast themes from ordinary light and dark themes.

#### Chrome DevTools Emulation

If you don't have Windows available, you can use Chrome DevTools to emulate the
`forced-colors` and `prefers-color-scheme` media conditions. This does not
reproduce a specific Windows contrast theme or a user-customized palette. Use it
for quick checks, then validate the result with an actual Windows contrast
theme.

Open DevTools > More tools > Rendering, then use:

- `forced-colors`: when set to `active`, it emulates forced colors inside the
  browser.
- `prefers-color-scheme`: forces either `light` or `dark`, which is useful
  because forced colors should work in both color schemes.

### CSS System Colors

When Windows High Contrast mode is turned on, browsers expose it to web content
through the `forced-colors` media feature. In this mode, complex color
gradients, shadows, and some background images are removed or simplified. Text,
borders, backgrounds, controls, and selections are mapped to a small set of
colors that are expected to contrast with each other.

These overrides are expressed with
[CSS system colors](https://www.w3.org/TR/css-color-4/#css-system-colors). They
have browser and operating system defaults, but they can also reflect the user's
chosen contrast theme. For example, `SelectedItem` and `SelectedItemText`
represent the background and text colors for selected items. `Canvas` and
`CanvasText` represent the page background and regular text. `GrayText`
represents disabled content.

Browsers force a defined set of color-related properties at paint time. That
detail matters: the CSS cascade can still contain author colors, but the browser
paints a forced system color instead. System color keywords give authors a way
to make the rest of the component fit that same palette.

### CSS Features

CSS provides a media query that detects whether forced colors are active:

#### @media (forced-colors: `<value>`)

```css
@media (forced-colors: active) {
  .selected-menu-item {
    color: SelectedItemText;
    background-color: SelectedItem;
  }
}
```

Here, we're using a pair of system colors to style a menu item's selected state.
Native HTML elements get a lot of this behavior from the browser for free.
Custom-built components do not always have that same semantic mapping, so
component libraries need to fill the gap.

#### forced-color-adjust: `<value>`

Another useful CSS feature is the
[forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/forced-color-adjust)
property. It can opt an element out of automatic forced-color adjustment.

This is a sharp tool. When `forced-color-adjust: none` is used, the browser
stops protecting that element's colors, so the author becomes responsible for
the contrast of the element and its children. In Material UI, that made sense
for selected and active states where we wanted to pair colors like
`SelectedItem` with `SelectedItemText` or `Highlight` with `HighlightText`.

## Forced Color Support in Material UI

### The options

We considered the options along three dimensions: scope, user effort, and update
risk.

#### The `sx` prop

```jsx
<Button
  sx={{
    '@media (forced-colors: active)': {
      border: '1px solid ButtonBorder',
      color: 'ButtonText',
    },
  }}
>
  Save changes
</Button>
```

This is the quickest way to patch a local styling issue. It's great for
app-specific edge cases, but it would push the responsibility to every
Material UI user and every component instance. That is not enough for a
library-level accessibility fix.

#### The `styled()` wrappers

```jsx
const AppButton = styled(Button)(() => ({
  '@media (forced-colors: active)': {
    borderColor: 'ButtonBorder',
  },
  '&:focus-visible': {
    '@media (forced-colors: active)': {
      outline: '5px auto Highlight',
    },
  },
}))
```

This is a step up from `sx` because the fix can be reused between component
instances. But it still creates a userland wrapper that app teams need to adopt
everywhere. It also fragments the fix across applications instead of solving it
in Material UI.

#### Global CSS / `GlobalStyles`

```jsx
<GlobalStyles
  styles={{
    '@media (forced-colors: active)': {
      '.MuiButtonBase-root:focus-visible': {
        outline: '5px auto Highlight',
      },
      '.MuiTooltip-tooltip': {
        border: '1px solid ButtonText',
      },
    },
  }}
/>
```

Global CSS can cover a broad surface area, but it is selector-based. That makes
it more brittle around class names, slots, specificity, and composition. It can
be useful as a temporary app-level patch, but it is not the most maintainable
way for Material UI to encode component-aware state fixes.

#### Theme `components.styleOverrides`

```jsx
const theme = createTheme({
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          [`&.${menuItemClasses.selected}`]: {
            '@media (forced-colors: active)': {
              forcedColorAdjust: 'none',
              color: 'SelectedItemText',
              backgroundColor: 'SelectedItem',
            },
          },
          [`&.${menuItemClasses.focusVisible}, &:hover`]: {
            '@media (forced-colors: active)': {
              forcedColorAdjust: 'none',
              color: 'HighlightText',
              backgroundColor: 'Highlight',
            },
          },
        },
      },
    },
  },
})
```

For application teams, this is probably the best centralized option. It is
component-aware, lives in the theme, and avoids repeated `sx` or wrapper code.
It also matches the mechanism Material UI already uses for component
customization.

#### Built-in styles inside components

From the library side, the most direct option would be to put the forced-colors
styles inside each component.

```js
const ButtonRoot = styled(ButtonBase)(({theme}) => ({
  // regular Button styles...

  '@media (forced-colors: active)': {
    '&:focus-visible': {
      outline: '5px auto Highlight',
    },

    [`&.${buttonClasses.disabled}`]: {
      color: 'GrayText',
      opacity: 1,
    },
  },
}))
```

This would make the fix automatic, which is attractive for accessibility. But
there is a trade-off: some users have already patched these states in their own
themes. Shipping built-in styles could change their UI on upgrade, even if the
change is well-intentioned. We wanted to provide the fix from our side without
surprising existing applications.

#### Theme Enhancer

To avoid breaking changes and still deliver a Material UI-owned fix, we
considered a fully opt-in theme enhancer. The trade-off is that consumers
receive no improvement until their teams discover and enable the enhancer. We
accepted that adoption cost to avoid changing existing forced-colors
customizations in a minor release. The proposed API was intentionally small:

```js
const userTheme = createTheme({
  // user theme options
})
const enhancedTheme = enhanceHighContrast(userTheme, {
  // system color value overrides
})
```

This gives Material UI a central place to provide the required `styleOverrides`,
while giving users explicit control over when those overrides are added.

### The solution

```js
import {createTheme, enhanceHighContrast} from '@mui/material/styles'

const theme = enhanceHighContrast(createTheme())
```

Material UI v9.1.0 introduced the
[enhanceHighContrast](https://mui.com/material-ui/customization/palette/#windows-high-contrast-mode)
theme enhancer. It represents the work mainly done in this
[pull request](https://github.com/mui/material-ui/pull/48319), with some small
follow-ups.

The
[enhanceHighContrast](https://mui.com/material-ui/customization/theming/#enhancehighcontrast-theme-tokens-theme)
function takes the user's theme as its first argument and optional system color
token overrides as the second argument. The enhancer then layers forced-colors
fixes on top of the theme.

This approach requires minimal user code, remains completely opt-in, retains
existing `components.styleOverrides`, and keeps the forced-colors behavior
centralized in the theme. It also gives teams a gradual path: they can adopt the
enhancer, compare it with their existing customizations, and override individual
system color tokens when needed.

For example, here's the theme override for the FormLabel's error and disabled
states, using tokens:

```ts
// Simplified excerpt.
const HCM = '@media (forced-colors: active)'

const defaultHcTokens = {
  disabled: 'GrayText',
  error: 'ActiveText',
  selectedBackground: 'SelectedItem',
  selectedText: 'SelectedItemText',
  activeBackground: 'Highlight',
  activeText: 'HighlightText',
  buttonBorder: 'ButtonBorder',
  buttonText: 'ButtonText',
  canvas: 'Canvas',
}

function enhanceHighContrast<
  T extends {components?: Theme['components'] | undefined},
>(themeInput: T, tokens?: HighContrastTokens): T {
  const hcTokens = {
    ...defaultHcTokens,
    ...tokens,
  }
  const theme = {...themeInput}
  const c = theme.components
  theme.components = {
    ...c,
    MuiFormLabel: {
      ...c?.MuiFormLabel,
      styleOverrides: {
        ...c?.MuiFormLabel?.styleOverrides,
        root: [
          c?.MuiFormLabel?.styleOverrides?.root,
          {
            [`&.${formLabelClasses.error}`]: {
              [HCM]: {
                color: hcTokens.error,
              },
            },
            [`&.${formLabelClasses.disabled}`]: {
              [HCM]: {
                color: hcTokens.disabled,
              },
            },
          },
        ],
      },
    },
  }
  return theme
}
```

`hcTokens` is created by merging the default tokens with user-provided
overrides. Use CSS system-color keywords so the components continue to reflect
the user’s chosen palette. This is especially important where
`forced-color-adjust: none` is applied, because the browser no longer replaces
author colors in that subtree. See [CSS system colors](#css-system-colors).

By default, active and toggled states use `Highlight` and `HighlightText`. The
following example intentionally gives them the same colors as selected items:

```js
const theme = enhanceHighContrast(createTheme(), {
  activeBackground: 'SelectedItem',
  activeText: 'SelectedItemText',
})
```

## Takeaways

Forced colors are not just another dark mode. They are a user-controlled
accessibility mode where the browser and operating system intentionally reduce
the color palette. Supporting that mode well means respecting system colors,
using `forced-color-adjust` carefully, and making component states visible
without asking every app team to rediscover the same fixes.

The `enhanceHighContrast` feature is part of Material UI's effort to improve
accessibility and encourage accessible UX in web apps. We recommend that
consumers enable the enhancer and check the improvements either directly with a
Windows High Contrast theme, or through DevTools emulation. After adding the
enhancer, consider testing:

- Keyboard focus: verify that every focused element has a clearly visible focus
  indicator.
- Pointer hover: ensure hover feedback remains visible and distinguishable from
  selection.
- Disabled states: verify that disabled controls remain recognizable.
- Selections: ensure selected items remain distinguishable from focus and hover.
- Error states: verify that invalid fields remain identifiable without relying
  on color alone.

Together, these checks help ensure that essential component states remain
perceivable across user-selected contrast palettes.
