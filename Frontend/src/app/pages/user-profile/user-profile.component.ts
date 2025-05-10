import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoCardComponent } from '../../features/userProfile/components/user-info-card/user-info-card.component';
import { ProfileEditModalComponent } from '../../features/userProfile/components/profile-edit-modal/profile-edit-modal.component';
import { AccountService } from '../../features/userProfile/services/Account.service';
import { invesorUserProfile } from '../../features/userProfile/interfaces/UserProfile';
import { UpdateProfileDto } from '../../features/userProfile/interfaces/UpdateProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { SafeEncoder } from '../../shared/utils/encoding';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, MatIconModule, UserInfoCardComponent, ProfileEditModalComponent, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profile!: invesorUserProfile;
  activeModal: 'edit' | null = null;
  saveStatus: 'loading' | 'error' | 'success' | null = null;
  profileImageError?: string;
  userId: string | null = null;

  isCurrentUser = false;

  displayData: { label: string; value: string }[] = [];

  displayFields = [
    { key: 'userName', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'birthDate', label: 'Birth Date', type: 'date' },
    { key: 'bio', label: 'Bio', public: true },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'address', label: 'Address' },
    { key: 'riskTolerance', label: 'Risk Tolerance', public: true },
    { key: 'investmentGoals', label: 'Investment Goals', public: true },
    { key: 'accreditationStatus', label: 'Accreditation', public: true },
    { key: 'minInvestmentAmount', label: 'Min Investment', type: 'currency', public: true },
    { key: 'maxInvestmentAmount', label: 'Max Investment', type: 'currency', public: true },
    { key: 'netWorth', label: 'Net Worth', type: 'currency', public: true },
    { key: 'annualIncome', label: 'Annual Income', type: 'currency', public: true },
  ];

  editableFields = [
    { key: 'firstName', label: 'First Name', required: true, type: 'text' },
    { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
    { key: 'phoneNumber', label: 'Phone Number', required: true, type: 'tel' },
    { key: 'birthDate', label: 'Birth Date', required: true, type: 'date' },
    { key: 'bio', label: 'Bio', required: false, type: 'text' },
    { key: 'address', label: 'Address', required: true, type: 'text' },
  ];

  personalLabels = [
    'Username', 
    'Email', 
    'First Name', 
    'Last Name', 
    'Birth Date', 
    'Phone Number', 
    'Address',
  ];
  investmentLabels = [
    'Risk Tolerance', 
    'Investment Goals', 
    'Accreditation',
    'Min Investment',
    'Max Investment',
    'Net Worth',
    'Annual Income'
  ];
  constructor(    
    private route: ActivatedRoute,
    private auth: AuthService,
    private account: AccountService,
    private router: Router,
  ) {}

  public encodeId(id: string): string {
    return SafeEncoder.encode(id);
  }
  
  private decodeId(encoded: string): string | null {
    try {
      return SafeEncoder.decode(encoded);
    } catch (e) {
      console.error('Invalid profile ID format:', e);
      return null;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const rawId = params['id'];
      console.log('Received encoded ID:', rawId);

      if (rawId) {
        const decodedId = this.decodeId(rawId);
        
        this.userId = decodedId ?? null;
        if (!this.userId) {
          // Handle invalid ID
          this.router.navigate(['/error']);
          return;
        }
        this.loadOtherProfile();
      } else {
        this.loadCurrentUserProfile();
      }
    });
  }
  
  private loadCurrentUserProfile() {
    this.account.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isCurrentUser = true;
        this.prepareDisplayData();
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }
  
  private loadOtherProfile() {
    if (!this.userId) return;
    
    this.account.getProfileWithID(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.checkIfCurrentUser();
        this.prepareDisplayData();
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.router.navigate(['/error'], {
          state: { message: 'Profile not found' }
        });
      }
    });
  }

  private checkIfCurrentUser() {
    const currentUserId = this.auth.getUserId();
    this.isCurrentUser = this.profile.id === currentUserId;
  }
  
  private prepareDisplayData() {
    const personalKeys = ['userName', 'email', 'firstName', 'lastName', 'birthDate', 'phoneNumber', 'address'];
    const fields = this.displayFields.filter(f => 
      personalKeys.includes(f.key) || 
      this.isCurrentUser || 
      f.public || 
      f.key === 'bio' 
    ).filter(f => this.profile[f.key as keyof invesorUserProfile] != null);

    this.displayData = fields.map(f => ({
      label: f.label,
      value: this.formatValue(f)
    }));
  }

  private formatValue(field: any): string {
    const value = this.profile[field.key as keyof invesorUserProfile];
    
    if (Array.isArray(value)) return value.join(', ');
    
    if (field.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '—';
    }
    
    if (field.type === 'currency') {
      return value ? Number(value).toString() : '—';
    }

      if (field.key === 'bio') {
        return value?.toString()?.trim() || 'No bio available';
      }
    
    return value?.toString() ?? '—';
  }

  profileImageLoading = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.profileImageError = undefined;
    this.profileImageLoading = true;

    if (!file.type.startsWith('image/')) {
      this.profileImageLoading = false;
      this.profileImageError = 'Only image files are allowed';
      return;
    }

    this.account.uploadProfilePicture(file).subscribe({
      next: (updatedProfile) => {
        this.profile = { ...this.profile, ...updatedProfile };
        this.profileImageLoading = false;
      },
      error: (err) => {
        this.profileImageLoading = false;
        this.profileImageError = 'Failed to upload image. Please try again.';
      }
    });
  }

  handleSave(updateData: UpdateProfileDto) {
    this.saveStatus = 'loading';
    this.account.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.saveStatus = 'success';
        this.activeModal = null;
        this.prepareDisplayData();
        
        // Soft reload with fade-out effect
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Wait 1.5 seconds to show success state
      },
      error: () => {
        this.saveStatus = 'error';
      }
    });
  }

  openEdit() { 
    console.log('Edit clicked!'); 
    this.saveStatus = null; 
    this.activeModal = 'edit'; 
  }

  cancelEdit() { this.activeModal = null; }
  
  // Update isProfileComplete method
  isProfileComplete(): boolean {
    return !!this.profile && 
      !!this.profile.firstName &&
      !!this.profile.lastName &&
      !!this.profile.email &&
      !!this.profile.phoneNumber &&
      !!this.profile.birthDate &&
      !!this.profile.address;
  }

  get personalData() {
    return this.displayData.filter(d => 
      this.personalLabels.includes(d.label) && d.label !== 'Bio'
    );
  }

  get investmentData() {
    return this.displayData.filter(d => this.investmentLabels.includes(d.label));
  }

  get hasInvestorData() {
    return this.investmentData.length > 0;
  }

  calculateMembershipDuration(): string {
    const joinDate = new Date(this.profile.registrationDate);
    const diff = new Date().getTime() - joinDate.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return years > 0 ? `${years}+ years` : 'New member';
  }
}