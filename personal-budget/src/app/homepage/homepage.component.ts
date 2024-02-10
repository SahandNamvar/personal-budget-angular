import { Component, AfterViewInit } from '@angular/core'; // Import Component and AfterViewInit from Angular core module
import { Chart } from 'chart.js'; // Import Chart class from Chart.js library
import * as d3 from 'd3'; // Import d3 library
import { DataService } from '../data.service'; // Import DataService

@Component({
  selector: 'app-homepage', // Selector for the component
  templateUrl: './homepage.component.html', // Template URL for the component
  styleUrls: ['./homepage.component.scss'] // Style URLs for the component
})
export class HomepageComponent implements AfterViewInit { // Define HomepageComponent class implementing AfterViewInit lifecycle hook

  chart: Chart | null = null; // Declare chart property with Chart or null type
  dataSource: any; // Declare dataSource property with any type

  constructor(private dataService: DataService) {} // Constructor function to inject DataService

  ngAfterViewInit(): void { // Implementation of AfterViewInit lifecycle hook
    this.dataService.fetchData().subscribe((res: any) => { // Call fetchData method of DataService to fetch data
      this.dataSource = this.dataService.processChartData(res); // Process fetched data using processChartData method of DataService
      this.createChart(); // Call createChart method to create Chart.js chart
      this.createD3DonutChart(); // Call createD3DonutChart method to create D3.js chart
    });
    this.dataService.dataSourceUpdated.subscribe((updatedData: any) => {
      console.log('dataSource updated:', updatedData);
    });
  }

  createChart(): void { // Method to create Chart.js chart
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null; // Get canvas element for chart
    if (ctx) { // Check if canvas element exists
      this.chart = new Chart(ctx, { // Create new Chart.js instance
        type: 'pie', // Set chart type to pie
        data: this.dataSource // Set chart data to dataSource
      });
    } else { // If canvas element does not exist
      console.error("Canvas element with id 'myChart' not found."); // Log error message
    }
  }

  createD3DonutChart(): void { // Method to create D3.js chart
    const width = 400; // Define width of chart
    const height = 400; // Define height of chart
    const radius = Math.min(width, height) / 2; // Calculate radius of chart

    const svg = d3.select('#d3DonutChart') // Select SVG element for chart
      .append('svg') // Append SVG element
      .attr('width', width) // Set width attribute
      .attr('height', height) // Set height attribute
      .append('g') // Append 'g' element
      .attr('transform', `translate(${width / 2},${height / 2})`); // Set transform attribute

    const arc = d3.arc() // Define arc generator
      .innerRadius(radius * 0.5) // Set inner radius
      .outerRadius(radius * 0.8); // Set outer radius

    const pie = d3.pie() // Define pie generator
      .sort(null) // Disable sorting
      .value((d: any) => d); // Set value accessor

    const paths = svg.selectAll('path') // Select all path elements
      .data(pie(this.dataSource.datasets[0].data)) // Bind data to paths
      .enter() // Enter selection
      .append('path') // Append path elements
      .attr('d', (d: any) => arc(d) as string) // Set 'd' attribute using arc generator
      .attr('fill', (d: any, i: number) => this.dataSource.datasets[0].backgroundColor[i]); // Set 'fill' attribute
  }
}
