import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoCardComponent } from '../../features/userProfile/components/user-info-card/user-info-card.component';
import { ProfileEditModalComponent } from '../../features/userProfile/components/profile-edit-modal/profile-edit-modal.component';
import { AccountService } from '../../features/userProfile/services/Account.service';
import { UserProfile } from '../../features/userProfile/interfaces/UserProfile';
import { UpdateProfileDto } from '../../features/userProfile/interfaces/UpdateProfile';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, MatIconModule, UserInfoCardComponent, ProfileEditModalComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profile!: UserProfile;
  activeModal: 'edit'|null = null;
  saveStatus: 'loading'|'error'|'success'|null = null;
  profileImageError?: string;

  constructor(private account: AccountService) {}

  displayData: { label:string; value:string }[] = [];

  displayFields = [
    { key: 'userName',         label: 'Username' },
    { key: 'email',            label: 'Email' },
    { key: 'registrationDate', label: 'Member Since', type: 'date' },
    { key: 'roles',            label: 'Roles' },
    { key: 'nationalID',       label: 'National ID' },
    { key: 'firstName',        label: 'First Name' },
    { key: 'lastName',         label: 'Last Name' },
    { key: 'birthDate',        label: 'Birth Date', type: 'date' },
    { key: 'bio',              label: 'Bio' },
    { key: 'phoneNumber',      label: 'Phone Number' },
    { key: 'address',          label: 'Address' },
  ];

  editableFields = [
    { key: 'firstName', label: 'First Name', required: true, type: 'text' },
    { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
    { key: 'phoneNumber', label: 'Phone Number', required: true, type: 'tel' },
    { key: 'birthDate', label: 'Birth Date', required: true, type: 'date' },
    { key: 'bio', label: 'Bio', required: false, type: 'text' },
    { key: 'address', label: 'Address', required: true, type: 'text' },
  ];
  
  
  ngOnInit() {
    this.loadProfile();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.profileImageError = 'Please select an image file';
      return;
    }

    this.profileImageError = undefined;
    this.account.uploadProfilePicture(file).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
      },
      error: (err) => {
        this.profileImageError = 'Failed to upload image. Please try again.';
      }
    });
  }

  private loadProfile() {
    this.account.getProfile().subscribe(p => {
      this.profile = p;
      this.displayData = this.displayFields.map(f => ({
        label: f.label,
        value: this.formatValue(f)
      }));
    });
  }

  private formatValue(f: any) {
    const v = (this.profile as any)[f.key];
    if (Array.isArray(v)) return v.join(', ');
    if (f.type === 'date') return new Date(v).toLocaleDateString();
    if (f.type === 'image') return v as string;
    return v ?? '—';
  }
  
  handleSave(dto: UpdateProfileDto) {
    this.saveStatus = 'loading';
    this.account.updateProfile(dto).subscribe({
      next: updatedProfile => {
        this.profile = updatedProfile;
        this.saveStatus = 'success';
        this.activeModal = null;
        this.loadProfile();    
      },
      error: () => this.saveStatus = 'error'
    });
  }  

  openEdit() {
    this.activeModal = 'edit';
  }

  cancelEdit() {
    this.activeModal = null;
  }
  
  isProfileComplete(): boolean {
    if (!this.profile) return false;
  
    const requiredFields: (keyof UserProfile)[] = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'birthDate',
      'nationalID',
      'address'
    ];
  
    return requiredFields.every(field => {
      const value = this.profile[field];
  
      // Arrays (none in this list) would be handled here:
      if (Array.isArray(value)) {
        return value.length > 0;
      }
  
      // Special handling for the date‐string:
      if (field === 'birthDate') {
        // non‐empty string that parses to a valid date
        return typeof value === 'string'
            && value.trim() !== ''
            && !isNaN(new Date(value).getTime());
      }
  
      // For all other (string) fields:
      return value !== null && value !== undefined && value !== '';
    });
  }  
}
