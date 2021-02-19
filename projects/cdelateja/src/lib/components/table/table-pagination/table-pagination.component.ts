import {Component, Input, OnInit} from '@angular/core';
import {TableComponent} from '../table.component';
import {Observable, Subject} from 'rxjs';

@Component({
    selector: 'ct-table-pagination',
    templateUrl: './table-pagination.component.html'
})
export class TablePaginationComponent implements OnInit {

    @Input()
    public tableComponent: TableComponent;

    @Input()
    public pageSize: number;

    @Input()
    public elPerPage: number;

    public position = 0;
    public enabledNextButton = true;
    private data: any[] = [];
    public numberButtons: any[] = [];
    private nextElements = new Subject<number>();
    private dataPerPage = new Map<number, any[]>();

    constructor() {
    }

    ngOnInit() {
        if (this.tableComponent !== undefined) {
            this.tableComponent.dataHandledByPagination = true;
            this.setValuesButtons();
            this.tableComponent.getObservableData().subscribe(data => {
                this.data = data;
                this.setElementsByElPerPage();
            });
        }
    }

    public getNextElementObservable(): Observable<number> {
        return this.nextElements.asObservable();
    }

    private setElementsByElPerPage() {
        this.dataPerPage = new Map<number, any[]>();
        this.enabledNextButton = this.data.length === (this.pageSize * this.elPerPage);
        this.numberButtons.forEach(button => {
            const elSelected = button.number - (this.pageSize * this.position);
            const items = this.data.slice(this.elPerPage * (elSelected - 1), this.elPerPage * elSelected);
            button.enable = items.length > 0;
            this.dataPerPage.set(elSelected, items);
        });
        this.viewDataPosition(this.numberButtons[0].number);
    }

    public back() {
        const elements = this.elPerPage * this.pageSize;
        this.position = this.position - 1;
        const maxOffset = elements * this.position;
        this.nextElements.next(maxOffset);
        this.setValuesButtons();
    }

    public next() {
        const elements = this.elPerPage * this.pageSize;
        this.position = this.position + 1;
        const maxOffset = elements * this.position;
        this.nextElements.next(maxOffset);
        this.setValuesButtons();
    }

    public viewDataPosition(elSelected: number) {
        if (elSelected !== 1) {
            elSelected = elSelected - (this.pageSize * this.position);
        }
        // const items = this.data.slice(this.elPerPage * (elSelected - 1), this.elPerPage * elSelected);
        this.tableComponent.setDataByPagination(this.dataPerPage.get(elSelected));
    }

    public setValuesButtons() {
        this.numberButtons = [];
        for (let x = 1; x <= this.pageSize; x++) {
            // this.numberButtons.push(x + (this.pageSize * (this.position)));
            this.numberButtons.push({
                number: x + (this.pageSize * (this.position)),
                enable: true
            });
        }
    }

}
