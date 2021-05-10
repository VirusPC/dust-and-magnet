import {Tool, Interactor, Layer} from './lib/index'
import * as d3 from 'd3';
import {dragTool} from './dragTool'

const clickInteractor: Interactor = new Interactor("clickInteractor")
  .prepare(prepareCallback)
  .active("click", clickCommand);

function prepareCallback(layer: Layer) {
  const magnetLayer = layer.view.createLayer("magnets");
  magnetLayer.attach(dragTool);
}

function clickCommand(event: Event, layer: Layer) {
  const magnetWidth = 30;
  const magnetHeight = 30;
  const position = d3.pointer(event);
  const magnetsLayer = layer.view.getLayer("magnets");
  magnetsLayer
    .node()
    .append("rect")
    .attr("x", position[0] - magnetWidth / 2)
    .attr("y", position[1] - magnetHeight / 2)
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "orange");
}

export const dnmTool = new Tool([clickInteractor]);
