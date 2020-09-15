// create the function to get the data
function getInfo(id) {
    // read the json file to get data
    d3.json("data/samples.json").then((data) => {

        var metadata = data.metadata;

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel to put data
        var demoPanel = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demoPanel.html("");

        // grab the necessary demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demoPanel.append("h6").text(key[0].toUpperCase() + ":" + key[1]);
        });
    });
}

function PlotChart(id) {

    // get the data with d3
    d3.json("data/samples.json").then((data) => {

        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];

        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        // get only top 10 sample values to plot and reverse for the plotly
        var sample_values = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu ids for the plot
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's to the desired form for the plot
        var otu_ids = idValues.map(d => "OTU " + d);

        // get the top 10 labels for the plot
        var otu_labels = samples.otu_labels.slice(0, 10);


        // create the trace for the bar chart 
        var trace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            marker: {
            color: '#ffa500'},
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // set the layout for the bar chart 
        var layout = {
            title: "Top 10 OTUs",
            yaxis: {
                tickmode: "linear",
            }
        };

        // create the bar chart 
        Plotly.newPlot("bar", data, layout);

        

        // create the trace for the gauge chart
        var data2 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: "Belly Button Washing Frequency<br>Scrubs per Week" ,
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 5 },
            gauge: {
                axis: { range: [null, 10] },
                steps: [
                    { range: [0, 10], color: "lightgray" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 5
                }
            }
        }];

        // set the layout for the gauge chart
        var layout = { width: 600, 
            height: 600, 
            margin: { t: 0, b: 0 } };

        // create gauge chart
        Plotly.newPlot('gauge', data2, layout);

        // create the trace for the bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };
       // create the data variable 
        var data1 = [trace1];

        // set the layout for the bubble chart
        var layout = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // create the bubble chart
        Plotly.newPlot("bubble", data1, layout);
    });
}


// create the function for the change event
function optionChanged(id) {
    PlotChart(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // populate dropdown menu
    d3.json("data/samples.json").then((data) => {
        console.log(data)
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Use the first subject ID from the names to build initial plots
        const firstname = data.names[0];
        PlotChart(firstname);
        getInfo(firstname);
    });
}

init();

