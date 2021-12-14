import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private renderer2:Renderer2){}

  //----------------------Show $ Hide cart----------------------
  @ViewChild("cartOverlay") cartOverlay!: ElementRef;
  @ViewChild("cartDom") cartDom!: ElementRef;
            ShowCart(){
              const cartOverlay = this.cartOverlay.nativeElement;
              this.renderer2.addClass(cartOverlay,"transparentBcg");
              const cartDom = this.cartDom.nativeElement;
              this.renderer2.addClass(cartDom,"showCart");
            }
            HideCart(){
              const cartOverlay = this.cartOverlay.nativeElement;
              this.renderer2.removeClass(cartOverlay,"transparentBcg");
              const cartDom = this.cartDom.nativeElement;
              this.renderer2.removeClass(cartDom,"showCart");
            }
}
