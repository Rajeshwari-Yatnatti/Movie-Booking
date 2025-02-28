import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { Seat } from '../../models/seat.model';



@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
   movie: any;
   seats:Seat[]=[];
   selectedSeats: Seat[]=[];

   constructor(private route: ActivatedRoute, private movieService: MovieService){}

   ngOnInit(): void {
     const movieID = Number(this.route.snapshot.paramMap.get('id'));
     this.movieService.getMovies().subscribe(data => {
      this.movie = data.find(m => m.id===movieID);
     })
   }
}
