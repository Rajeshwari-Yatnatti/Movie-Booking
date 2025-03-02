import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  // Define the structure of the booking data
  private bookingData = new BehaviorSubject<{
    movieTitle: string;
    totalAmount: number;
    selectedSeats: string[];
    groupedSeats: { [key: string]: string[] }; // Grouped seats by type
    secondClassTotal: number; // Total for Second-Class seats
    balconyTotal: number; // Total for Balcony seats
    convenienceFee: number; // Convenience fee
    finalPrice: number; // Final price including convenience fee
  } | null>(this.getStoredBookingData());

  // Expose the booking data as an observable
  bookingData$ = this.bookingData.asObservable();

  constructor() {}

  // Method to set booking data
  setBookingData(data: {
    movieTitle: string;
    totalAmount: number;
    selectedSeats: string[];
    groupedSeats: { [key: string]: string[] };
    secondClassTotal: number;
    balconyTotal: number;
    convenienceFee: number;
    finalPrice: number;
  }) {
    this.bookingData.next(data);
    this.storeBookingData(data); // Optionally store data in localStorage
  }

  // Method to get stored booking data (e.g., from localStorage)
  private getStoredBookingData() {
    const storedData = localStorage.getItem('bookingData');
    return storedData ? JSON.parse(storedData) : null;
  }

  // Method to store booking data (e.g., in localStorage)
  private storeBookingData(data: any) {
    localStorage.setItem('bookingData', JSON.stringify(data));
  }
}