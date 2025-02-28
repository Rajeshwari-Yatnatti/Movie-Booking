import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Seat } from '../../models/seat.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-seat-selection',
  imports: [CommonModule, RouterModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  balconyPrice:number = 50;
  secondClassPrice:number = 30;
  totalAmount:number =0;

  movieId!:number;
  movieTitle!:any;

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private route:ActivatedRoute,
    private router:Router,
    private bookingService: BookingService,
    private movieService: MovieService
  ){}

  ngOnInit(): void {
    this.movieId = +this.route.snapshot.paramMap.get('id')!;
    this.movieTitle = this.getMovieDetails(this.movieId);
    this.generateSeats(); // Generate mock seat data
    this.loadOccupiedSeats(); // Load previously booked seats
  }

  // Modify localStorage key to include movie ID
getStorageKey(movieId: number) {
  return `occupiedSeats_movie_${movieId}`;
}

getMovieDetails(movieId:number){
 this.movieService.getMovies().subscribe(movie => {
  this.movieTitle = movie.find(m => m.id ===movieId);
 })
}

  generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const types = ['Second-Class', 'Balcony'];
    let seatId = 1;

   types.forEach(type => {
    rows.forEach(row => {
      for (let num = 1; num <= 8; num++) {
        this.seats.push({
          id: seatId++,
          row: row,
          number: num,
          selected: false,
          occupied: false, // Default is unoccupied 
          type: type,
        });
      }
    });
  })
  }

  get secondClassSeats(){
    return this.seats.filter(seats => seats.type === 'Second-Class');
  }

  get balconySeats(){
    return this.seats.filter(seats => seats.type === 'Balcony');
  }

  loadOccupiedSeats() {
    const key = this.getStorageKey(this.movieId);
    const occupiedSeats = JSON.parse(localStorage.getItem(key) || '[]');
    
   this.seats = this.seats.map(seat => ({...seat, occupied:occupiedSeats.includes(`${seat.type}_${seat.row}${seat.number}`)
  }));
  this.changeDetectorRef.detectChanges();
  // In loadOccupiedSeats()
console.log('Loaded occupied seats:', 
  this.seats.filter(seat => seat.occupied)
);
  }

  selectSeat(seat: Seat) {
    if (seat.occupied) return; // Ignore clicks on occupied seats

    seat.selected = !seat.selected;
    this.selectedSeats = this.seats.filter(s => s.selected);

    this.totalAmount = this.selectedSeats.reduce((total,s) => total + this.getSeatPrice(s),0);
  

   }
  

  getSeatPrice(seat:Seat){
    if(seat.type === 'Balcony'){
      return this.balconyPrice;
    } else if(seat.type === 'Second-Class'){
      return this.secondClassPrice;
    }
    return 0;
  }

  pay() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
  
    // Use movie-specific storage key
    const key = this.getStorageKey(this.movieId);
    const bookedSeatNumbers = this.selectedSeats.map(s => `${s.type}_${s.row}${s.number}`);
    const occupiedSeats = JSON.parse(localStorage.getItem(key) || '[]');
  
    // Save with movie-specific key
    localStorage.setItem(key, JSON.stringify([...occupiedSeats, ...bookedSeatNumbers]));

    //update the bookingservice with booking data
    this.bookingService.setBookingData(
      this.movieTitle.title,
      this.totalAmount,
      bookedSeatNumbers    );
  
  

    // Navigate to the booking page
  this.router.navigate(['/movie', this.movieId, 'seats', 'booking']);
  this.changeDetectorRef.detectChanges();

  }

  clearStorage() {
    localStorage.removeItem('occupiedSeats');
  }
}
