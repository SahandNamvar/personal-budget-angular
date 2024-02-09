import { Component, AfterViewInit } from '@angular/core'; // Import Component and AfterViewInit from '@angular/core' module
import { HttpClient } from '@angular/common/http'; // Import HttpClient from '@angular/common/http' module
import { Chart } from 'chart.js'; // Import Chart from 'chart.js' library

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

}
