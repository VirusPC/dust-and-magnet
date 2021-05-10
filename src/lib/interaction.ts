import { Layer } from "./render";
import * as d3 from "d3";

export type Command = (event?: Event, layer?: Layer) => void;

// export class Command {
//   event: string;
//   callback: Function;
//   constructor(event: string, callback: Function) {
//     this.event = event;
//     this.callback = callback;
//   }
// }

export interface Selection {
  type: string;
  query: () => SVGElement[];
}

export class Interactor {
  activeEvent: string;
  frameEvent: string;
  terminateEvent: string;

  prepareCommand: (layer?: Layer) => void;
  activeCommand: Command;
  frameCommand: Command;
  terminateCommand: Command;

  constructor() {
    this.activeEvent = "";
    this.frameEvent = "";
    this.terminateEvent = "";
    this.prepareCommand = () => { };
    this.activeCommand = () => { };
    this.frameCommand = () => { };
    this.terminateCommand = () => { };
  }
  // setActiveEvent(event: string): this {
  //   this.activeEvent = event;
  //   return this;
  // }
  // setFrameEvent(event: string): this {
  //   this.frameEvent = event;
  //   return this;
  // }
  // setTerminateEvent(event: string): this {
  //   this.terminateEvent = event;
  //   return this;
  // }
  // setActiveCommond(command: Command): this {
  //   this.activeCommand = command;
  //   return this;
  // };
  // setFrameCommond(command: Command): this {
  //   this.frameCommand = command; 
  //   return this;
  // };
  // setTerminateCommond(command: Command): this {
  //   this.terminateCommand = command;
  //   return this;
  // };
  prepare(command: (layer: Layer) => void): this {
    this.prepareCommand = command;
    return this;
  }
  active(event: string, command: Command): this {
    this.activeEvent = event;
    this.activeCommand = command;
    return this;
  };
  frame(event: string, command: Command): this {
    this.frameEvent = event;
    this.frameCommand = command;
    return this;
  };
  terminate(event: string, command: Command): this {
    this.terminateEvent = event;
    this.terminateCommand = command;
    return this;
  };

  bindTo(layer: Layer) {
    const { activeEvent, frameEvent, terminateEvent } = this;
    const { prepareCommand, activeCommand, frameCommand, terminateCommand } = this;
    prepareCommand(layer);

    let state = State.TERMINATE;

    layer.node().on(activeEvent, function (event) {
      console.log("----ative----")
      console.log(this);
      activeCommand(event, layer);
      state = State.ACTIVE;
    });
    layer.node().on(frameEvent, function (event) {
      if(state === State.ACTIVE || state === State.FRAME) {
        activeCommand(event, layer);
        state = State.FRAME;
      }
    });
    layer.node().on(terminateEvent, function (event) {
      if(state === State.FRAME) {
        terminateCommand(event, layer);
        state = State.TERMINATE;
      }
    });
  }

}


export class Tool {
  // precondition: Function;
  // activeEvent: string;
  // frameEvent: string;
  // terminateEvent: string;
  // activeCommond: Function;
  // frameCommond: Function;
  // terminateCommond: Function;
  // selection: Selection;
  interactor: Interactor;
  // interactor2: any;

  constructor(interactor: Interactor) {
    this.interactor = interactor;
  }


  setInteractor(layer: Layer) {
    const backgroundRect = layer.view.getLayer("background").node().select("rect")
    const width = backgroundRect.attr("width");
    const height = backgroundRect.attr("height");
    const magnetLayer = layer.view.createLayer("magnets").setRender((root) => {
      root.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
    });
    magnetLayer.node().on("mousedown", function (event) {
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


enum State {
  ACTIVE,
  FRAME,
  TERMINATE,
}
