import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'ct-body-collapse',
  templateUrl: './body-collapse.component.html'
})
export class BodyCollapseComponent implements OnInit {

  @Input()
  public component: any;

  @ViewChild('bodytabcontainer', {static: false})
  public entry: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (this.component !== null) {
      this.addComponent(this.component);
    }
  }

  addComponent(component: any) {
    const factory = this.resolver.resolveComponentFactory(component);
    this.entry.clear();
    this.entry.createComponent(factory);
  }

}
