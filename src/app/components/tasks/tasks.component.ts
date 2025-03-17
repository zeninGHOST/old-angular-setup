import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppService } from 'src/app/service/appservice.service';
interface AppFormData {
  appId: string;
  envType: string;
  metrics: {
    fileSystemType: string;
    alertType: string;
    email?: string;
    slack?: string;
    condition: string;
    threshold: number;
    mountPath: string;
  }[];
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  appForm: FormGroup;
  envTypes: string[] = ['dev', 'test', 'prod'];
  fileSystemTypes: string[] = ['ext4', 'xfs', 'nfs'];
  alertTypes: string[] = ['email', 'slack', 'both']; // Added 'both'
  conditions: string[] = ['>', '<', '='];
  loading = false;
  collapsedMetrics: boolean[] = [];

  constructor(private fb: FormBuilder, private appService: AppService) {
    this.appForm = this.fb.group({
      appId: ['', Validators.required],
      envType: ['', Validators.required],
      metrics: this.fb.array([]),
    });
  }
  createMetricFormGroup(): FormGroup {
    return this.fb.group({
      fileSystemType: ['', Validators.required],
      alertType: ['', Validators.required],
      email: [''],
      slack: [''],
      condition: ['', Validators.required],
      threshold: [
        '',
        [Validators.required, Validators.min(1), Validators.max(99)],
      ],
      mountPath: ['', Validators.required],
    });
  }

  addMetric(): void {
    const newMetricGroup = this.createMetricFormGroup();
    this.metricsFormArray.push(newMetricGroup);
    this.collapsedMetrics.push(false);

    newMetricGroup.get('alertType')?.valueChanges.subscribe((value) => {
      this.updateValidators(newMetricGroup, value);
    });

    this.updateValidators(newMetricGroup, newMetricGroup.get('alertType')?.value);
  }

  removeMetric(index: number): void {
    this.metricsFormArray.removeAt(index);
    this.collapsedMetrics.splice(index, 1);
  }

  get metricsFormArray() {
    return this.appForm.get('metrics') as FormArray;
  }

  updateValidators(metricGroup: FormGroup, alertType: string) {
    const emailControl = metricGroup.get('email');
    const slackControl = metricGroup.get('slack');

    if (alertType === 'email') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      slackControl?.setValidators(null);
    } else if (alertType === 'slack') {
      emailControl?.setValidators(null);
      slackControl?.setValidators(Validators.required);
    } else if (alertType === 'both') { // Added 'both' logic
      emailControl?.setValidators([Validators.required, Validators.email]);
      slackControl?.setValidators(Validators.required);
    } else {
      emailControl?.setValidators(null);
      slackControl?.setValidators(null);
    }
    emailControl?.updateValueAndValidity();
    slackControl?.updateValueAndValidity();
  }

  toggleCollapse(index: number): void {
    this.collapsedMetrics[index] = !this.collapsedMetrics[index];
  }

  onSubmit() {
    if (this.appForm.valid) {
      this.loading = true;
      const formData: AppFormData = {...this.appForm.value};

      formData.metrics.forEach((metric) => {
        if (metric.alertType === 'email') {
          delete metric.slack;
        }
      });
      console.log(formData);

      of(formData)
        .pipe(delay(30000))
        .subscribe(
          (response) => {
            console.log('Form submitted successfully:', response);
            this.loading = false;
            window.location.reload();
          },
          (error) => {
            console.error('Error submitting form:', error);
            this.loading = false;
          }
        );
    }
  }
}