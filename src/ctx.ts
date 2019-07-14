
declare global {
  interface CanvasRenderingContext2D {
    fillRectCenter(x: number, y: number, width: number, height: number): void,
    roundRectCenter(x: number, y: number, width: number, height: number, radius: number | {tr: number, br: number, bl: number, tl: number}): void;
    roundRect(x: number, y: number, width: number, height: number, radius: number | {tr: number, br: number, bl: number, tl: number}): void;
  }
}

export function setup() {
  
  CanvasRenderingContext2D.prototype.fillRectCenter = function(x: number, y: number, width: number, height: number) {
    this.fillRect(x - (width / 2), y - (height / 2), width, height)
  }
  
  CanvasRenderingContext2D.prototype.roundRectCenter = function(x: number, y: number, width: number, height: number, radius: number | {tr: number, br: number, bl: number, tl: number}) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } 
  
    const halfWidth = width / 2 
    const halfHeight = height / 2
    this.beginPath();
    this.moveTo(x + radius.tl - halfWidth, y - halfHeight);
    this.lineTo(x + width - radius.tr - halfWidth, y - halfHeight);
    this.quadraticCurveTo(x + width - halfWidth, y - halfHeight, x + width - halfWidth, y + radius.tr - halfHeight);
    this.lineTo(x + width - halfWidth, y + height - radius.br - halfHeight);
    this.quadraticCurveTo(x + width - halfWidth, y + height - halfHeight, x + width - radius.br - halfWidth, y + height - halfHeight);
    this.lineTo(x + radius.bl - halfWidth, y + height - halfHeight);
    this.quadraticCurveTo(x - halfWidth, y + height - halfHeight, x - halfWidth, y + height - radius.bl - halfHeight);
    this.lineTo(x - halfWidth, y + radius.tl - halfHeight);
    this.quadraticCurveTo(x - halfWidth, y - halfHeight, x + radius.tl - halfWidth, y - halfHeight);
    this.closePath();
  }
  
  CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, width: number, height: number, radius: number | {tr: number, br: number, bl: number, tl: number}) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } 
  
    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
  }
}