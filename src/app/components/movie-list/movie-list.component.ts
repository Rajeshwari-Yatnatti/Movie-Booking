import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  searchTerm:string='';
  selectedGenre:string='';
  uniqueGenres:string[]=[];
  movies:Movie[] = [];

  constructor(private movieService: MovieService){}

  ngOnInit(){
    this.movieService.getMovies().subscribe(data => {
      this.movies=data;
      this.uniqueGenres = [...new Set(this.movies.map(movie =>movie.genre))];//Uses .map() to create an array of genres.
      //Uses new Set() to remove duplicates.
    });
  }

  filteredMovies(){
    return this.movies.filter(movie =>
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
      (this.selectedGenre===''   || movie.genre === this.selectedGenre)
      );

  }



}
