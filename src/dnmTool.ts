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
  const datum: { [prop: string]: unknown } = pointsLayer
    .node()
    .select("circle")
    .datum() as { [prop: string]: unknown };

  const magnetPropertys = [];
  console.log(datum);
  for (const property in datum) {
    const value = datum[property];
    if (typeof value === "number") {
      magnetPropertys.push(property);
    }
  }
  store["magnetProperties"] = magnetPropertys;
  // const magnetLayer = layer.view.createLayer("magnets");
  // magnetLayer.attach(dragTool);
}

function clickCommand(event: Event, layer: Layer, store: Store) {
  const magnetWidth = 50;
  const magnetHeight = 50;
  const position = d3.pointer(event);
  const magnetsNum = store["magnetsNum"] as number;
  const magnetProperties = store["magnetProperties"] as string[];
  const magnetLayer = layer.createSiblingLayer(`magnet-${magnetsNum}`);
  const magnetProperty = magnetProperties[magnetsNum % magnetProperties.length];

  magnetLayer
    .node()
    .classed("magnet", true)
    .attr("magnetProperty", magnetProperty);

  magnetLayer
    .node()
    .append("rect")
    .attr("transform", `translate(${- magnetWidth / 2}, ${-magnetHeight / 2})`)
    .attr("x", position[0])
    .attr("y", position[1])
    .attr("width", magnetWidth)
    .attr("height", magnetHeight)
    .attr("fill", "orange");
  magnetLayer
    .node()
    .append("text")
    .attr("x", position[0])
    .attr("y", position[1])
    .text(magnetProperty)
    .style("text-anchor", "middle")
    .style("font-size", "12")
    .style("font-weight", "700");

  magnetLayer.attach(DragTool());

  store["magnetsNum"] = magnetsNum + 1;
}


export const DnMTool = () => new Tool([clickInteractor]);
