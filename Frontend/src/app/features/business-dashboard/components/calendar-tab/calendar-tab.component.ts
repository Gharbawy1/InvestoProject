import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-tab',
  imports: [ CommonModule ],
  templateUrl: './calendar-tab.component.html',
  styleUrls: ['./calendar-tab.component.css']
})
export class CalendarTabComponent {
  // List of events to display on the calendar tab.
  events = [
    {
      // Day of the event.
      date: '15',
      // Month abbreviation for the event.
      month: 'DEC',
      // Title of the event.
      title: 'Investor Meeting',
      // Time span for the event.
      time: '10:00 AM - 11:30 AM',
      // Location where the event will be held.
      location: 'Conference Room A'
    }
    // Additional events can be added to this array.
  ];
}