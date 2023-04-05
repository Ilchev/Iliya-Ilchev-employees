import { Component } from '@angular/core';
import { Employee, IEmployee } from './shared/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'PairEmployees';
  employees: IEmployee[] = [];
  projects: number[] = [];
  employeesByProjects: { [projectId: number]: IEmployee[] } = {};

  importFile(event: any) {
    this.cleanVariables();
    if (event && event.target && event.target.files.length == 0) {
      console.log("No file selected!");
      return
    } else {
      let file = event.target.files[0];
      console.log("File " + file.name + " is selected!");
      this.readFile(file);
    }
  }

  readFile(file: File): void {

    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let csv: any = reader.result;
      let allTextLines: string[] = [];
      allTextLines = csv.split(/\r|\n|\r/);

      let regEx1: RegExp = /\d[0-9]+,+\d[0-9]+,+\d[0-9]+-+\d[0-9]+-+\d[0-9],+(?:(\d[0-9]+-+\d[0-9]+-+\d[0-9])|(NULL)|(null))+$/;
      let regEx2: RegExp = /\d[0-9]+,+\d[0-9]+,+\d[0-9]+\/+\d[0-9]+\/+\d[0-9],+(?:(\d[0-9]+\/+\d[0-9]+\/+\d[0-9])|(NULL)|(null))+$/;
      let regEx3: RegExp = /\d[0-9]+,+\d[0-9]+,+\d[0-9]+.+\d[0-9]+.+\d[0-9],+(?:(\d[0-9]+.+\d[0-9]+.+\d[0-9])|(NULL)|(null))+$/;

      allTextLines.forEach((line: string) => {
        line = line.replace(/\s/g, '')
        if (regEx1.test(line) || regEx2.test(line) || regEx3.test(line)) {
          const row = line.split(',');
          const employee = new Employee(
            (+row[0]),
            (+row[1]),
            new Date(row[2]),
            this.getDatFromString(row[3]),
            0
          );
          this.employees.push(employee);
        } else {
          console.log("Invalid line: " + line);
        }
      });
      this.populateProjectIds(this.employees);
      this.calculateDaysWorkedByEmployee(this.employees);
      this.populateEmployeesByProjects(this.employees);
    }
  }

  populateProjectIds(employees: Employee[]): void {
    employees.forEach(e => {
      if (this.projects.indexOf(e.projectId) === -1) {
        this.projects.push(e.projectId);
      };
    });
  }

  calculateDaysWorkedByEmployee(employees: Employee[]): void {
    employees.forEach(e => {
      var diff = Math.abs(e.dateTo.getTime() - e.dateFrom.getTime());
      e.daysWorked = Math.ceil(diff / (1000 * 3600 * 24));
    });
  }

  populateEmployeesByProjects(employees: Employee[]): void {
    this.projects.forEach(p => {
      let employeeByProject = employees.filter(e => e.projectId === p);
      employeeByProject.sort((a, b) => (a.daysWorked > b.daysWorked ? -1 : 1));
      if (employeeByProject.length > 2) {
        employeeByProject = employeeByProject.slice(0, 2);
      }
      this.employeesByProjects[p] = employeeByProject;
    })
  }

  // new Date() accept all possible Date string formats
  private getDatFromString(dateString: String): Date {
    if (dateString.toLowerCase() === 'null') {
      return new Date();
    } else {
      return new Date(dateString.toString());
    }
  }

  private cleanVariables(): void {
    this.projects = [];
    this.employees = [];
  }

}
