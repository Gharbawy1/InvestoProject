import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { IComment } from '../../interfaces/IComment';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-tabs',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './project-tabs.component.html',
  styleUrl: './project-tabs.component.css',
})
export class ProjectTabsComponent {
  @Input() activeTab!: string;
  @Input() projectData: any;
  @Output() tabChange = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {}

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'business-info', label: 'Business' },
    { id: 'documents', label: 'Documents' },
    { id: 'updates', label: 'Updates' },
    { id: 'discussion', label: 'Discussion' },
    { id: 'offer', label: 'Offer' },
  ];

  ngOnInit() {
    this.route.firstChild?.url.subscribe((url) => {
      if (url.length) {
        this.activeTab = url[0].path;
      }
    });
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }
}
