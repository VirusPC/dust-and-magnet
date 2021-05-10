import { Tool, Interactor, Layer, Store } from "./lib/index";
import * as d3 from "d3";
import { DragTool } from "./dragTool";

const ClickInteractor: () => Interactor = () =>
  new Interactor("clickInteractor")
    .prepare(prepareCallback)
    .active("click", clickCommand);

const clickInteractor: Interactor = ClickInteractor();

function prepareCallback(layer: Layer, store: Store) {
  store["magnetsNum"] = 0;
  const pointsLayer = layer.getSiblingLayer("points");
  store["magnetsPropertys"] = "";
  // const magnetLayer = layer.view.createLayer("magnets");
  // magnetLayer.attach(dragTool);
}

function clickCommand(event: Event, layer: Layer, store: Store) {
  const magnetWidth = 30;
  const magnetHeight = 30;
  const position = d3.pointer(event);
  const magnetsNum = store["magnetsNum"] as number;
  const magnetsLayer = layer.createSiblingLayer(`magnet-${magnetsNum}`);

  magnetsLayer
    .node()
    .append("rect")
    .attr("x", position[0] - magnetWidth / 2)
    .attr("y", position[1] - magnetHeight / 2)
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "orange")
    .attr("magnitudeProperty", "");

  magnetsLayer.attach(DragTool());

  store["magnetsNum"] = magnetsNum + 1;
}

class Magnet {
  private property: string;
  private magnitude: number;
  constructor(property: string, magnitude = 10) {
    this.magnitude = this.magnitude;
  }
  public getProperty() {
    return this.property;
  }
  public getMagnitude() {
    return this.magnitude;
  }
}

export const DnMTool = () => new Tool([clickInteractor]);
