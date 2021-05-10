import {Interactor, Tool} from './lib/index'

const dragInteractor: Interactor = new Interactor("dragInteractor")
  .active("mousedown")
  .frame("mousemove")
  .terminate("mousedown")

function activeCommand() {
  console.log("active command executed")
}

export const dragTool = new Tool([]);