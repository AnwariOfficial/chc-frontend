import { Component, OnInit } from '@angular/core';
import { ApexFill, ApexLegend, ApexMarkers, ApexTitleSubtitle } from 'ng-apexcharts/lib/model/apex-types';
import { ApexChart, ApexNonAxisChartSeries } from 'ng-apexcharts/public_api';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  series : ApexNonAxisChartSeries=[40,32,55,87];
  chartDetails : ApexChart = {
    type:'donut',
    toolbar:{
      show:true
    },
    height:450
  };
  chartLabels =["Apple","Microsoft","Dell","Sansung"];
  chartTitle : ApexTitleSubtitle={
    text:"Leading Production Company",
    align:"center"

  }
legend: ApexLegend ={
  position:"top"
}

  lseries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [31, 40, 28, 51, 42, 82, 56],
    }, {
      name: 'Revenue',
      data: [11, 32, 45, 32, 34, 52, 41]
    }, {
      name: 'Customers',
      data: [15, 11, 32, 18, 9, 24, 11]
    }
  ];
  lchart: ApexChart = {
    height:300,
    type:"area",
    zoom:{
      enabled:true
    }
  };
  lxaxis: ApexXAxis={
    categories:[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
    ]
  }
  ldataLabels: ApexDataLabels={
    enabled:false
  }
  lgrid: ApexGrid={
    row:{
      colors: ["#f3f3f3", "transparent"],
      opacity:0.5
    }
  }
  lstroke: ApexStroke={
    curve:"smooth",
    width:2
  }
  ltitle: ApexTitleSubtitle={
    text:"Selling of Devices",
    align:"center"
  }
  lmarker:ApexMarkers={
    size:4,
    shape:'circle'
  }
  lfill:ApexFill={
    type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
  }
}




  constructor() { }

  ngOnInit(): void {
  }

}
