import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartType } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexFill,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers?: ApexMarkers;
  colors?: string[];
  annotations?: any;
};

const generateDailyData = (): number[] => {
  const daysInMonth = 31;
  const data: number[] = [];
  let currentAmount = 0;
  
  // Simulate daily funding with increasing momentum as deadline approaches
  for (let day = 1; day <= daysInMonth; day++) {
    const base = 50 + (day * 10);
    const random = Math.random() * 50;
    currentAmount += Math.round(base + random);
    data.push(currentAmount);
  }
  
  return data;
};

@Component({
  selector: 'app-daily-funding-chart',
  imports: [ CommonModule, NgApexchartsModule ],
  templateUrl: './daily-funding-chart.component.html',
  styleUrls: ['./daily-funding-chart.component.css']
})
export class DailyFundingChartComponent {
  public currentMonth: string = new Date().toLocaleString('default', { month: 'long' });
  
  public fundingGoal = 8000; // Example monthly goal
  public daysInMonth = 31;
  
  public chartOptions: ChartOptions = {
    colors: ["#3b82f6"],
    chart: {
      fontFamily: "Inter, sans-serif",
      type: 'line' as ChartType,
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 300
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 5
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      type: 'category',
      categories: Array.from({ length: this.daysInMonth }, (_, i) => `Day ${i + 1}`),
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: 'Amount (USD)',
        style: {
          color: '#6b7280',
          fontSize: '12px'
        }
      },
      labels: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      },
      min: 0,
      max: this.fundingGoal * 1.1
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Inter, sans-serif'
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    fill: { opacity: 1 },
    tooltip: {
      enabled: true,
      style: { fontSize: '14px' },
      y: {
        formatter: (val: number) => {
          const remaining = this.fundingGoal - val;
          return `$${val.toLocaleString()} (${remaining > 0 ? `$${remaining.toLocaleString()} to goal` : `${Math.abs(remaining).toLocaleString()} over goal`})`;
        }
      }
    },
    annotations: {
      yaxis: [{
        y: this.fundingGoal,
        borderColor: '#10b981',
        label: {
          borderColor: '#10b981',
          style: {
            color: '#fff',
            background: '#10b981'
          },
          text: `Monthly Goal: $${this.fundingGoal.toLocaleString()}`
        }
      }]
    },
    series: [
      {
        name: 'Daily Funding',
        data: generateDailyData()
      }
    ]
  };

  public responsive = [{
    breakpoint: 640,
    options: {
      chart: { height: 250 },
      yaxis: { show: false }
    }
  }];

  public isOpen: boolean = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  
  closeDropdown(): void {
    this.isOpen = false;
  }
}
