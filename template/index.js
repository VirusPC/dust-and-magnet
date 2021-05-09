import * as vega from "vega";

const view;

fetch("https://vega.github.io/vega/examples/bar-chart.vg.json")
  .then((res) => res.json())
  .then((spec) => render(spec))
  .catch((err) => console.error(err));

function render(spec) {
  view = new vega.View(vega.parse(spec), {
    renderer: "canvas", // renderer (canvas or svg)
    container: "#main", // parent DOM container
    hover: true, // enable hover processing
  });
  return view.runAsync();
}
