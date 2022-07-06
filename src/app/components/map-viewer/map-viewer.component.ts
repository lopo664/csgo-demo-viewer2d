import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { mapCfg } from '../map-overview-cfg';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, OnChanges {
  public width: number = 800;
  public height: number = 800;

  @Input() public gameState: any = {
    players: [],
    deaths: [],
    bomb: [],
    nades: [],
    flashes: [],
    smokes: [],
    decoys: [],
    heGrenades: [],
    infernos: [],
  };
  @Input() public playerInfo: any = {};
  @Input() public mapName: string = 'de_dust2';

  public mapViewCfg = {
    mapFile: 'assets/maps/de_dust2.png',
    origin: {
      x: 563.1339320329055,
      y: 736.9535330430065,
    },
    pxPerUX: 0.2278315639654376,
    pxPerUY: -0.22776482548619972,
    imageWidth: 1024,
    imageHeight: 1024,
    low: null,
    high: null,
  };

  constructor(private cdref: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mapName == '' || !(this.mapName in mapCfg)) return;

    if (changes['mapName']) {
      this.mapViewCfg = mapCfg[this.mapName];
      this.cdref.detectChanges();
    }
  }

  ngOnInit(): void {
    //this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  transformX(x, z) {
    let pxPerUX;
    let originX;
    if (this.mapViewCfg.low) {
      pxPerUX = this.mapViewCfg.low.isVisible(z)
        ? this.mapViewCfg.low.pxPerUX
        : this.mapViewCfg.high.pxPerUX;
      originX = this.mapViewCfg.low.isVisible(z)
        ? this.mapViewCfg.low.origin.x
        : this.mapViewCfg.high.origin.x;
    } else {
      pxPerUX = this.mapViewCfg.pxPerUX;
      originX = this.mapViewCfg.origin.x;
    }
    return ((x * pxPerUX + originX) * 100) / 1024;
  }

  transformY(y, z) {
    let pxPerUY;
    let originY;
    if (this.mapViewCfg.low) {
      pxPerUY = this.mapViewCfg.low.isVisible(z)
        ? this.mapViewCfg.low.pxPerUY
        : this.mapViewCfg.high.pxPerUY;
      originY = this.mapViewCfg.low.isVisible(z)
        ? this.mapViewCfg.low.origin.y
        : this.mapViewCfg.high.origin.y;
    } else {
      pxPerUY = this.mapViewCfg.pxPerUY;
      originY = this.mapViewCfg.origin.y;
    }
    return ((y * pxPerUY + originY) * 100) / 1024;
  }

  onClick() {
    console.log(this.gameState);
  }

  @ViewChild('canvas') canvas: ElementRef;

  public ctx;
  public flag = false;
  public prevX = 0;
  public currX = 0;
  public prevY = 0;
  public currY = 0;
  public dot_flag = false;
  public x = 'black';
  public y = 2;

  // init() {
  //     canvas = document.getElementById('can');
  //
  // }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.x;
    this.ctx.lineWidth = this.y;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  erase() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  findxy(res, e) {
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - this.canvas.nativeElement.offsetLeft;
      this.currY = e.clientY - this.canvas.nativeElement.offsetTop;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.x;
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }
    if (res == 'up' || res == 'out') {
      this.flag = false;
    }
    if (res == 'move') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.nativeElement.offsetLeft;
        this.currY = e.clientY - this.canvas.nativeElement.offsetTop;
        this.draw();
      }
    }
  }
}
