import { Component, OnInit } from '@angular/core';
import { Seat } from '../../models/seat.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-selection',
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];

  ngOnInit(): void {
    this.generateSeats(); // Generate mock seat data
    this.loadOccupiedSeats(); // Load previously booked seats
  }

  generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    let seatId = 1;

   
    rows.forEach(row => {
      for (let num = 1; num <= 8; num++) {
        this.seats.push({
          id: seatId++,
          row: row,
          number: num,
          selected: false,
          occupied: false // Default is unoccupied
        });
      }
    });
  }

  loadOccupiedSeats() {
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats') || '[]');
    
    // Mark seats as occupied if they were booked earlier
    this.seats.forEach(seat => {
      if (occupiedSeats.includes(`${seat.row}${seat.number}`)) {
        seat.occupied = true;
      }
    });
  }

  selectSeat(seat: Seat) {
    if (seat.occupied) return; // Ignore clicks on occupied seats

    seat.selected = !seat.selected;
    this.selectedSeats = this.seats.filter(s => s.selected);
  }

  confirmBooking() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    // Save newly booked seats to localStorage
    const bookedSeatNumbers = this.selectedSeats.map(s => `${s.row}${s.number}`);
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats') || '[]');

    localStorage.setItem('occupiedSeats', JSON.stringify([...occupiedSeats, ...bookedSeatNumbers]));

    // Mark booked seats as occupied
    this.selectedSeats.forEach(seat => seat.occupied = true);
    this.selectedSeats = [];

    alert(`You have booked seats: ${bookedSeatNumbers.join(', ')}`);
  }
}
