let pollingData;
let total=0;
$(document).ready(function(){
    // retrieves JSON open data from Government of Canada API
    $.ajax({
        type: "GET",
        url: "https://open.canada.ca/data/api/action/package_show?id=0bfdacb3-12fd-40e7-820b-87f269e9f191",
        dataType: "JSON",
        success: function(response){
            // adds the title of the Canadian Government article to the poll page 
            let article = response.result;
            console.log(article.title);
            let articles_contact = $("#articles");
            let ul = $("<ul>");
            let li = $("<li>");
            let a = $("<a>");
            // wraps link in <li> and <ul> tags to display article title as a list 
            // adds the link to the article in the article title 
            a.attr("href","https://www.canada.ca/en/health-canada/services/food-nutrition/genetically-modified-foods-other-novel-foods/approved-products/novel-food-information-biscuits-leclerc-praeventia-cookies-wine-extract.html")
            a.append(article.title);
            li.append(a);
            ul.append(li);
            articles_contact.append(ul);
        }
    })
})
$.getJSON("./poll.json", function (data) {
	// pulls data from poll.json: formats the data and creates a pie chart using the data 
    pollingData = data;
    formatData();
    pieChartMaker();
})
function formatData(){
    // converts number of votes into a percentage
    let yesVotes = pollingData[0].votes;
    let noVotes = pollingData[1].votes;
    let unsureVotes = pollingData[2].votes;
    // gets the total number of votes 
    for(let i = 0; i<pollingData.length;i++)
    {
        total += pollingData[i].votes;
    }
    // calculates the percentage of type of vote
    let yesPercent = yesVotes/total;
    let noPercent = noVotes/total;
    let unsurePercent = unsureVotes/total;
    // adds percentages to the retrieved polling data JSON map 
    pollingData[0]["percent"] = yesPercent*100;
    pollingData[1]["percent"] = noPercent*100;
    pollingData[2]["percent"] = unsurePercent*100;
}
function addYes(){
    // adds a yes vote to the polling data 
    pollingData[0].votes += 1;
    // recalculates the percentages and adjusts the pie chart 
    formatData();
    pieChartMaker();
}
function addNo(){
    // adds a no vote to the polling data 
    pollingData[1].votes += 1;
    // recalculates the percentages and adjusts the pie chart
    formatData();
    pieChartMaker();
}
function addUnsure(){
    // adds an unsure/Don't Know vote to the polling data 
    pollingData[2].votes += 1;
    // recalculates the percentages and adjusts the pie chart
    formatData();
    pieChartMaker();
}
function pieChartMaker() {
    // function to create the piechart 
    // adds the dimensions of the svg and chart 
    let svg = d3.select("#pieChart"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        margin = 50,
        radius = Math.min(width,height)/2 - margin;
    // pulls the data from the js that will be used to make the pie chart 
    let data = pollingData;      
    // adds a group element to the svg 
    let g = svg.append("g")
               .attr("transform", `translate(${width/2},${height/2})`);
    // determines the colour scale for the pie chart 
    let colourScale = d3.scaleOrdinal()
                        .domain(data)
                        .range(["#90ee90","#fa7f72","#d3e0ea"]);
    // gets the pie chart data as the percent data from the polling data 
    let pie = d3.pie().value(function(d){
        return d.percent;
    });
    // creates and arc that allows for each wedge to be drawn
    let arc = g.selectAll("arc")
               .data(pie(data))
               .enter();
    // determines the size of the pie chart's inner and outer radius 
    let section = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(50);
    // adds the colour fill to the pie chart 
    arc.append("path")
       .attr("d", section)
       .attr("fill", function(d){
            return colourScale(d.data.choice);
       });
    // creates labels for pie chart and determines location
    let label = d3.arc()
                  .outerRadius(radius)
                  .innerRadius(radius-150);
    // adds labels to the pie chart and determines the label's styling 
    arc.append("text")
       .attr("transform", function(d){
            return `translate(${label.centroid(d)})`;
       })
       .text(function(d){
            return d.data.choice;
       })
       .style("font-size", 15)
       .style("text-anchor", "middle")
       .attr("dy", ".35em");
}
// creates a Vue app to allow for dynamic viewing of stats 
const app = Vue.createApp({
    computed : {
        // sample data for the cookies and sales numbers 
        originalCookieData() {
        return [
            {cookie: 'M&M', sales:693},
            {cookie: 'Snickerdoodle', sales:240},
            {cookie: 'Macademia Nut', sales:512},
            {cookie: 'Double Chocolate', sales:454},
            {cookie: 'Christmas', sales:361},
            {cookie: 'Oatmeal', sales:482},
            {cookie: 'Ginger', sales:410},
            {cookie: 'Easter', sales:286},
            {cookie: 'Brown Sugar', sales:378},
            {cookie: 'Chocolate Chip', sales:824},
            {cookie: 'Birthday Cake', sales:517},
            {cookie: 'Chocolate Dip', sales:389},
        ];  
        }
    },
    data() {
      return {
        // initializes sorted cookie data variable to hold sorted cookies 
        sortedCookieData: [],
        showTable: true
      }
    },
    mounted(){
        // adds value of cookie data to sort cookie data variable
        this.sortedCookieData = this.originalCookieData;
        console.log(this.sortedCookieData);
    },
    methods: {
        toggleTable() {
            // toggle for showing and not showing a table 
            this.showTable = !this.showTable;
        },
        orderCookieNums(type){
            // determines how the table will be ordered 
            if(type == 'cookie')
            {
                // orders based on alphabetical order of cookie names
                this.sortedCookieData.sort((x,y) => (x[type] < y[type] ? -1 : 1));
            }
            else{
                // orders based on cookie sales numbers: most sales to least sales 
                this.sortedCookieData.sort((x,y) => (x[type] > y[type] ? -1 : 1));
            }
        },
        orderedCookies(type){
            // returns the sorted cookie data based on variable entered 
            return this.sortedCookieData.sort((x,y) => (x[type] > y[type] ? -1 : 1));
        }
      }
  }).mount('#app')