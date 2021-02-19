import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef, ViewRef} from '@angular/core';

@Component({
  selector: 'ct-body-tab',
  templateUrl: './body-tab.component.html'
})
export class BodyTabComponent implements OnInit {

  @Input()
  public component: any;

  @ViewChild('bodytabcontainer' , {static: false})
  public entry: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.addComponent(this.component);
  }

  addComponent(viewRef: ViewRef) {
    this.entry.insert(viewRef);
  }

}
