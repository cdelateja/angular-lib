import {AbstractValidator} from './abstractvalidator';
import {Component, ElementRef, Renderer2, RendererFactory2, ViewChild} from '@angular/core';
import {ButtonComponent} from '../components/button/button.component';
import {TranslateService} from '@ngx-translate/core';
import {NotificationPop} from '../components/services/notification.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'ct-query-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the definition form components
    </span>
  `
})
export class Query extends AbstractValidator {

    /**
     * the button in the HTML must have the tag #search
     */
    @ViewChild('search', {static: false})
    protected btnSearch: ButtonComponent;

    /**
     * the button in the HTML must have the tag #searchForm
     */
    @ViewChild('searchForm', {static: false})
    protected btnSearchForm: ButtonComponent;

    /**
     * the button in the HTML must have the tag #clear
     */
    @ViewChild('clear', {static: false})
    protected btnClear: ButtonComponent;

    /**
     * the button in the HTML must have the tag #clear
     */
    @ViewChild('close', {static: false})
    protected btnClose: ElementRef;

    /**
     * the button in the HTML must have the tag #popup
     */
    @ViewChild('popup', {static: false})
    protected display: ElementRef;

    protected renderer: Renderer2;
    private searchSubject = new Subject<any>();


    constructor(protected translate: TranslateService, rendererFactory: RendererFactory2, protected notification: NotificationPop) {
        super(translate);
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    protected init() {
        super.init();
        this.addSearchClickListener();
        this.addCloseClickListener();
        this.addSearchFormClickListener();
        this.addClearClickListener();
    }


    /**
     * adds function to search button
     */
    private addSearchClickListener() {
        if (this.btnSearch !== undefined) {
            this.renderer.listen(this.btnSearch.getElement(), 'click', (event) => {
                this.togglePopUp();
            });
        }
    }

    private addCloseClickListener() {
        if (this.btnClose !== undefined) {
            this.renderer.listen(this.btnClose.nativeElement, 'click', (event) => {
                this.togglePopUp();
            });
        }
    }

    private addSearchFormClickListener() {
        if (this.btnClose !== undefined) {
            this.renderer.listen(this.btnSearchForm.getElement(), 'click', (event) => {
                this.searchForm();
            });
        }
    }

    private addClearClickListener() {
        if (this.btnClose !== undefined) {
            this.renderer.listen(this.btnClear.getElement(), 'click', (event) => {
                this.resetDefault();
            });
        }
    }

    /**
     * function for search buton. Hides or shows de popup
     */
    protected togglePopUp() {
        this.display.nativeElement.classList.toggle('form-popup-show');
    }

    /**
     * functio nfor hiding de popup
     */
    protected hidePopUp() {
        this.display.nativeElement.classList.remove('form-popup-show');
    }

    /**
     *
     * @param eRef
     */
    protected addHideOnClickOutside(eRef: ElementRef) {
        this.renderer.listen('document', 'click', (event) => {
            if (!eRef.nativeElement.contains(event.target)) {
                this.hidePopUp();
            }
        });
    }

    protected searchForm() {
        if (this.validateForm()) {
            this.searchSubject.next(this.formGroup.value);
        }
    }

    protected resetDefault() {
        this.reset(this.formBinder.object);
    }

    /**
     * return the observable of the persist function
     */
    public getSearchObservable(): Observable<any> {
        return this.searchSubject.asObservable();
    }

}
