import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy() {
    this.loadingRequestCount++;
    if (this.loadingRequestCount === 1) {
      this.spinnerService.show(undefined, {
        type: 'ball-scale-ripple',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        size: 'default',
      });
    }
  }

  idle() {
    this.loadingRequestCount--;
    if (this.loadingRequestCount <= 0) {
      this.loadingRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
