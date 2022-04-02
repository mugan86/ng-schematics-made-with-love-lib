import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'made-with-love',
  template: `
    <ng-template #noUrl>
      {{ name }}
    </ng-template>
    <span [style.font-size.em]="size">
      Made with <span [style.color]="color">♥</span> by
      <ng-container *ngIf="url && url.length > 0; else noUrl">
        <a [attr.href]="url" target="_blank">{{ name }}</a>
      </ng-container>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    span, a {
      font-family: Lato, sans-serif;
    }
    a {
      font-weight: bold;
      color: #000;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MadeWithLoveComponent implements OnInit {
  @Input() public name!: string;
  @Input() public url!: string;
  @Input() public color = 'red';
  @Input() public size = 1;

  ngOnInit() {
    if (!this.name || this.name.length === 0) {
      console.error(`Name attribute must be provided!`);
    }
  }
}