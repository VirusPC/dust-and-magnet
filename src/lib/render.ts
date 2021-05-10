import { Tool } from "./interaction";
import * as d3 from "d3";

enum Namespace {
  svg = "http://www.w3.org/2000/svg",
}

export class Layer {
  private name: string;
  private view: View;
  private root: d3.Selection<SVGGElement, unknown, SVGGElement, unknown>;
  private tools: Tool[];
  //objects: Object[];
  constructor(name: string, view: View) {
    this.name = name;
    this.view = view;
    this.root = d3
      .select(document.createElementNS(Namespace.svg, "g"))
      .classed(`layer-${name}`, true);
    this.tools = [];
  }
  attach(tool: Tool) {
    const interactors = tool.getInteractors();
    for (const interactor of interactors) {
      interactor.bindTo(this);
    }
  }
  listen: (layer: Layer) => void;
  setRender(
    render: (
      root: d3.Selection<SVGGElement, unknown, SVGGElement, unknown>
    ) => void
  ): this {
    this.render = render;
    return this;
  }
  render(root: d3.Selection<SVGGElement, unknown, SVGGElement, unknown>) {}
  run(): void {
    this.render(this.root);
  }
  node(): d3.Selection<SVGGElement, unknown, SVGGElement, unknown> {
    return this.root;
  }

  getName(): string{
    return this.name;
  }
  getSiblingLayer(name: string) {
    return this.view.getLayer(name);
  }
  createSiblingLayer(name: string) {
    return this.view.createLayer(name);
  }
  //onObject: (position: [number, number]) => boolean;
}

export class View {
  name: string;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  root: d3.Selection<SVGGElement, unknown, Element, unknown>;
  layers: Layer[];
  //newLayers: Layer[];

  constructor(
    name: string,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  ) {
    this.name = name;
    this.svg = svg;
    this.root = d3.select(document.createElementNS(Namespace.svg, "g"));
    this.root.classed(`view-${name}`, true);
    svg.node().appendChild(this.root.node());
    this.layers = [];
  }

  createLayer(
    name: string,
    render: (
      root: d3.Selection<SVGGElement, unknown, SVGGElement, unknown>
    ) => void = () => {}
  ): Layer {
    const layer = new Layer(name, this).setRender(render);
    layer.run();
    this.layers.push(layer);
    this.root.node().appendChild(layer.node().node());
    return layer;
  }

  createLayerUpon(name: string, otherName: string): Layer {
    let layer: null | Layer;
    for (let i = 0; i < this.layers.length; ++i) {
      if (this.layers[i].getName() === otherName) {
        layer = new Layer(name, this);
        this.layers.splice(i + 1, 0, layer);
        break;
      }
    }
    return layer;
  }

  getLayer(name: string): Layer {
    for (const layer of this) {
      if (layer.getName() === name) {
        return layer;
      }
    }
    return null;
  }

  run() {
    for (const layer of this) {
      layer.run();
      this.root.node().append(layer.node().node());
    }
    this.svg.node().append(this.root.node());
  }

  public *[Symbol.iterator](): IterableIterator<Layer> {
    for (const layer of this.layers) {
      yield layer;
    }
  }
}
