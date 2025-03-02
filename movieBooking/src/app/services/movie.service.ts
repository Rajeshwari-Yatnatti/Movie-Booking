import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private dataUrl = 'assets/movies.json';

  constructor(private http:HttpClient) { }

  getMovies():Observable<any[]>{
    return this.http.get<any[]>(this.dataUrl);
  }
}
