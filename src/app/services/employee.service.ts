import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private EMP_KEY = 'transport_employees';
  
  private defaultEmployees = ['1', '2'];

  constructor() {
    if (!localStorage.getItem(this.EMP_KEY)) {
      localStorage.setItem(this.EMP_KEY, JSON.stringify(this.defaultEmployees));
    }
  }

  getAllEmployeeIds(): string[] {
    const raw = localStorage.getItem(this.EMP_KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  }

  isValidEmployeeId(id?: string | null): boolean {
    if (!id) return false;
    const ids = this.getAllEmployeeIds();
    return ids.includes(String(id));
  }

  addEmployee(id: string) {
    const ids = new Set(this.getAllEmployeeIds().map(x => String(x)));
    ids.add(String(id));
    localStorage.setItem(this.EMP_KEY, JSON.stringify(Array.from(ids)));
  }

  removeEmployee(id: string) {
    const ids = this.getAllEmployeeIds().filter(x => x !== String(id));
    localStorage.setItem(this.EMP_KEY, JSON.stringify(ids));
  }
}
