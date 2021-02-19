import {ApplicationRef, Component, ComponentFactoryResolver, EmbeddedViewRef, Injector, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'ct-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  @Input()
  public headers: string[] = [];

  @Input()
  public propertyPrefix = '';

  @Input()
  public data: any[] = [];

  @Input()
  public isScroll: Boolean = false;

  @Input()
  public elLimit: number;

  /**
   * Use to validate if an object is equals to other object
   */
  @Input()
  public eqVal: string;

  private selectedData: any[] = [];
  private sortDirection = '';
  private pushData = new Subject<any[]>();
  private nextElements = new Subject<number>();
  private selectedElements = new Subject<any>();
  private scrollCount = 1;
  private isGettingData: Boolean = false;

  public isSelectMultiple: Boolean = false;
  public extraColumns: ColumnAdd[] = [];
  public extraHeaders: string[] = [];
  public dataHandledByPagination: Boolean = false;

  constructor() {
  }

  // constructor(private componentFactoryResolver: ComponentFactoryResolver,
  //             private appRef: ApplicationRef, private injector: Injector) {
  // }

  // public appendComponentToBody(component: any) {
  //   // 1. Create a component reference from the component
  //   const componentRef = this.componentFactoryResolver
  //     .resolveComponentFactory(component)
  //     .create(this.injector);
  //
  //   // 2. Attach component to the appRef so that it's inside the ng component tree
  //   this.appRef.attachView(componentRef.hostView);
  //
  //   // 3. Get DOM element from component
  //   const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  //
  //   // 4. Append DOM element to the body
  //   document.body.appendChild(domElem);
  // }

  ngOnInit() {
  }

  public addColumnComponent(component: any, header: string) {
    this.extraHeaders.push(header);
    this.extraColumns.push(new ColumnAdd('', component));
  }

  /**
   * Sets the data received by any service
   * @param data
   */
  public setData(data: any[]) {
    if (this.dataHandledByPagination) {
      this.pushData.next(data);
      // this.selectedData = [];
    } else {
      if (this.isScroll) {
        data.forEach(e => this.data.push(e));
        this.isGettingData = false;
      } else {
        this.data = data;
      }
    }
  }

  /**
   * Method used by the pagination component
   * @param data
   */
  public setDataByPagination(data: any[]) {
    this.data = data;
  }

  /**
   * Returns observable of pushData, this is used by the pagination component
   */
  public getObservableData(): Observable<any[]> {
    return this.pushData.asObservable();
  }

  /**
   * returns observable of selectedElements, this obsverbale is fired when a user click an element
   */
  public getSelectedListener(): Observable<any> {
    return this.selectedElements.asObservable();
  }

  /**
   * this function defines the behavior when a user click a row
   * @param event
   * @param item
   */
  public selectRow(event, item: any) {
    if (this.isSelectMultiple !== null) {
      if (this.isSelectMultiple) {
        this.multipleBehavior(item);
      } else {
        this.singleBehavior(item);
      }
    }
  }

  /**
   * this function sorts the column selected
   * @param header
   */
  public sort(header: string) {
    this.data = this.getDataSort(header);
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  /**
   * return the list sorted
   * @param header
   */
  private getDataSort(header: string): any[] {
    return this.data.sort((a, b) => {
      if (this.sortDirection === 'desc') {
        return a[header] < b[header] ? -1 : 1;
      } else {
        return a[header] > b[header] ? -1 : 1;
      }
    });
  }

  /**
   * function that defines the behavior when de user scroll the table
   * @param $event
   */
  public onScroll($event: Event) {
    // const scrollOffset = $event.srcElement.scrollTop;
    // const scrollHeight = $event.srcElement.scrollHeight;
    // const percentageScroll = (scrollOffset * 100) / scrollHeight;
    // if (percentageScroll > 75) {
    //   if (!this.isGettingData) {
    //     this.nextElements.next(this.elLimit * this.scrollCount);
    //     this.scrollCount++;
    //     this.isGettingData = true;
    //   }
    // }
  }

  /**
   * defines the behavior when the user can select any elements
   * @param target
   * @param item
   */
  private multipleBehavior(item) {
    const idx = this.selectedData.indexOf(item);
    if (idx !== -1) {
      this.selectedData.splice(idx, 1);
    } else {
      this.selectedData.push(item);
    }
    this.selectedElements.next(this.selectedData);
  }

  /**
   * defines the behavior when the user can only select one element
   * @param target
   * @param item
   */
  private singleBehavior(item) {
    if (this.ifSelected(item)) {
      item = undefined;
      this.selectedData = [];
    } else {
      this.selectedData[0] = item;
    }
    this.selectedElements.next(item);
  }

  /**
   * this function is used when de table has a scroll behavior
   */
  public getNextElementObservable(): Observable<number> {
    return this.nextElements.asObservable();
  }

  public ifSelected(item: any): boolean {
    let selected = false;
    this.selectedData.forEach(e => {
      if (e[this.eqVal] === item[this.eqVal]) {
        selected = true;
      }
    });
    return selected;
  }

  /**
   * Removes all selected rows
   */
  public setSelectedNone() {
    this.selectedData = [];
  }

  /**
   * set the value of isSelectMultiple (null for none selection)
   * @param val
   */
  public setSelectedMultiple(val: boolean) {
    this.isSelectMultiple = val;
  }

  /**
   * returns selected items
   */
  public getSelectedItems(): any {
    if (this.isSelectMultiple) {
      return this.selectedData;
    } else {
      return this.selectedData[0];
    }
  }
}

class ColumnAdd {
  public header: string;
  public component: any;

  constructor(header: string, component?: any) {
    this.component = component;
    this.header = header;
  }
}
