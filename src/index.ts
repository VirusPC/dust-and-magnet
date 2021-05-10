import { View, Layer, Tool, Selection, Interactor, Command } from "./lib/index";
import * as d3 from "d3";
import cars from "./data/cars";

const data = cars.slice(0, 10);

const width = 800;
const height = 600;

const svg = d3
  .select("main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewport", `0 0 ${width} ${height}`);

const view = new View("dust-and-magnet", svg);
const backgroundLayer = view
  .createLayer("background")
  .setRender(renderBackground);
const pointsLayer = view
  .createLayer("points")
  .setRender(renderPoints);
view.run();

const clickInteractor: Interactor = new Interactor()
  .prepare(prepareCallback)
  .active("click", clickCommand);
const DnMTool = new Tool(clickInteractor);
backgroundLayer.attach(DnMTool);
view.run();






function prepareCallback(layer: Layer) {
  const backgroundRect = layer.view.getLayer("background").node().select("rect")
  const width = backgroundRect.attr("width");
  const height = backgroundRect.attr("height");
  const magnetLayer = layer.view.createLayer("magnets")
}

function clickCommand(event: Event, layer: Layer) {
  const magnetWidth = 30;
  const magnetHeight = 30;
  const position = d3.pointer(event);
  layer.node().append("rect")
    .attr("x", position[0] - magnetWidth / 2)
    .attr("y", position[1] - magnetHeight / 2)
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "orange")
}

function renderBackground(root: d3.Selection<SVGGElement, unknown, Element, unknown>) {
  root
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#eee");
}

function renderPoints(root: d3.Selection<SVGGElement, unknown, Element, unknown>) {
  const radius = 10;
  root.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", radius);
}


