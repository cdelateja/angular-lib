import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ct-collapse',
  templateUrl: './collapse.component.html'
})
export class CollapseComponent implements OnInit {

  public components: CollapseAdd[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  public toggle(item) {
    item.show = !item.show;
  }

  public addComponent(title: string, component: any) {
    this.components.push(new CollapseAdd(title, component));
    this.components[0].show = true;
  }

  public addText(title: string, text: string) {
    this.components.push(new CollapseAdd(title, null, text));
    this.components[0].show = true;
  }

}

class CollapseAdd {
  public title: string;
  public component: any;
  public text: string;
  public show = false;

  constructor(title: string, component?: any, text?: string) {
    this.component = component;
    this.title = title;
    this.text = text;
  }

}
