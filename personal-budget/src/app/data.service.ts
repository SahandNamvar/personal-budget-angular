import { Injectable } from '@angular/core'; // Import Injectable decorator from Angular core module
import { HttpClient } from '@angular/common/http'; // Import HttpClient from Angular common HTTP module
import { Observable, of } from 'rxjs'; // Import Observable and of from RxJS library
import { catchError, map } from 'rxjs/operators'; // Import catchError and map operators from RxJS library
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedData: any; // Variable to store the fetched data
  dataSourceUpdated = new Subject<any>(); // Emits whenever dataSource changes

  constructor(private http: HttpClient) { } // Constructor function to inject HttpClient service


  fetchData(): Observable<any> { // Method to fetch data from backend API
    if (this.cachedData) { // Check if data is already cached
      // If data is already present, return it as an observable
      return of(this.cachedData); // Return cached data as an observable using 'of' operator
    } else {
      // If data is not present, make a new HTTP request to fetch it
      return this.http.get('http://localhost:3000/budget').pipe( // Make HTTP GET request and handle response
        map((data: any) => {
          // Store the fetched data in the cachedData variable
          this.cachedData = data; // Assign fetched data to cachedData variable
          this.dataSourceUpdated.next(this.cachedData); // Emit update notification
          return data; // Return fetched data
        }),
        catchError(error => {
          // Handle errors
          console.error('Error fetching data:', error); // Log error to console
          throw error; // Rethrow the error
        })
      );
    }
  }

  processChartData(rawData: any): any { // Method to process raw data into chart data format
    return {
      datasets: [
        {
          data: rawData.myBudget.map((item: any) => item.budget), // Extract budget data from raw data
          backgroundColor: [
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
      labels: rawData.myBudget.map((item: any) => item.title) // Extract title data from raw data
    };
  }
}
