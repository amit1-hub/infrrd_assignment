import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { VehicleType } from 'src/app/models/ride.model';

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html'
})
export class AddRideComponent {
  form = this.fb.group({
    ownerEmployeeId: ['', Validators.required],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', Validators.required],
    vacantSeats: [1, [Validators.required, Validators.min(1)]],
    time: ['', Validators.required], 
    pickupPoint: ['', Validators.required],
    destination: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private rideService: RideService) {}

  private combineTodayWithTime(timeHHmm: string) {
    const [hh, mm] = timeHHmm.split(':').map(x => parseInt(x, 10));
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0, 0);
    return d.toISOString();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const timeIso = this.combineTodayWithTime(this.form.value.time!);


    const result = this.rideService.addRide({
      ownerEmployeeId: values.ownerEmployeeId ?? undefined,
      vehicleType: values.vehicleType as VehicleType ?? undefined,
      vehicleNo: values.vehicleNo ?? undefined,
      vacantSeats: values.vacantSeats ?? undefined,
      timeIso: timeIso ?? undefined,
      pickupPoint: values.pickupPoint ?? undefined,
      destination: values.destination ?? undefined
    });

    if (result.success) {
      alert('Ride added successfully');
      this.form.reset({ vehicleType: 'Car', vacantSeats: 1 });
    } else {
      alert('Error: ' + result.message);
    }
  }
}
