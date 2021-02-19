import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver, ComponentRef, EmbeddedViewRef,
  Injector,
  OnInit,
  QueryList,
  ViewChildren, ViewRef
} from '@angular/core';
import {BodyTabComponent} from './body-tab/body-tab.component';

@Component({
  selector: 'ct-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent implements OnInit {

  public components: TabAdd[] = [];
  public tabSelected: string;

  @ViewChildren(BodyTabComponent)
  public bodyList: QueryList<BodyTabComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef, private injector: Injector) {
  }

  public getHTMLFromComponent(component: any): ComponentRef<any> {
    // 1. Create a component reference from the component
    return this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
  }

  ngOnInit() {
  }

  public onTabSelected(tabSelected: string) {
    this.tabSelected = tabSelected;
  }

  /**
   * After it attaches the component view to the tab, return the instance of the component
   * @param title
   * @param component
   */
  public addTab(title: string, component: any): any {
    const componentRef: ComponentRef<any> = this.getHTMLFromComponent(component);
    this.components.push(new TabAdd(componentRef.hostView, title));
    this.onTabSelected(this.components[0].title);
    return componentRef.instance;
  }

}

class TabAdd {
  public component: ViewRef;
  public title: string;

  constructor(component: ViewRef, title: string) {
    this.component = component;
    this.title = title;
  }
}
