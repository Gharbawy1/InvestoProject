import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js/auto';

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

  ngOnInit(): void {
    this.renderGenderChart();
    this.renderAgeChart();
    this.renderLocationsChart();
  }

  private renderGenderChart() {
    const ctx = document.getElementById('genderChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [this.demographics.male, this.demographics.female],
          backgroundColor: ['#3B82F6', '#EC4899'],
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 16
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  private renderAgeChart() {
    const ctx = document.getElementById('ageChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.demographics.ageGroups.map(g => g.label),
        datasets: [{
          data: this.demographics.ageGroups.map(g => g.percentage),
          backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F97316'],
          barThickness: 20,
          maxBarThickness: 30,
          categoryPercentage: 0.8,
        }],
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { precision: 0 }
          },
          y: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private renderLocationsChart() {
    const ctx = document.getElementById('locationsChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.demographics.topLocations.map(l => l.city),
        datasets: [{
          data: this.demographics.topLocations.map(l => l.percentage),
          backgroundColor: [
            '#3B82F6', 
            '#10B981', 
            '#8B5CF6', 
            '#F97316', 
            '#EF4444'
          ],
          borderWidth: 0,
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: {
              callback: (value) => `${value}%`,
              precision: 0
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              crossAlign: 'far',
              padding: 8
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const city = context.label;
                const country = this.getCountryFromCity(city);
                return `${city}, ${country}: ${context.parsed.x}%`;
              }
            }
          }
        }
      }
    });
  }
  totalPercentage(): number {
    return this.demographics.topLocations.reduce((sum, loc) => sum + loc.percentage, 0);
  }
}