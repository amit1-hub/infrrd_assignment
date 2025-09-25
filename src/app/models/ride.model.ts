export type VehicleType = 'Bike' | 'Car';

export interface Booking {
  employeeId: string;
  bookedAtIso: string;
}

export interface Ride {
  id: string;                 
  ownerEmployeeId: string;    
  vehicleType: VehicleType;   
  vehicleNo: string;          
  vacantSeats: number;        
  timeIso: string;            
  pickupPoint: string;        
  destination: string;        
  bookings: Booking[];        
  createdAtIso: string;
}
