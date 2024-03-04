var dataSource = {
    datasets: [
        {
            data: [], // will be populated by budget object values from server.js
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
    labels: [] // same as above
};

// Function to create a new instance of the chart and pass it the data
function createChart() {
    var ctx = document.getElementById("myChart").getContext("2d"); // Create ChartJS
    var myPieChart = new Chart(ctx, {type: 'pie', data: dataSource});

    // Create Donut Chart using D3.js
    var donutChart = d3.select("#donutChart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(200,200)");

    var arc = d3.arc()
        .innerRadius(100)
        .outerRadius(200);

    var pie = d3.pie();

    donutChart.selectAll("path")
        .data(pie(dataSource.datasets[0].data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return dataSource.datasets[0].backgroundColor[i];
        });
}
// Function to navigate to the Route defined in server.js (/budget) using Axios, get a response (the json object budget)
function getBudget() { // Axios: Used for making HTTP requests.
    axios.get('http://localhost:3000/budget') // access the /budget route defined in the server.js through the axios api, get a response back, manipulate the dataSource here with the budget object value from the server.
    .then(function (res) {
        console.log("Response from axios.get()", res.data);
        for (var i = 0; i < res.data.myBudget.length; i++) {
            // Populate the dataSource objects values by reading the json object response sent back from the server.js
            // and assigning them to the dataSource object defined here.
            dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
            dataSource.labels[i] = res.data.myBudget[i].title;
        }
        createChart();
        createDonutChart();
    }).catch(function (error) {
        console.error('Error fetching budget data:', error);
    });
}

function createDonutChart() {
    // Update Donut Chart using D3.js
    var donutChart = d3.select("#donutChart");

    var arc = d3.arc()
        .innerRadius(100)
        .outerRadius(200);

    var pie = d3.pie();

    var paths = donutChart.selectAll("path")
        .data(pie(dataSource.datasets[0].data))
        .join("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return dataSource.datasets[0].backgroundColor[i];
        });
    
    /*    
    // Add text labels for each data point
    donutChart.selectAll("text")
        .data(pie(dataSource.datasets[0].data))
        .join("text")
        .text(function (d, i) {
            console.log(dataSource.labels[i], ":", dataSource.datasets[0].data[i]); // print all data
            return dataSource.labels[i] + ":" + dataSource.datasets[0].data[i] + " ";
        });
    */    

    // Add a central text element to display additional information
    donutChart.selectAll("#center-text").data([0]).enter()
        .append("text")
        .attr("id", "center-text")
        .text(" Hover over slices ");   
        
    // Handle mouseover and mouseout events for interactivity
    paths.on("mouseover", function (event, d, i) {
        console.log("Mouseover - d:", d); // index of the corresponding object
        d3.select(this)
            .transition()
            .duration(300)
            .attr("d", d3.arc().innerRadius(95).outerRadius(190))
            .style("opacity", 0.8);

    // Update central text with detailed information
        donutChart.select("#center-text")
            .text(dataSource.labels[d] + ": $" + dataSource.datasets[0].data[d])
            .style("color", dataSource.datasets[0].backgroundColor[d]);
        console.log(dataSource.labels[d] + ":" + dataSource.datasets[0].data[d]);
    }).on("mouseout", function () {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc) // Revert to the original arc
            .style("opacity", 1.0)
        // Clear the central text
        donutChart.select("#center-text").text(" Hover over slices ").style("color", "#852dbf");
    });        

}

getBudget();
