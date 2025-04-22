import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-personal-info-reg',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoFocusDirective],
  templateUrl: './personal-info-reg.component.html',
  styleUrls: ['./personal-info-reg.component.css']
})
export class PersonalInfoRegComponent {
  @Input() selectedRole!: string;
  @Output() submitted = new EventEmitter<any>();
  
  isLoading = false;
  formSubmitted = false;
  personalInfoForm: FormGroup;

  currentYear = new Date().getFullYear();

  days: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];
  years: number[] = [];

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  loadingCountries = false;
  loadingStates = false;
  loadingCities = false;

  API_KEY = 'Uyr8TZiAr3cM1HZE9BYDrg==a57nXhZ7PWZYyV1l';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z\s']+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z\s']+$/)]],
      birthDay: ['', Validators.required], 
      birthMonth: ['', Validators.required], 
      birthYear: ['', Validators.required], 
      phone: ['', [Validators.required, Validators.pattern(/^\+(?:[0-9]\x20?){6,14}[0-9]$/)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.loadCountries();

    this.personalInfoForm.get('country')?.valueChanges.subscribe(countryName => {
      if (countryName) {
        this.loadStates(countryName);
        this.states = [];
        this.cities = [];
        this.personalInfoForm.get('state')?.reset();
        this.personalInfoForm.get('city')?.reset();
      }
    });

    this.personalInfoForm.get('state')?.valueChanges.subscribe(stateName => {
      if (stateName && this.personalInfoForm.get('country')?.value) {
        this.loadCities(this.personalInfoForm.get('country')?.value, stateName);
        this.cities = [];
        this.personalInfoForm.get('city')?.reset();
      }
    });
  }

  ngOnInit() {
    this.generateDateOptions();
    this.setupDateValidation();
  }

  private generateDateOptions() {
    // Generate years (1900 - current year)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: currentYear - 1900 + 1}, (_, i) => currentYear - i);
    
    // Initial days (1-31)
    this.days = Array.from({length: 31}, (_, i) => i + 1);
  }

  private setupDateValidation() {
    // Update days when month/year changes
    this.personalInfoForm.get('birthMonth')?.valueChanges.subscribe(() => this.updateDays());
    this.personalInfoForm.get('birthYear')?.valueChanges.subscribe(() => this.updateDays());

    // Custom date validation
    this.personalInfoForm.setValidators([this.validateDate.bind(this)]);
  }

  private updateDays() {
    const month = this.personalInfoForm.get('birthMonth')?.value;
    const year = this.personalInfoForm.get('birthYear')?.value;
    
    if (month && year) {
      const daysInMonth = new Date(year, month, 0).getDate();
      this.days = Array.from({length: daysInMonth}, (_, i) => i + 1);
      
      // Reset day if invalid
      const currentDay = this.personalInfoForm.get('birthDay')?.value;
      if (currentDay > daysInMonth) {
        this.personalInfoForm.get('birthDay')?.reset();
      }
    }
  }

  private validateDate(form: AbstractControl) {
    const day = form.get('birthDay')?.value;
    const month = form.get('birthMonth')?.value;
    const year = form.get('birthYear')?.value;

    if (!day || !month || !year) return null;
    
    const date = new Date(year, month - 1, day);
    const isValid = date.getFullYear() == year && 
                    date.getMonth() + 1 == month && 
                    date.getDate() == day;

    return isValid ? null : { invalidDate: true };
  }

  async loadCountries() {
    this.loadingCountries = true;
    try {
      const response: any = await this.http.get('https://restcountries.com/v3.1/all').toPromise();
      
      this.countries = response
        .map((c: any) => ({
          name: c.name.common,
          code: c.cca2
        }))
        .sort((a: { name: string }, b: { name: string }) => 
          a.name.localeCompare(b.name)
        );
    } catch (error) {
      console.error('Error loading countries:', error);
      this.countries = [];
    } finally {
      this.loadingCountries = false;
    }
  }

  async loadStates(countryName: string) {
    this.loadingStates = true;
    try {
      console.log('Fetching states for:', countryName);
      
      const response = await this.http.post<any>(
        'https://countriesnow.space/api/v0.1/countries/states',
        { country: countryName }
      ).toPromise();

      console.log('States response:', response);
      
      this.states = response?.data?.states?.map((s: any) => ({
        name: s.name,
        code: s.state_code
      })) || [];

    } catch (error) {
      console.error('States error:', error);
      this.states = [];
    } finally {
      this.loadingStates = false;
    }
  }

  async loadCities(countryName: string, stateName: string) {
    this.loadingCities = true;
    try {
      console.log(`Fetching cities for country: ${countryName}, state: ${stateName}`);
  
      const response: any = await this.http.post(
        'https://countriesnow.space/api/v0.1/countries/state/cities',
        { country: countryName, state: stateName }
      ).toPromise();
  
      console.log('Cities API Response:', response);
  
      // Map the array of city strings to objects with 'name' property
      this.cities = response.data?.map((cityName: string) => ({ name: cityName })) || [];
      
    } catch (error) {
      console.error('Error loading cities:', error);
      this.cities = [];
    } finally {
      this.loadingCities = false;
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.personalInfoForm.invalid) return;

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.submitted.emit({
        ...this.personalInfoForm.value,
      });
    }, 1000);
  }
}
