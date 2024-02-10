import { Component, AfterViewInit } from '@angular/core'; // Import Component and AfterViewInit from '@angular/core' module
import { HttpClient } from '@angular/common/http'; // Import HttpClient from '@angular/common/http' module
import { Chart } from 'chart.js'; // Import Chart from 'chart.js' library
import * as d3 from 'd3';


@Component({ // Decorator that marks a class as an Angular component
  selector: 'app-homepage', // Selector that identifies the component when used in templates
  templateUrl: './homepage.component.html', // URL of the HTML template file for the component
  styleUrls: ['./homepage.component.scss'] // Array of URLs of CSS style files to apply to the component's template
})
export class HomepageComponent implements AfterViewInit { // Define HomepageComponent class that implements AfterViewInit lifecycle hook

  chart: Chart | null = null; // Declare a property 'chart' of type Chart or null and initialize it to null

  public dataSource = { // Define 'dataSource' object to hold chart data
    datasets: [ // Array of datasets for the chart
      {
        data: [0], // Array of data points for the dataset, initialized with a single value (0)
        backgroundColor: [ // Array of background colors for the data points
          '#2020d4',
          '#23d420',
          '#d42020',
          '#cbd420',
          '#7720d4',
          '#ce20d4',
          '#20d49e',
          '#20d4bf',
          '#d42089',
          '#d4b020'
        ],
      }
    ],
    labels: [''] // Array of labels for the data points, initialized with an empty string
  };

  constructor(private http: HttpClient) {
    const checkingCanvas = document.getElementById('myChart'); // Error Checking if myChart is activated. (It shouldn't be at this stage in the lifecycle)
    console.log("Is myChart ready?", checkingCanvas);
  } // Constructor function that injects HttpClient service

  ngAfterViewInit(): void { // Implementation of AfterViewInit lifecycle hook
    const checkingCanvas = document.getElementById('myChart'); // Error Checking if myChart is activated. (It SHOULD be at this stage in the lifecycle)
    console.log("Is myChart ready?", checkingCanvas);
    this.http.get('http://localhost:3000/budget') // Make an HTTP GET request to 'http://localhost:3000/budget'
    .subscribe((res: any) => { // Subscribe to the Observable returned by the HTTP request
      console.log(res); // Log the response data to the console
      for (var i = 0; i < res.myBudget.length; i++) { // Iterate over the 'myBudget' array in the response
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget; // Assign budget value to the corresponding data point
        this.dataSource.labels[i] = res.myBudget[i].title; // Assign title to the corresponding label
      }
      this.createChart(); // Call the createChart method to create the chart
      this.createD3DonutChart();
    });
  }

  createChart(): void { // Method to create the chart
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null; // Get the canvas element with id 'myChart'
    if (ctx) { // Check if the canvas element is found
      this.chart = new Chart(ctx, { // Create a new Chart instance with the canvas context
        type: 'pie', // Set the type of chart to 'pie'
        data: this.dataSource // Set the data for the chart from the dataSource object
      });
    } else { // If the canvas element is not found
      console.error("Canvas element with id 'myChart' not found."); // Log an error message to the console
    }
  }

  createD3DonutChart(): void {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#d3DonutChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const pie = d3.pie()
      .sort(null)
      .value((d: any) => d);

    const paths = svg.selectAll('path')
      .data(pie(this.dataSource.datasets[0].data))
      .enter()
      .append('path')
      .attr('d', (d: any) => arc(d) as string) // Convert arc output to string
      .attr('fill', (d: any, i: number) => this.dataSource.datasets[0].backgroundColor[i]);
  }
  // Replace the homepage.component.ts with this file (rename it to original), save and it should run.
  // When it runs, upon launching the site, you can view both charts. The data is read locally from this class,
  //      hence, no need for data.service.ts.
  // However, by moving the HTTP Client request and dataSource object (to store the data fetched) to data.service.ts
  //      when site is launched, no charts display. You must navigate to a different page via nav-bar, refresh the page,
  //      navigate to homepage and see the charts.

}
