export class Project {
    public  id:number;
	public  name:string;
	public  duration:string;
	public  budget:number;
	public areaOfImplemenation:string;
	public location:string;
	public  projectId:string;
	public  noOfClients:number;
	public  link:string;
	public  noOfPayments:number;
  
    constructor() {
          this.id=null;
          this.name='';
          this.duration='';
          this.budget=null;
          this.areaOfImplemenation='';
          this.location='';
          this.projectId='';
          this.noOfClients=null;
          this.link='';
          this.noOfPayments=null;
    }
  
  }
  