
enum TransformModes {
  X_LEFT = 1,
  X_RIGHT,
  Y_TOP,
  Y_BOTTOM,
  XY_BOTTOM_LEFT,
  XY_BOTTOM_RIGHT,
  XY_TOP_LEFT,
  XY_TOP_RIGHT,
  MOVING
}

export class ScalableDiv {
  div: HTMLDivElement
  transforming: TransformModes[] = []
  refDims: {
    x: number,
    y: number,
    width: number,
    height: number,
    cursorX: number,
    cursorY: number
  }
  public handleDimChange: () => void 
  constructor(public x: number, public y: number, public width: number, public height: number, public minWidth: number, public minHeight: number, public hotZone: number) {
    this.div = document.createElement("div")
    this.div.addEventListener("mousedown", e => {
      if (e.offsetX < this.hotZone) {
        this.transforming.push(TransformModes.X_LEFT) 
      } else if (this.width - e.offsetX < this.hotZone) {
        this.transforming.push(TransformModes.X_RIGHT)
      } 
      if (e.offsetY < this.hotZone) {
        this.transforming.push(TransformModes.Y_TOP)
      } else if (this.height - e.offsetY < this.hotZone) {
        this.transforming.push(TransformModes.Y_BOTTOM)
      } 
      
      if (this.transforming.length === 0){
        this.transforming.push(TransformModes.MOVING)
      }

      if (this.transforming.length > 0) {
        this.refDims = {x: this.x, y: this.y, width: this.width, height: this.height, cursorX: e.x, cursorY: e.y}
      }

    })

    window.addEventListener("mouseup", e => {
      this.refDims = null
      this.transforming = []
    })

    window.addEventListener("mousemove", e => {
      if (this.transforming.length > 0) {
        this.updateTransforming(e.x, e.y)
      } 
    })
  }

  updateTransforming(cursorX: number, cursorY: number) {

    var dims = {
      x: this.x, 
      y: this.y, 
      width: this.width, 
      height: this.height
    }
    
    const deltaX = cursorX - this.refDims.cursorX
    const deltaY = cursorY - this.refDims.cursorY
    
    if (this.transforming.includes(TransformModes.X_LEFT)) {
      dims.width = Math.max(this.refDims.width - deltaX, this.minWidth) 
      dims.x = this.refDims.x - (dims.width - this.refDims.width)
    } else if (this.transforming.includes(TransformModes.X_RIGHT)) {
      dims.width = this.refDims.width + deltaX
    } 
    if (this.transforming.includes(TransformModes.Y_TOP)) {
      dims.height = Math.max(this.refDims.height - deltaY, this.minHeight) 
      dims.y = this.refDims.y - (dims.height - this.refDims.height)
    } else if (this.transforming.includes(TransformModes.Y_BOTTOM)) {
      dims.height = this.refDims.height + (cursorY - this.refDims.cursorY)
    } 
    if (this.transforming.includes(TransformModes.MOVING)) {
      dims.x  = this.refDims.x + deltaX
      dims.y  = this.refDims.y + deltaY
    } 
    
    this.width = Math.max(this.minWidth, dims.width)
    this.height = Math.max(this.minHeight, dims.height)
    this.x = Math.max(0, dims.x)
    this.y = Math.max(0, dims.y)

    this.refreshCanvasDims()
  }

  refreshCanvasDims() {
    this.handleDimChange && this.handleDimChange()
    this.div.style.width = `${this.width}px`
    this.div.style.height = `${this.height}px`

    this.div.style.display = "inline-block"
    this.div.style.position = "fixed"
    this.div.style.left = `${this.x}px`
    this.div.style.top = `${this.y}px`
    this.div.style.zIndex = "2147483647"
  }
}
