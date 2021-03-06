import {Component, ElementRef, forwardRef, OnInit} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractComponent} from '../definition.components';
import {TranslateService} from '@ngx-translate/core';
import {ClientService} from '../../services/client.service';
import {Progress} from '../../dtos/definition-class';

@Component({
  selector: 'ct-upload',
  templateUrl: './upload.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UploadComponent),
    multi: true
  }]
})
export class UploadComponent extends AbstractComponent implements OnInit {

  public uploadResponse = {status: '', message: '', filePath: ''};
  public error: string;
  public file: any;
  public progress: any;

  constructor(elRef: ElementRef, protected translate: TranslateService, protected controlContainer: ControlContainer,
              private http: ClientService) {
    super(elRef, translate, controlContainer);
  }

  public ngOnInit(): void {
    super.init();
  }

  public writeValue(value: any): void {
    if (value == null) {
      this.progress = 0;
      this.value = 'Choose file';
    }
  }

  public onSelectedFile(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.progress = 0;
    }
  }

  public upload(): void {
    const formData = new FormData();
    formData.append('file', this.file);
  }

}
