import { Layer } from "./render";
import * as d3 from "d3";

type Command = () => void;

export interface Selection {
  type: string;
  query: () => SVGElement[];
}

export interface Interactor {
  active: (event: string) => void;
  frame: (event: string) => void;
  terminate: (event: string) => void;
}


export class Tool {
  // precondition: Function;
  // activeCommond: Function;
  // frameCommond: Function;
  // terminateCommond: Function;
  // selection: Selection;
  // interactor: Interactor;
  // interactor2: any;

  constructor(){}

  // setActiveCommond: (command: Command) => void;
  // setFrameCommond: (command: Command) => void;
  // setTerminateCommond: (command: Command) => void;
  
  setInteractor(layer: Layer){
    const backgroundRect = layer.view.getLayer("background").node().select("rect")
    console.log(backgroundRect.node())
    // const width = backgroundRect.attr("width");
    // const height = backgroundRect.attr("height");
    const magnetLayer = layer.view.createLayer("magnets").setRender((root) => {
      root.append("rect")
        .attr("width", 800)
        .attr("height", 600)
        .attr("opacity", 0)
    });
    magnetLayer.node().on("mousedown", function(event){
    console.log("hello")
      const magnetWidth = 30;
      const magnetHeight = 30;
      console.log(this);
      const position = d3.pointer(event);
      d3.select(this).append("rect")
        .attr("x", position[0] - magnetWidth / 2)
        .attr("y", position[1] - magnetHeight / 2)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", "orange")
    });
  }
}
