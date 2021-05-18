import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef} from '@angular/core';
import {ModalService} from '../services/modal.service';

@Component({
  selector: 'ct-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

  @Input()
  public title: string;

  @ViewChild('modalcontainer', {static: false})
  public entry: ViewContainerRef;

  public show = false;

  constructor(private resolver: ComponentFactoryResolver, private modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.modalService.getCloseCall().subscribe(() => {
      this.close();
    });
  }

  private addComponent(component: any): ComponentRef<any>  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(component);
    return this.entry.createComponent(factory);
  }

  public close(): void {
    this.show = false;
    document.body.className = '';
  }

  public showModal(component: any): any {
    this.show = true;
    document.body.className = 'modal-open';
    const componentRef = this.addComponent(component);
    return componentRef.instance;
  }

}
