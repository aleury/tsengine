import TSEngine from './core/engine'

var engine: TSEngine

// The entrypoint of the application.
window.onload = () => {
  engine = new TSEngine()
  engine.start()
}

window.onresize = () => {
  engine.resize()
}