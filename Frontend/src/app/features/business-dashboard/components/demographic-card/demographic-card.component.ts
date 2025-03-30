import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces defining the structure for age groups, location data, and investment levels.
interface AgeGroup {
  label: string;
  percentage: number;
}

interface LocationData {
  city: string;
  percentage: number;
}

interface InvestmentLevel {
  label: string;
  percentage: number;
  averageInvestment: number;
}

@Component({
  selector: 'app-demographic-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './demographic-card.component.html',
  styleUrls: ['./demographic-card.component.css'],
})
export class DemographicCardComponent {
  // Available filter options for time period.
  timePeriods: string[] = ['Last 6 Months', 'Last Year'];
  // The currently selected time period (default to the first option).
  selectedPeriod: string = this.timePeriods[0];
  // Tracks which gender card is being hovered (if needed for UI effects).
  hoveredGender: 'male' | 'female' | null = null;

  // Demographics data which could be replaced by an API call.
  public demographics = {
    // Gender percentages.
    male: 65,
    female: 35,
    // Age groups breakdown.
    ageGroups: <AgeGroup[]>[
      { label: '18-24', percentage: 15 },
      { label: '25-34', percentage: 40 },
      { label: '35-44', percentage: 25 },
      { label: '45+', percentage: 20 },
    ],
    // Top investor locations (example data).
    topLocations: <LocationData[]>[
      { city: 'New York', percentage: 30 },
      { city: 'London', percentage: 25 },
      { city: 'Tokyo', percentage: 20 },
      { city: 'Berlin', percentage: 15 },
      { city: 'Sydney', percentage: 10 },
    ],
    // Investment levels breakdown.
    investmentLevels: <InvestmentLevel[]>[
      { label: 'Small (<$1K)', percentage: 40, averageInvestment: 750 },
      { label: 'Medium ($1K-$10K)', percentage: 45, averageInvestment: 5500 },
      { label: 'Large (>$10K)', percentage: 15, averageInvestment: 15000 },
    ],
  };

  /**
   * getCountryFromCity
   * Returns the country name corresponding to the provided city.
   * @param city - The city name for which to retrieve the country.
   * @returns A string representing the country.
   */
  getCountryFromCity(city: string): string {
    // Map of cities to their corresponding countries.
    const cityCountryMap: { [key: string]: string } = {
      'New York': 'USA',
      London: 'UK',
      Tokyo: 'Japan',
      Berlin: 'Germany',
      Sydney: 'Australia',
    };
    return cityCountryMap[city] || '';
  }

  /**
   * onTimePeriodChange
   * Called when the user selects a different time period from the filter dropdown.
   * Updates the selected time period and can trigger data refresh.
   * @param period - The newly selected time period.
   */
  onTimePeriodChange(period: string): void {
    this.selectedPeriod = period;
    // TODO: Fetch new demographics data based on the selected period.
    console.log(`Selected period: ${period}`);
  }
}