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
  const target = d3.select(event.target as SVGElement);
  target.attr("x", x - offsetX).attr("y", y - offsetY);
}

function terminateCommand(event: Event, layer: Layer, store: Store) {
  console.log("terminate command executed");
}

export const DragTool = () => new Tool([dragInteractor]);
