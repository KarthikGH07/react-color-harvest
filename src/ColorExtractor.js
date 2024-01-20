// @flow

import React, { useEffect } from "react";
import Vibrant from "node-vibrant";

import type { Image, Props } from "./types";

// This component takes a src prop (image source, can be a blob or an image path) or intercepts it's children to get the image element,
// and parses the image using node-vibrant, and finally invokes the prop callback with an array of colors.
const ColorExtractor = (props) => {
  const {
    onError = () => {},
    // Colors can be in vec3 format (rgb or hsl) or in hex format
    getColors = () => {},
    rgb = false,
    hex = true,
    src = null,
    maxColors = 64,
    children,
  } = props;

  useEffect(() => {
    processImage();
  }, [src, children.props.src]);

  const processImage = () => {
    if (children) {
      // If the image element is direct children of ColorExtractor component, intercept the children and use the `src` property
      // $FlowFixMe
      if (children.props.src) {
        parseImage(children.props.src, props);
      }
    } else if (src && typeof src === "string" && src.length > 0) {
      // if the image is provided via src prop
      parseImage(src, props);
    } else {
      console.error(
        "Please provide an image url using the 'src' prop or wrap an image element under the <ColorExtractor /> component. Check out the docs for more info - https://goo.gl/rMZ5L7"
      );
    }
  };

  // Parse the image and extract the colors
  const parseImage = (image: Image, props: Props) => {
    Vibrant.from(image)
      .maxColorCount(maxColors)
      .getSwatches()
      .then((swatches) => getColors(getColorsFromSwatches(swatches, props)))
      .catch((error) => {
        if (error) {
          // This error is mainly due to CORS issue. So we retry again by using the default image class. But if still there is any error, we bail out!
          useDefaultImageClass(image, props);
        }
      });
  };

  const useDefaultImageClass = (image: Image, props: Props) => {
    // If there is any CORS issue, then the default class recreates the image element with crossOrigin set to anonymous.
    new Vibrant.DefaultOpts.ImageClass()
      // $FlowFixMe
      .load(image.src)
      .then((data) => {
        if (data.image) {
          Vibrant.from(data.image)
            .getSwatches()
            .then((swatches) =>
              getColors(getColorsFromSwatches(swatches, props))
            )
            .catch((error) => {
              if (error) {
                onError(error);
              }
            });
        }
      })
      .catch((error) => {
        if (error) {
          onError(error);
        }
      });
  };

  // Get the array of colors from swatches
  const getColorsFromSwatches = (swatches: Object, props: Props) => {
    const colors = [];

    for (let swatch in swatches) {
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        if (rgb) {
          colors.push(swatches[swatch].getRgb());
        } else {
          colors.push(swatches[swatch].getHex());
        }
      }
    }

    return colors;
  };

  const length = React.Children.count(children);

  // We don't handle multiple images at the moment or custom components, sorry!
  if (length > 1) {
    throw new Error("Expected only one image element.");
  } else if (length === 1) {
    // Children should be an image element
    // $FlowFixMe
    if (children.type === "img") {
      return children;
    } else {
      throw new Error(
        `Expected children to be an image element but instead got a "${children.type}"`
      );
    }
  } else {
    return null;
  }
};

export default ColorExtractor;
