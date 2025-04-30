import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoadingService } from './core/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'InvestGo';

  constructor(private router: Router, public loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof ResolveStart || event instanceof NavigationStart) {
        this.loadingService.busy();
      } else if (
        event instanceof ResolveEnd ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.idle();
      }
    });
  }
}
