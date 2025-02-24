import { Routes } from '@angular/router';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';

export const routes: Routes = [
    { path: '', component:MovieListComponent},
    { path: 'movie/:id', component:MovieDetailComponent},
    { path: 'movie/:id/seat-selection', component:SeatSelectionComponent}
];
