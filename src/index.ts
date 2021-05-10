import { View, Layer, Tool, Selection, Interactor, Command } from "./lib/index";
import * as d3 from "d3";
import { DnMTool } from "./dnmTool"
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

/****** rendering part *******/
const view = new View("dust-and-magnet", svg);
const backgroundLayer = view.createLayer("background", renderBackground);//.setRender(renderBackground);
const pointsLayer = view.createLayer("points", renderPoints); //.setRender(renderPoints);
//view.run();


/****** interaction part ******/
backgroundLayer.attach(DnMTool());
//view.run();



/****** render callbacks ************/
function renderBackground(
  root: d3.Selection<SVGGElement, unknown, Element, unknown>
) {
  root
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#eee");
}

function renderPoints(
  root: d3.Selection<SVGGElement, unknown, Element, unknown>
) {
  const radius = 10;
  root
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", radius);
}
