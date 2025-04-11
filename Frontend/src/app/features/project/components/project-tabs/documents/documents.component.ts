import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Document } from '../../../interfaces/IDocument';


@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent{
  @Input() documents: Document[] = [
    {
      name: "Business Plan",
      type: "PDF",
      url: "#business-plan",
    },
    {
      name: "Financial Projections",
      type: "Excel",
      url: "#financial-projections",
    },
    {
      name: "Market Research Report",
      type: "PDF",
      url: "#market-research",
    },
    {
      name: "Technical Specifications",
      type: "PDF",
      url: "#technical-specs",
    },
  ];
}