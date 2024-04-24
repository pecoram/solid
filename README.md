<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=solid-lightning" alt="SolidJS Lightning" />
</p>

# solid-lightning

Solid-Lightning is a UI framework for [Lightning Renderer](https://lightningjs.io/) built with [SolidJS](https://www.solidjs.com/) Universal Renderer. It allows you to declaratively construct lightning nodes with reactive primitives, just as you would construct a DOM tree in SolidJS. Also check out [Solid Lightning Primitives](https://github.com/lightning-js/solid-primitives) for additional primitives to speed up your development.

## Documentation

[SolidJS Lightning Docs](https://lightning-js.github.io/solid/)

## Demo App

[Solid TMDB Demo App](https://github.com/lightning-js/solid-demo-app)

## Playground

[playground.solidjs.com](https://playground.solidjs.com/anonymous/dfca7350-166e-4c6c-b367-74cc09bdaf09)

## Quick Start

Clone starter template:

```sh
> npx degit lightning-js/solid-starter-template my-app
> cd my-app
> npm i # or yarn or pnpm
> npm start # or yarn or pnpm
```

### Hello World

```jsx
import { render, Text } from '@lightningjs/solid';

render(() => <Text>Hello World</Text>);
```

For a more detailed Hello World guide check out the [Hello World](HelloWorld.md) guide.
