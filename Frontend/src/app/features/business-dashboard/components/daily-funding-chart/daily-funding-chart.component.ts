import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions, ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-daily-funding-chart',
  imports: [ CommonModule, NgApexchartsModule ],
  templateUrl: './daily-funding-chart.component.html',
  styleUrls: ['./daily-funding-chart.component.css']
})
export class DailyFundingChartComponent implements OnInit {
  // Current month name (e.g., "March").
  public currentMonth: string = '';
  // The last day of the current month.
  public lastDayOfMonth!: Date;
  // Funding goal amount.
  public fundingGoal = 8000;
  // Percentage progress towards the funding goal.
  public progressPercentage = 0;
  // Total days in the current month.
  public daysInMonth!: number;
  // Today's day of the month.
  public currentDay!: number;
  // Flag indicating if funding progress is on track.
  public isOnTrack = false;
  // Daily funding target needed to reach the goal.
  public dailyTarget = 0;
  // Number of days remaining in the month.
  public daysRemaining = 0;
  // Text representing the funding trend status.
  public trendStatus = '';

  // ApexCharts options for configuring the chart.
  public chartOptions: ApexOptions;

  /**
   * Constructor initializes the chart options.
   * Chart configuration is created by calling createChartOptions().
   */
  constructor() {
    this.chartOptions = this.createChartOptions();
  }
  
  /**
   * createChartOptions
   * Constructs and returns the ApexOptions object with the desired chart configuration.
   */
  private createChartOptions(): ApexOptions {
    return {
      // Initial series setup with an empty data array.
      series: [{
        name: 'Funding Progress',
        type: 'area',
        data: []
      }],
      // General chart settings.
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        animations: { 
          enabled: true,
          speed: 800,
          animateGradually: { enabled: true, delay: 150 }
        },
        fontFamily: 'Inter, sans-serif',
        foreColor: '#4b5563',
        events: {
          // Resize handler for responsiveness.
          mounted: (chart) => {
            chart.windowResizeHandler();
          }
        }
      },
      // X-axis configuration.
      xaxis: {
        type: 'category',
        categories: [], // Will be updated with day numbers.
        labels: { 
          style: { 
            fontSize: '12px',
            colors: '#6b7280'
          },
          formatter: (value) => value ? `Day ${value}` : ''
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      // Y-axis configuration.
      yaxis: {
        labels: {
          formatter: (val: number) => `$${Math.round(val).toLocaleString()}`,
          style: { 
            fontSize: '12px',
            colors: '#6b7280'
          }
        },
        min: 0,
        forceNiceScale: true
      },
      // Stroke settings for the area chart line.
      stroke: {
        width: 3,
        curve: 'smooth',
        lineCap: 'round'
      },
      // Grid styling.
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 4,
        padding: { top: 20, bottom: 10 }
      },
      // Tooltip configuration with custom HTML content.
      tooltip: {
        enabled: true,
        style: { 
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          const value = series[seriesIndex][dataPointIndex];
          const remaining = this.fundingGoal - value;
          const percentage = (value / this.fundingGoal * 100).toFixed(1);
          return `
            <div class="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
              <div class="text-sm text-gray-500 mb-1">Day ${dataPointIndex + 1}</div>
              <div class="font-semibold text-blue-600 text-lg">$${value.toLocaleString()}</div>
              <div class="text-sm ${remaining > 0 ? 'text-red-600' : 'text-green-600'}">
                ${remaining > 0 ? `$${remaining.toLocaleString()} to go` : `$${Math.abs(remaining).toLocaleString()} over`}
              </div>
              <div class="text-gray-500 text-xs mt-1">${percentage}% of goal</div>
            </div>
          `;
        }
      },
      // Gradient fill for the area under the chart line.
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.3,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      // Marker settings for data points.
      markers: {
        size: 5,
        colors: ['#3b82f6'],
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: { size: 7 }
      },
      // Primary color for the chart.
      colors: ['#3b82f6'],
      // Annotation to display the funding goal as a horizontal line.
      annotations: {
        yaxis: [{
          y: this.fundingGoal,
          borderColor: '#10b981',
          strokeDashArray: 6,
          label: {
            borderColor: '#10b981',
            style: {
              color: '#fff',
              background: '#10b981',
              fontSize: '12px',
              padding: { left: 8, right: 8, top: 2, bottom: 2 }
            },
            text: `GOAL: $${this.fundingGoal.toLocaleString()}`
          }
        }]
      }
    };
  }

  /**
   * ngOnInit
   * Initializes dates, generates chart data, and calculates the funding progress trend.
   */
  ngOnInit(): void {
    this.initializeDates();
    this.generateChartData();
    this.calculateProgressTrend();
  }

  /**
   * initializeDates
   * Sets up the current month, last day of the month, days in month, current day, and days remaining.
   */
  private initializeDates(): void {
    const date = new Date();
    // Get the full month name.
    this.currentMonth = date.toLocaleString('default', { month: 'long' });
    // Determine the last day of the current month.
    this.lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // Total days in the month.
    this.daysInMonth = this.lastDayOfMonth.getDate();
    // Today's date.
    this.currentDay = date.getDate();
    // Remaining days in the month.
    this.daysRemaining = this.daysInMonth - this.currentDay;
  }

  /**
   * generateChartData
   * Creates simulated daily funding data for the chart and updates chart options.
   */
  private generateChartData(): void {
    const data = [];
    let currentAmount = 0;
    
    // Generate funding data for each day of the month.
    for (let day = 1; day <= this.daysInMonth; day++) {
      // Base amount increases with each day.
      const base = 50 + day * 10;
      // Random component to simulate variability.
      const random = Math.random() * (day * 2);
      currentAmount += Math.round(base + random);
      data.push(currentAmount);
    }

    // Calculate overall progress percentage towards the funding goal.
    this.progressPercentage = Math.round((currentAmount / this.fundingGoal) * 100);
    
    // Update chart options with generated data and dynamic categories for the x-axis.
    this.chartOptions = {
      ...this.chartOptions,
      xaxis: {
        ...this.chartOptions.xaxis!,
        categories: Array.from({ length: this.daysInMonth }, (_, i) => (i + 1).toString())
      },
      series: [{
        ...(this.chartOptions.series![0] as ApexAxisChartSeries[0]),
        data: data
      }]
    };
  }

  /**
   * calculateProgressTrend
   * Compares actual funding progress with the expected progress to determine if funding is on track.
   * Also calculates the required daily target and sets the trend status message.
   */
  private calculateProgressTrend(): void {
    // Expected funding amount based on day of month.
    const expected = (this.fundingGoal / this.daysInMonth) * this.currentDay;
    // Actual funding amount on the current day from chart data.
    const actual = (this.chartOptions.series![0] as { data: number[] }).data[this.currentDay - 1];
    // Determine if the funding progress is on track.
    this.isOnTrack = actual >= expected;
    // Calculate the daily funding target needed to meet the goal.
    this.dailyTarget = Math.ceil((this.fundingGoal - actual) / this.daysRemaining);
    
    // Set the trend status message based on progress.
    if (this.isOnTrack) {
      this.trendStatus = `On track to exceed goal by $${Math.round(actual - expected).toLocaleString()}`;
    } else {
      this.trendStatus = `Needs $${Math.round(expected - actual).toLocaleString()} more to stay on track`;
    }
  }

  // Responsive settings for the chart at different breakpoints.
  public responsive = [{
    breakpoint: 640,
    options: {
      chart: { height: 280 },
      yaxis: { 
        labels: { 
          formatter: (val: number) => `$${Math.round(val / 1000)}k`
        }
      },
      annotations: { 
        yaxis: [{ 
          label: { 
            text: 'GOAL',
            style: { fontSize: '10px' }
          }
        }] 
      }
    }
  }];
}