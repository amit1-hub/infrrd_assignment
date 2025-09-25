
import { Injectable } from '@angular/core';
import { Ride, Booking, VehicleType } from '../models/ride.model';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private STORAGE_PREFIX = 'transport_rides_'; 

  constructor(private employeeService: EmployeeService) {}

  private getKeyForToday(date?: Date) {
    const d = date ?? new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${this.STORAGE_PREFIX}${y}-${m}-${day}`;
  }

  private loadAll(): Ride[] {
    const key = this.getKeyForToday();
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as Ride[] : [];
  }

  private saveAll(rides: Ride[]) {
    const key = this.getKeyForToday();
    localStorage.setItem(key, JSON.stringify(rides));
  }

  private makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  addRide(payload: Partial<Ride>): { success: boolean; message: string } {
    const rides = this.loadAll();

    // validations
    if (!payload.ownerEmployeeId) return { success:false, message: 'Owner Employee ID required' };
    if (!this.employeeService.isValidEmployeeId(payload.ownerEmployeeId)) {
      return { success:false, message: 'Owner Employee ID not recognized' };
    }

    if (!payload.vehicleNo) return { success:false, message: 'Vehicle No required' };
    if (!payload.vacantSeats || payload.vacantSeats <= 0) return { success:false, message: 'Vacant seats must be > 0' };
    if (!payload.timeIso) return { success:false, message: 'Time is required' };
    if (!payload.pickupPoint || !payload.destination) return { success:false, message: 'Pickup & destination required' };

    const exists = rides.find(r => r.ownerEmployeeId === payload.ownerEmployeeId);
    if (exists) return { success:false, message: 'You already added a ride for today' };

    const newRide: Ride = {
      id: this.makeId(),
      ownerEmployeeId: payload.ownerEmployeeId!,
      vehicleType: (payload.vehicleType as VehicleType) || 'Car',
      vehicleNo: payload.vehicleNo!,
      vacantSeats: payload.vacantSeats!,
      timeIso: payload.timeIso!,
      pickupPoint: payload.pickupPoint!,
      destination: payload.destination!,
      bookings: [],
      createdAtIso: new Date().toISOString()
    };

    rides.push(newRide);
    this.saveAll(rides);
    return { success:true, message: 'Ride added' };
  }

  private diffMinutes(aIso: string, bIso: string) {
    const a = new Date(aIso).getTime();
    const b = new Date(bIso).getTime();
    return Math.round((a - b) / (1000 * 60));
  }

  getAvailableRides(vehicleType?: VehicleType, referenceTimeIso?: string, bufferMinutes = 60): Ride[] {
    const rides = this.loadAll();
    const refIso = referenceTimeIso ?? new Date().toISOString();

    return rides.filter(r => {
      const diff = Math.abs(this.diffMinutes(r.timeIso, refIso));
      const timeMatches = diff <= bufferMinutes;
      const vehicleMatches = vehicleType ? r.vehicleType === vehicleType : true;
      return timeMatches && vehicleMatches && r.vacantSeats > 0;
    });
  }

  bookRide(rideId: string, bookingEmployeeId: string): { success: boolean; message: string } {
    if (!this.employeeService.isValidEmployeeId(bookingEmployeeId)) {
      return { success:false, message: 'Employee ID not recognized' };
    }

    const rides = this.loadAll();
    const idx = rides.findIndex(r => r.id === rideId);
    if (idx === -1) return { success:false, message: 'Ride not found' };

    const ride = rides[idx];

    if (ride.ownerEmployeeId === bookingEmployeeId) return { success:false, message: 'Owner cannot book their own ride' };

    if (ride.bookings.some(b => b.employeeId === bookingEmployeeId)) return { success:false, message: 'You already booked this ride' };

    if (ride.vacantSeats <= 0) return { success:false, message: 'No vacant seats left' };

   
    ride.bookings.push({ employeeId: bookingEmployeeId, bookedAtIso: new Date().toISOString() });
    ride.vacantSeats = ride.vacantSeats - 1;
    rides[idx] = ride;
    this.saveAll(rides);

    return { success:true, message: 'Booking confirmed' };
  }

  getRide(rideId: string): Ride | undefined {
    return this.loadAll().find(r => r.id === rideId);
  }
}
