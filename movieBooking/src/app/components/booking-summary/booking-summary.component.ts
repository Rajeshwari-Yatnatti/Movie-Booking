import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-summary',
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.css'
})
export class BookingSummaryComponent {
  movieTitle!: string;
  groupedSeats: { [key: string]: string[] } = {
    'Second-Class': [],
    'Balcony': [],
  };
  secondClassTotal!: number;
  balconyTotal!: number;
  convenienceFee!: number;
  finalPrice!: number;

  constructor(
    private bookingService: BookingService,
    private router:Router


  ){}
  ngOnInit():void{
    this.bookingService.bookingData$.subscribe((data) => {
      if (data) {
        this.movieTitle = data.movieTitle;
        this.groupedSeats = data.groupedSeats;
        this.secondClassTotal = data.secondClassTotal;
        this.balconyTotal = data.balconyTotal;
        this.convenienceFee = data.convenienceFee;
        this.finalPrice = data.finalPrice;
      } else {
        this.router.navigate(['/']);
      }
    });

  }

  proceed(){
    this.router.navigate(['/movie', 'seats', 'booking', 'payment']);
  }

}
