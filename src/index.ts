import { View, Layer, Tool, Selection, Interactor } from "./lib/index";
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

const clickCommand = () => {
  
}
const DnMTool = new Tool();
backgroundLayer.attach(DnMTool);
// const interactor = new Interactor()
//   .active("mousedown")
//   .frame("mousemove")
//   .end("mouseup")
// // frame中也可以填interactor
// // new interactor("d m u")
// const selection = (freeDgrees: [])=>{
//   // ...
// }
// const DnMTool = new Tool()
//   .interactor()
//   .selection()
//   .frameCommond();
// pointsLayer.attach();
// //



console.log(data);

view.run();

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
      .attr("cx", width/2)
      .attr("cy", height/2)
      .attr("r", radius);
}


