import React from "react";

import { ColorExtractor } from "../build/react-color-extractor";

import {
  IMAGE,
  IMAGE_STYLES,
  SWATCHES_STYLES,
  Swatches,
  renderSwatches,
} from "./utils";

export class WithChildren extends React.Component {
  state = { colors: [] };

  getColors = (colors) =>
    this.setState((state) => ({ colors: [...state.colors, ...colors] }));

  render() {
    return (
      <React.Fragment>
        <ColorExtractor getColors={this.getColors}>
          <img src={IMAGE} style={IMAGE_STYLES} />
        </ColorExtractor>
        <Swatches colors={this.state.colors} renderSwatches={renderSwatches} />
      </React.Fragment>
    );
  }
}
