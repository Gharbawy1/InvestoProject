import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

// Interface representing a document.
interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: Date;
  url: string;
  size?: number;
  reviewStatus: 'approved' | 'pending' | 'rejected';
}

@Component({
  selector: 'app-document-center',
  imports: [CommonModule, MatMenuModule, FormsModule],
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.css'],
})
export class DocumentCenterComponent {
  // Flag to indicate if a file is being dragged over the drop zone.
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
      reviewStatus: 'pending',
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

  /**
   * Getter to return the number of verified (approved) documents.
   */
  get verifiedCount(): number {
    return this.documents.filter((doc) => doc.reviewStatus === 'approved').length;
  }

  /**
   * onUploadDocument
   * Called when a user selects new files via the file input.
   * @param event - The file input change event.
   */
  onUploadDocument(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Uploading documents:', files);
      // Process files or send them to a file upload service.
    }
  }

  /**
   * handleFileDrop
   * Handles files dropped onto the upload drop zone.
   * @param event - The drag event.
   */
  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  /**
   * handleDragOver
   * Called when a file is dragged over the drop zone to update UI state.
   * @param event - The drag event.
   */
  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  /**
   * handleFiles
   * Processes each file dropped into the drop zone.
   * @param files - The FileList object.
   */
  private handleFiles(files: FileList): void {
    console.log('Files to process:', files);
    Array.from(files).forEach((file) => {
      console.log('Processing file:', file.name);
      // Implement file upload/processing logic here.
    });
  }

  /**
   * handleDragLeave
   * Called when a dragged file leaves the drop zone; resets the drag state.
   * @param event - The drag event.
   */
  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  /**
   * viewDocument
   * Initiates a document preview action.
   * @param doc - The document to preview.
   */
  viewDocument(doc: Document): void {
    console.log('Viewing document:', doc);
    // Open a preview modal or navigate to a document preview page.
  }

  /**
   * downloadDocument
   * Initiates a document download action.
   * @param doc - The document to download.
   */
  downloadDocument(doc: Document): void {
    console.log('Downloading document:', doc);
    // Implement file download logic.
  }

  /**
   * deleteDocument
   * Deletes a document from the list.
   * @param doc - The document to delete.
   */
  deleteDocument(doc: Document): void {
    console.log('Deleting document:', doc);
    // Implement deletion logic, then remove the document from the array.
  }

  /**
   * Getter to return the list of documents filtered by search query and sorted based on the selected criteria.
   */
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
  }
}