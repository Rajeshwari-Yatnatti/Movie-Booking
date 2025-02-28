import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor() { }
// BehaviorSubject to hold the booking data
  private bookingData = new BehaviorSubject<{
    movieTitle: string;
    totalAmount: number;
    selectedSeats: string[];
  } | null>(this.getStoredBookingData());

    // Observable to expose the booking data
    bookingData$ = this.bookingData.asObservable();

     // Method to update the booking data
  setBookingData(movieTitle:string, totalAmount: number, selectedSeats:string []) {
    this.bookingData.next({movieTitle, totalAmount, selectedSeats});
  }

  // Method to retrieve booking data from localStorage
  private getStoredBookingData() {
    const data = localStorage.getItem('bookingData');
    return data ? JSON.parse(data) : null;
  }

  private storeBookingData(data:any){
    localStorage.setItem('bookingData', JSON.stringify(data));
  }

  // Method to clear the booking data
  clearBookingData() {
    this.bookingData.next(null);
    localStorage.removeItem('bookingData');
  }
}
