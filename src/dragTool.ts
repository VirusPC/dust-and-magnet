import { Interactor, Layer, Store, Tool } from "./lib/index";
import * as d3 from "d3";

const dragInteractor: Interactor = new Interactor("dragInteractor")
  .active("mousedown", activeCommand)
  .frame("mousemove", frameCommand)
  .terminate("mouseup", terminateCommand);

function activeCommand(event: Event, layer: Layer, store: Store) {
  const [x, y] = d3.pointer(event);
  const target = d3.select(event.target as SVGElement);
  store["offset"] = [x - +target.attr("x"), y - +target.attr("y")];
  console.log("active command executed");
}

function frameCommand(event: Event, layer: Layer, store: Store) {
  const [x, y] = d3.pointer(event);
  const [offsetX, offsetY] = store["offset"] as [number, number];
  const [newX, newY] = [x - offsetX, y-offsetY];

  const magnetProp = layer.node().attr("magnetProperty");

  layer
    .node()
    .selectAll("rect, text")
    .attr("x", newX)
    .attr("y", newY);

  const pointsLayer = layer.getSiblingLayer("points");
  const circles = pointsLayer.node().selectAll("circle");
  const data = circles.data();
  const extent = d3.extent(data, (d: {[prop: string]: number}) => d[magnetProp]);
  const range = extent[1] - extent[0];
  if(typeof extent[0] === "undefined" || typeof extent[1] === "undefined" || range===0) {
    return;
  }
  const time = 1;
  const magnitude = 1;
  for(const circle of circles) {
    const circleSelection = d3.select(circle);
    const value = (circleSelection.datum() as {[prop: string]: number})[magnetProp] as number;
    const velocity = magnitude * (value - (extent[0] as number)) / range
    //console.log(d3.select(circle).datum());
    const circleX = +circleSelection.attr("cx");
    const circleY = +circleSelection.attr("cy");
    const [velocityX, velocityY] = resolveVelocity(velocity, [newX, newY], [circleX, circleY]);
    
    circleSelection.attr("cx", circleX + velocityX * time)
    circleSelection.attr("cy", circleY + velocityY * time)
    console.log(velocityX, velocityY)
  }
}

function resolveVelocity(velocity: number, magnetPos: [number, number], dustPos: [number, number]): [number, number] {
  const xDistance = magnetPos[0] - dustPos[0];
  const yDistance = magnetPos[1] - dustPos[1];
  const hypo = Math.sqrt(xDistance ** 2 + yDistance ** 2);
  const xVelocity = xDistance / hypo * velocity;
  const yVelocity = yDistance / hypo * velocity;
  return [xVelocity, yVelocity];
}

// function getRange(data: number[]): [number, number]{
//   if(data.length<=0) return [NaN, NaN];
//   let min = data[0];
//   let max = data[1];
//   for(const num of data) {
//     if(num < min) {
//       min = num;
//     } else if (num > max) {
//       max = num;
//     }
//   } 
//   return [min, max];
// }

function terminateCommand(event: Event, layer: Layer, store: Store) {
  console.log("terminate command executed");
}

export const DragTool = () => new Tool([dragInteractor]);
