import { Component, OnInit } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html'
})
export class RideListComponent implements OnInit {
  rides: Ride[] = [];
  timeFilter: string = '';  
  vehicleFilter: string = '';  


  constructor(
    private rideService: RideService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.load();   
  }

  refresh(): void {
    this.load();
  }


  load(): void {
    
    this.rides = this.rideService.getAvailableRides();
  }

  onBook(ride: Ride): void {
    const emp = prompt('Enter your Employee ID to book this ride:');
    if (!emp) return;

    if (!this.employeeService.isValidEmployeeId(emp)) {
      alert('Employee ID not recognized. Please enter a valid Employee ID.');
      return;
    }

    const res = this.rideService.bookRide(ride.id, emp);
    alert(res.message);
    if (res.success) this.load();  
  }
}
