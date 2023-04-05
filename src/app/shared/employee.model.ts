export interface IEmployee {
  empId: number;
  projectId: number;
  dateFrom: Date;
  dateTo: Date;
  daysWorked: number;
}

export class Employee implements IEmployee {
  constructor(
    public empId: number,
    public projectId: number,
    public dateFrom: Date,
    public dateTo: Date,
    public daysWorked: number,
  ) {
    this.empId = empId;
    this.projectId = projectId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.daysWorked = daysWorked;
  }
}
