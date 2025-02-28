import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-summary',
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.css'
})
export class BookingSummaryComponent {
  movieTitle!:string;
  totalAmount!:number;
  selectedSeats!:string[];

  constructor(
    private bookingService: BookingService,
    private router:Router

  ){}
  ngOnInit():void{
    this.bookingService.bookingData$.subscribe((data) => {
      if(data){
        this.movieTitle = data.movieTitle;
        this.totalAmount = data.totalAmount;
        this.selectedSeats = data.selectedSeats;
      } else{
        this.router.navigate(['/']);
      }
    })

  }

}
