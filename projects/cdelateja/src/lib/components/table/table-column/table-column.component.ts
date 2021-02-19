import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'ct-table-column',
  templateUrl: './table-column.component.html'
})
export class TableColumnComponent implements OnInit {

  @Input()
  public component: any;

  @ViewChild('columncontainer', {static: false})
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
    const comp = this.entry.createComponent(factory) as any;
    comp.instance.label = 'Algo';
  }

}
