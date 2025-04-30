import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { IDocument } from '../../../interfaces/IDocument';
import { DocumentViewService } from '../../../services/documents-view/documents-view.service';
import { HttpClientModule } from '@angular/common/http';
import { ProjectContextService } from '../../../services/project-context.service';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinner,
    FormsModule
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: IDocument[] = [];
  loading = true;
  error: string | null = null;

  currentUserId: string = '';

  constructor(
    private documentViewService: DocumentViewService,
    private projectCtx: ProjectContextService
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.projectCtx.project$.pipe(
      filter(p => p !== null),
      take(1),
      switchMap(project => {
        this.currentUserId = project!.ownerId;
        return this.documentViewService.getDocumentsByUser(project!.ownerId);
      })
    ).subscribe({
      next: docs => {
        this.documents = docs;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load documents. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  getFileIcon(fileType: string): string {
    const iconMap: { [key: string]: string } = {
      'pdf': 'picture_as_pdf',
      'docx': 'description',
      'default': 'insert_drive_file'
    };
    return iconMap[fileType.toLowerCase()] || iconMap['default'];
  }

  downloadDocument(doc: IDocument) {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.title;
    link.click();
  }
  
  previewDocument(doc: IDocument) {
    window.open(doc.url, '');
  }
}