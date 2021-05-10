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

  // move magnet
  const [offsetX, offsetY] = store["offset"] as [number, number];
  const [newX, newY] = [x - offsetX, y-offsetY];
  layer
    .node()
    .selectAll("rect, text")
    .attr("x", newX)
    .attr("y", newY);


  // move dusts
  const magnets = d3.selectAll(".magnet");
  const pointsLayer = layer.getSiblingLayer("points");
  const circles = pointsLayer.node().selectAll("circle");
  const data = circles.data();

  const magnetData: {
    prop: string,
    x: number,
    y: number,
    min: number,
    max: number
  }[] = [];


  for(const magnet of (magnets as Iterable<SVGElement>)) {
    magnetData.push({
      prop: magnet.getAttribute("magnetProperty"),//d3.select(magnet).attr("magnetProperty"),
      x: +magnet.querySelector("rect").getAttribute("x"),
      y: +magnet.querySelector("rect").getAttribute("y"),
      min: +magnet.getAttribute("min"),
      max: +magnet.getAttribute("max"),
    })
  }

  console.log(magnetData);
  
  const time = 1;
  const magnitude = 1;
  for(const circle of circles) {
    const circleSelection = d3.select(circle);
    const circleX = +circleSelection.attr("cx");
    const circleY = +circleSelection.attr("cy");
    let vxAcc = 0;
    let vyAcc = 0;
    console.log("data", magnetData)
    for(const magnet of magnetData){
      const {prop, x, y, min, max} = magnet;
      const range = max - min;
      console.log(min, max, range)
      if(range === 0 ){
        continue;
      }
      const value = (circleSelection.datum() as {[prop: string]: number})[prop] as number;
      const velocity = magnitude * (value - min) / range
      //console.log(d3.select(circle).datum());
      const [velocityX, velocityY] = resolveVelocity(velocity, [x, y], [circleX, circleY]);
      vxAcc += velocityX;
      vyAcc += velocityY;
    }
    console.log("vx",vxAcc)
    console.log("vy", vyAcc)
    vxAcc /= magnetData.length;
    vyAcc /= magnetData.length;
    circleSelection.attr("cx", circleX + vxAcc * time)
    circleSelection.attr("cy", circleY + vyAcc * time)
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
