# react-color-harvest

<p align="center">
  <img src="https://github.com/nitin42/react-color-extractor/blob/master/assets/Demo.gif" />
</p>

## What

`react-color-harvest` is a React component that extracts colors from an image.

## Disclaimer

This repository is a fork of the unmaintained https://github.com/nitin42/react-color-extractor repository.

## Use cases

- Design systems

- Creative coding

- Creating advanced color tools

## Install

```
npm install react-color-harvest
```

or if you use `yarn`

```
yarn add react-color-harvest
```

**This package also depends on React, so make sure you've it installed.**

## Example

```js
import React from "react";
import { ColorExtractor } from "react-color-harvest";

class App extends React.Component {
  state = { colors: [] };

  renderSwatches = () => {
    const { colors } = this.state;

    return colors.map((color, id) => {
      return (
        <div
          key={id}
          style={{
            backgroundColor: color,
            width: 100,
            height: 100,
          }}
        />
      );
    });
  };

  getColors = (colors) =>
    this.setState((state) => ({ colors: [...state.colors, ...colors] }));

  render() {
    return (
      <div>
        <ColorExtractor getColors={this.getColors}>
          <img
            src="https://i.imgur.com/OCyjHNF.jpg"
            style={{ width: 700, height: 500 }}
          />
        </ColorExtractor>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {this.renderSwatches()}
        </div>
      </div>
    );
  }
}
```

## Examples

Check out the [`examples`](./examples) folder.

## Usage

`react-color-harvest` can be used in two different ways.

- **With image element as children**

```js
<ColorExtractor getColors={colors => console.log(colors)}>
  <img src="..." alt="..." style={{...}} />
</ColorExtractor>
```

Check out [this](./examples/WithChildren.js) example.

- **Passing a local or remote image, or a blob url via `src` prop**

```js
<ColorExtractor
  src="<local-or-remote-image-url-or-blob-url>"
  getColors={(colors) => console.log(colors)}
/>
```

Check out [this](./examples/WithSrc.js) example.

## Using remote images

In development, make sure that you've configured proxy settings in your server config when you are using the remote images, otherwise you might run into [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issue. You can also use [this](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) chrome extension to tackle CORS issue.

## API

### `<ColorExtractor />` props

#### `getColors`

**`(colors: Array<Array<number> | string>) => void`**

`getColors` callback is invoked with an array of colors, either in hex or rgb format once the image is done processing. Use this callback to update the state with the colors array

```js
<ColorExtractor getColors={(colors) => this.setState({ colors: colors })} />
```

#### `rgb`

**`type: boolean`**

When set to `true`, produces the color in `rgb` format. By default, colors produced are in hex format

```js
<ColorExtractor rgb getColors={(colors) => console.log(colors)} />
```

This will log colors in `rgb` format

#### `onError`

**`(error: Object) => void`**

`onError` callback is invoked if there is any issue with processing the image.

```js
<ColorExtractor onError={error => this.setState({ hasError: true , msg: error })}>
```

#### `src`

**`type: string`**

`src` prop accepts a remote or local image url, or a blob url.

```js
<ColorExtractor
  src="https://i.imgur.com/OCyjHNF.jpg"
  getColors={(colors) => console.log(colors)}
/>
```

#### `maxColors`

**`type: number`**

`maxColors` prop accepts a number for amount of colors in palette from which swatches will be generated.

```js
<ColorExtractor src="..." getColors={colors => ...} maxColors={128} />
```

## Contributing

If you like to contribute to this project, fork the repo and then follow the below instructions to setup the project locally on your machine.

```
git clone https://github.com/<your_username_here>/react-color-harvest

cd react-color-harvest

yarn
```

### Building the source code

Run `yarn build:component` to build the source code.

## TODO

- [ ] Migrate from `flow` to `typescript`
- [ ] Convert React Class Components to Functional Components
