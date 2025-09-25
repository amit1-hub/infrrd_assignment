import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { AddRideComponent } from './components/add-ride/add-ride.component';

const routes: Routes = [
  { path: '', component: RideListComponent },
  { path: 'add', component: AddRideComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
