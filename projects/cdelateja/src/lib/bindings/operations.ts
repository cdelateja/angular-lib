import {Component, Renderer2, RendererFactory2, ViewChild} from '@angular/core';
import {TableComponent} from '../components/table/table.component';
import {AbstractValidator} from './abstractvalidator';
import {TranslateService} from '@ngx-translate/core';
import {ButtonComponent} from '../components/button/button.component';
import {Observable, Subject} from 'rxjs';
import {NotificationPop} from '../components/services/notification.service';
import {ConfirmationDialog} from '../components/services/confirmation-dialog.service';


@Component({
  selector: 'ct-operations-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the definition form components
    </span>
  `
})
export class Operations extends AbstractValidator {

    /**
     * The table in the HTML must have the tag #table
     */
    @ViewChild('table', {static: false})
    protected table: TableComponent;

    /**
     * the button in the HTML must have the tag #insert
     */
    @ViewChild('insert', {static: false})
    protected btnInsert: ButtonComponent;

    /**
     * the button in the HTML must have the tag #save
     */
    @ViewChild('save', {static: false})
    protected btnSave: ButtonComponent;

    /**
     * the button in the HTML must have the tag #cancel
     */
    @ViewChild('cancel', {static: false})
    protected btnCancel: ButtonComponent;

    private renderer: Renderer2;
    private persist = new Subject<any>();
    private changeSelection = new Subject<any>();
    private didChange: boolean;

    constructor(protected translate: TranslateService, protected notification: NotificationPop,
                rendererFactory: RendererFactory2, protected confirmationDialog: ConfirmationDialog) {
        super(translate);
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    protected init() {
        super.init();
        this.setFormVisible(false);

        this.addFormListener();
        this.addTableListener();
        this.addInsertClickListener();
        this.addCancelClickListener();
        this.addSaveClickListener();
    }

    /**
     * Sets the data to the table
     * @param data
     */
    protected setData(data: any[]) {
        this.table.setData(data);
    }

    /**
     * Makes the form visible or invisible
     * @param visible
     */
    private setFormVisible(visible: boolean) {
        if (visible) {
            this.formContainer.setAttribute('style', 'display: block');
        } else {
            this.formContainer.setAttribute('style', 'display: none');
        }
    }

    /**
     * adds function to insert button
     */
    private addInsertClickListener() {
        if (this.btnInsert !== undefined) {
            this.renderer.listen(this.btnInsert.getElement(), 'click', (event) => {
                this.insert();
            });
        }
    }

    /**
     * adds function to cancel button
     */
    private addCancelClickListener() {
        if (this.btnCancel !== undefined) {
            this.renderer.listen(this.btnCancel.getElement(), 'click', (event) => {
                this.cancel();
            });
        }
    }

    /**
     * adds function to save button
     */
    private addSaveClickListener() {
        if (this.btnSave !== undefined) {
            this.renderer.listen(this.btnSave.getElement(), 'click', (event) => {
                this.save();
            });
        }
    }

    /**
     * adds function to table changed listener
     */
    public addTableListener() {
        this.table.getSelectedListener().subscribe(e => {
            this.changeSelectedElement(e);
        });
    }

    /**
     * observable for the form in case it changes
     */
    private addFormListener() {
        this.getFormObservable().subscribe(e => {
            this.btnInsert.disabled = true;
            this.table.setSelectedMultiple(null);
        });
    }

    /**
     * function for insert button
     */
    protected insert() {
        this.resetDefault();
        this.setFormVisible(true);
    }

    /**
     * function for cancel button
     */
    protected cancel() {
        if (this.formGroup.untouched) {
            this.resetDefault();
        } else {
            this.confirmationDialog.createConfirmation(this.translate.instant('Core.detectedChanges'),
                this.translate.instant('Core.detectedChangesQuestion'));
            this.confirmationDialog.getYesConfirmation().subscribe(() => {
                this.resetDefault();
            });
        }
    }

    /**
     * function for save button
     */
    protected save() {
        if (this.validateForm()) {
            this.persisteChanges();
        } else {
            this.notification.showError(this.getMessageErrors().join('\n'));
        }
    }

    /**
     * function to put all to deafult values
     */
    protected resetDefault() {
        this.reset(this.formBinder.object);
        this.setFormVisible(false);
        this.table.setSelectedNone();
        this.btnInsert.disabled = false;
        this.table.setSelectedMultiple(false);
    }

    /**
     * function called when the form is valid
     */
    protected persisteChanges() {
        this.persist.next(this.formGroup.value);
    }

    /**
     * return the observable of the persist function
     */
    public getPersistObservable(): Observable<any> {
        return this.persist.asObservable();
    }

    /**
     * function called when the table has been clicked
     * @param element
     */
    protected changeSelectedElement(element: any) {
        this.reset(element !== undefined ? element : this.formBinder.object);
        this.setFormVisible(element !== undefined);
        this.btnInsert.disabled = false;
        this.table.setSelectedMultiple(false);
    }
}
