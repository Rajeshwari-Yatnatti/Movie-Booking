import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Seat } from '../../models/seat.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-seat-selection',
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  balconyPrice: number = 50;
  secondClassPrice: number = 30;
  totalAmount: number = 0;

  movieId!: number;
  movieTitle!: any;
  convenienceFee: number = 60;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = +params['id']; // Get movie ID from route
      this.getMovieDetails(this.movieId); // Fetch movie details
    });
    this.generateSeats(); // Generate mock seat data
    this.loadOccupiedSeats(); // Load previously booked seats
  }

  // Modify localStorage key to include movie ID
  getStorageKey(movieId: number) {
    return `occupiedSeats_movie_${movieId}`;
  }

  getMovieDetails(movieId: number) {
    this.movieService.getMovies().subscribe(movies => {
      console.log('Movies:', movies); // Log all movies
      const movie = movies.find(m => m.id === movieId);
      console.log('Selected Movie:', movie); // Log the selected movie
      if (movie) {
        this.movieTitle = movie;
      } else {
        console.error('Movie not found');
      }
    });
  }

  generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E','F','G'];
    const types = ['Second-Class', 'Balcony'];
    let seatId = 1;

    types.forEach(type => {
      rows.forEach(row => {
        for (let num = 1; num <= 10; num++) {
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
    });
  }

  get secondClassSeats() {
    return this.seats.filter(seats => seats.type === 'Second-Class');
  }

  get balconySeats() {
    return this.seats.filter(seats => seats.type === 'Balcony');
  }

  loadOccupiedSeats() {
    const key = this.getStorageKey(this.movieId);
    const occupiedSeats = JSON.parse(localStorage.getItem(key) || '[]');

    this.seats = this.seats.map(seat => ({
      ...seat,
      occupied: occupiedSeats.includes(`${seat.type}_${seat.row}${seat.number}`),
    }));
    this.changeDetectorRef.detectChanges();
    // In loadOccupiedSeats()
    console.log('Loaded occupied seats:', this.seats.filter(seat => seat.occupied));
  }

  selectSeat(seat: Seat) {
    if (seat.occupied) return; // Ignore clicks on occupied seats

    seat.selected = !seat.selected;
    this.selectedSeats = this.seats.filter((s: Seat) => s.selected);

    // Recalculate the total amount based on selected seats
    this.totalAmount = this.selectedSeats.reduce((total: number, s: Seat) => total + this.getSeatPrice(s), 0);
  }

  getSeatPrice(seat: Seat): number {
    if (seat.type === 'Balcony') {
      return this.balconyPrice; // Price for Balcony seat
    } else if (seat.type === 'Second-Class') {
      return this.secondClassPrice; // Price for Second-Class seat
    }
    return 0; // Default if the seat type doesn't match
  }

  // Final price including convenience fee
  get finalPrice(): number {
    return this.totalAmount + this.convenienceFee; // Add convenience fee to total amount
  }

 // Helper method to group selected seats by type
groupSelectedSeatsByType(): { [key: string]: string[] } {
  const grouped: { [key: string]: string[] } = {
    'Second-Class': [],
    'Balcony': [],
  };

  this.selectedSeats.forEach((seat) => {
    if (seat.type === 'Second-Class') {
      grouped['Second-Class'].push(`${seat.row}${seat.number}`);
    } else if (seat.type === 'Balcony') {
      grouped['Balcony'].push(`${seat.row}${seat.number}`);
    }
  });

  return grouped;
}

  // Get the total price for a specific seat type
  getTotalForType(type: string): number {
    const seatsOfType = this.selectedSeats.filter(seat => seat.type === type);
    return seatsOfType.length * (type === 'Balcony' ? this.balconyPrice : this.secondClassPrice);
  }

  pay() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

      // Group selected seats by type
  const groupedSeats = this.groupSelectedSeatsByType();

  const secondClassTotal = this.getTotalForType('Second-Class');
  const balconyTotal = this.getTotalForType('Balcony');

 

    // Use movie-specific storage key
    const key = this.getStorageKey(this.movieId);
    const bookedSeatNumbers = this.selectedSeats.map(s => `${s.type}_${s.row}${s.number}`);
    const occupiedSeats = JSON.parse(localStorage.getItem(key) || '[]');

    // Save with movie-specific key
    localStorage.setItem(key, JSON.stringify([...occupiedSeats, ...bookedSeatNumbers]));

  // Save data to BookingService
  this.bookingService.setBookingData({
    movieTitle: this.movieTitle.title,
    totalAmount: this.totalAmount,
    selectedSeats: this.selectedSeats.map((seat) => `${seat.type}_${seat.row}${seat.number}`),
    groupedSeats: groupedSeats,
    secondClassTotal: secondClassTotal,
    balconyTotal: balconyTotal,
    convenienceFee: this.convenienceFee,
    finalPrice: this.finalPrice,
  });


    // Navigate to the booking page
    this.router.navigate(['/movie', this.movieId, 'seats', 'booking']);
    this.changeDetectorRef.detectChanges();
  }

  clearStorage() {
    localStorage.removeItem('occupiedSeats');
  }
}

// Define a type for the grouped seats
type GroupedSeats = {
  'Second-Class': Seat[];
  'Balcony': Seat[];
};