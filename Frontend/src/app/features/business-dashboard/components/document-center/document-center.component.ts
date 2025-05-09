import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessDocuments, BusinessDocumentDetails } from '../../../project/interfaces/BusinessDocuments';
import { DocumentViewService } from '../../../project/services/documents-view/documents-view.service';
import { take } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-document-center',
  imports: [
    CommonModule,
    MatMenuModule, 
    FormsModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.css'],
})
export class DocumentCenterComponent {
  @Input() projectId!: number;
  documents: BusinessDocumentDetails[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private documentViewService: DocumentViewService,
  ) {}

  ngOnInit() {
    this.documentViewService.getDocuments(this.projectId)
      .pipe(
        take(1),
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










  /*// Flag to indicate if a file is being dragged over the drop zone.
  isDragging = false;

  // Sample documents; in production, these should be loaded dynamically from an API.
  documents: Document[] = [
    {
      id: 1,
      name: 'Business Registration Certificate',
      type: 'PDF',
      uploadDate: new Date(),
      url: '#',
      size: 2.4,
      reviewStatus: 'approved',
    },
    {
      id: 2,
      name: 'Owner Identification',
      type: 'JPG',
      uploadDate: new Date(),
      url: '#',
      size: 1.8,
      reviewStatus: 'Pending',
    },
    {
      id: 3,
      name: 'Financial Statements Q1',
      type: 'PDF',
      uploadDate: new Date(),
      url: '#',
      size: 4.2,
      reviewStatus: 'approved',
    },
  ];

  // Filtering and sorting controls.
  searchQuery: string = '';
  sortBy: string = 'uploadDate'; // Default sorting by upload date.


  get verifiedCount(): number {
    return this.documents.filter((doc) => doc.reviewStatus === 'approved').length;
  }

 
  onUploadDocument(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Uploading documents:', files);
      // Process files or send them to a file upload service.
    }
  }


  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  private handleFiles(files: FileList): void {
    console.log('Files to process:', files);
    Array.from(files).forEach((file) => {
      console.log('Processing file:', file.name);
      // Implement file upload/processing logic here.
    });
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }


  viewDocument(doc: Document): void {
    console.log('Viewing document:', doc);
    // Open a preview modal or navigate to a document preview page.
  }

  downloadDocument(doc: Document): void {
    console.log('Downloading document:', doc);
    // Implement file download logic.
  }


  deleteDocument(doc: Document): void {
    console.log('Deleting document:', doc);
    // Implement deletion logic, then remove the document from the array.
  }

  get filteredDocuments(): Document[] {
    const query = this.searchQuery.toLowerCase();
    return this.documents
      .filter((doc) => doc.name.toLowerCase().includes(query))
      .sort((a, b) => {
        if (this.sortBy === 'uploadDate') {
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        }
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }*/
}