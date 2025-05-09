import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { BusinessDocuments, BusinessDocumentDetails } from '../../../interfaces/BusinessDocuments';
import { DocumentViewService } from '../../../services/documents-view/documents-view.service';
import { ProjectContextService } from '../../../services/project-context/project-context.service';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinner,
    FormsModule,
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  documents: BusinessDocumentDetails[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private documentViewService: DocumentViewService,
    private projectCtx: ProjectContextService
  ) {}

  ngOnInit() {
    this.projectCtx.project$
      .pipe(
        filter(p => !!p?.id),
        take(1),
        switchMap(p => this.documentViewService.getDocuments(p!.id!))
      )
      .subscribe({
        next: response => {
          this.documents = this.transformDocuments(response);
          this.loading = false;
        },
        error: err => {
          this.error = err.message || 'Failed to load documents';
          this.loading = false;
        }
      });
  }

  private transformDocuments(response: BusinessDocuments): BusinessDocumentDetails[] {
    return [
      { 
        title: 'Articles of Association',
        url: response.articlesOfAssociationUrl,
        type: this.getFileType(response.articlesOfAssociationUrl)
      },
      {
        title: 'Commercial Registry Certificate',
        url: response.commercialRegistryCertificateUrl,
        type: this.getFileType(response.commercialRegistryCertificateUrl)
      },
      {
        title: 'Tax Card',
        url: response.textCardUrl,
        type: this.getFileType(response.textCardUrl)
      }
    ].filter(doc => this.isValidUrl(doc.url));
  }

  private isValidUrl(url: string): boolean {
    return !!url?.trim() && url.trim() !== '';
  }

  private getFileType(url: string): string {
    const extension = url.split(/[#?]/)[0].split('.').pop()?.toLowerCase() || 'file';
    
    const fileTypes = {
      documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      archives: ['zip', 'rar', '7z']
    };
  
    if (fileTypes.documents.includes(extension)) return 'document';
    if (fileTypes.images.includes(extension)) return 'image';
    if (fileTypes.archives.includes(extension)) return 'archive';
    
    return 'file'; // default
  }

  getFileIcon(fileType: string): string {
    const iconMap: Record<string, string> = {
      pdf: 'picture_as_pdf',
      doc: 'description',
      docx: 'description',
      default: 'insert_drive_file',
      image: 'image',
      archive: 'archive'
    };
    return iconMap[fileType.toLowerCase()] || iconMap['default'];
  }

  previewDocument(doc: BusinessDocumentDetails) {
    window.open(doc.url, '_blank', 'noopener,noreferrer');
  }
}
