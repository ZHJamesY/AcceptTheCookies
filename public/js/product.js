var cookieList

$(document).ready(function() {
    // Imports cookies.json for products page
    fetch('cookies.json')
    .then((resp) => resp.json())
    .then(function(data) {
        cookieList = data.cookies;
        // Go over each cookie in the JSON data and create a product element for it
        cookieList.forEach(cookie => {
            var eachProduct = `<div class="col">
                                    <div class="h-100">
                                        <div onclick="addToCart(event)" style="position: relative; z-index: 1">
                                            <img src="${cookie.image}" class="card-img-top ${cookie.name}">
                                            <div class="text-overlay" style="position: absolute; top: 43%; left:26%; z-index: 3; font-size: x-large">Add To Cart</div>
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title">${cookie.name}</h5>
                                            <p class="card-text">$${cookie.price.toFixed(2)} per Dozen</p>
                                            <p class="card-text">Quantity Available: ${cookie.quantity}</p>
                                        </div>
                                    </div>
                                </div>`;

            $("#cookies-container").append(eachProduct);
        });

        // Modifies products page based on filter buttons
        $("#filter-section button").click(function() {
            // Gets the value from the filters
            let nameFilter = $("#name").val().toLowerCase();
            let under15Filter = $("#under15").prop("checked");
            let under20Filter = $("#under20").prop("checked");
            let under25Filter = $("#under25").prop("checked");
            let chocolateFilter = $("#chocolate").prop("checked");
            let sugarFilter = $("#sugar").prop("checked");
            let nutsFilter = $("#nuts").prop("checked");
            let oatmealFilter = $("#oatmeal").prop("checked");
            let spicesFilter = $("#spices").prop("checked");
            let specialFilter = $("#special").prop("checked");
            let celebrationFilter = $("#celebration").prop("checked");
            let nutFreeFilter = $("#nut-free").prop("checked");
            let glutenFreeFilter = $("#gluten-free").prop("checked");
            let veganFilter = $("#vegan").prop("checked");

            // Filters the cookie list using the filters
            let filteredCookies = cookieList.filter(cookie => {
                // Name Filter
                let isNameFiltered = cookie.name.toLowerCase().includes(nameFilter);

                // Price Filters
                let isPriceFiltered = true;
                if (under15Filter || under20Filter || under25Filter) { // Checks to make sure there are filters
                    isPriceFiltered = false;
                    if (under15Filter && cookie.price < 15) {
                        isPriceFiltered = true;
                    } else if (under20Filter && cookie.price < 20) {
                        isPriceFiltered = true;
                    } else if (under25Filter && cookie.price < 25) {
                        isPriceFiltered = true;
                    }
                }

                // Flavour Filters
                let isFlavourFiltered = true;
                if (chocolateFilter || sugarFilter || nutsFilter || oatmealFilter || spicesFilter || specialFilter || celebrationFilter) { // Checks to make sure there are filters
                    isFlavourFiltered = false;
                    if (chocolateFilter && cookie.flavour.includes("Chocolate")) {
                        isFlavourFiltered = true;
                    } else if (sugarFilter && cookie.flavour.includes("Sugar")) {
                        isFlavourFiltered = true;
                    } else if (nutsFilter && cookie.flavour.includes("Nuts")) {
                        isFlavourFiltered = true;
                    } else if (oatmealFilter && cookie.flavour.includes("Oatmeal")) {
                        isFlavourFiltered = true;
                    } else if (spicesFilter && cookie.flavour.includes("Spices")) {
                        isFlavourFiltered = true;
                    } else if (specialFilter && cookie.flavour.includes("Special")) {
                        isFlavourFiltered = true;
                    } else if (celebrationFilter && cookie.flavour.includes("Celebration")) {
                        isFlavourFiltered = true;
                    }
                }

                // Restrictions Filters
                let isRestrictionFiltered = true;
                if (nutFreeFilter || glutenFreeFilter || veganFilter) { // Checks to make sure there are filters
                    isRestrictionFiltered = false;
                    if (nutFreeFilter && cookie.restrictions.includes("Nut-Free")) {
                        isRestrictionFiltered = true;
                    }
                    else if (glutenFreeFilter && cookie.restrictions.includes("Gluten-Free")) {
                        isRestrictionFiltered = true;
                    }
                    else if (veganFilter && cookie.restrictions.includes("Vegan")) {
                        isRestrictionFiltered = true;
                    }
                }

                return isNameFiltered && isPriceFiltered && isFlavourFiltered && isRestrictionFiltered;
            });

            // Removes all products displayed and displays the filtered ones
            $("#cookies-container").empty();
            
            // If filters don't have any available cookies, then the user gets told about it
            if (filteredCookies.length === 0) {
                $("#cookies-container").html("<p>No cookies based on these filters :(</p>");
            }
            else {
                filteredCookies.forEach(cookie => {
                    var eachProduct =  `<div class="col">
                                            <div class="h-100">
                                                <div onclick="addToCart(event)" style="position: relative; z-index: 1">
                                                    <img src="${cookie.image}" class="card-img-top ${cookie.name}">
                                                    <div class="text-overlay" style="position: absolute; top: 43%; left:26%; z-index: 3; font-size: x-large">Add To Cart</div>
                                                </div>
                                                <div class="card-body">
                                                    <h5 class="card-title">${cookie.name}</h5>
                                                    <p class="card-text">$${cookie.price.toFixed(2)} per Dozen</p>
                                                </div>
                                            </div>
                                        </div>`;

                    $("#cookies-container").append(eachProduct);
                });
            }
        });
    })
    .catch(function(error) {
        // Error Handling
        console.log(error);
    });

    $('#filter-toggle').click(function() {
        // Hides/Shows the filter section when button is pressed
        $('#filter-section').toggleClass('d-none');

        //Changes the name of the button so user still knows what it does
        if ($('#filter-section').hasClass('d-none')) {
            $('#filter-toggle').html('Show Filters');
        }
        else {
            $('#filter-toggle').html('Hide Filters');
        }
    });
});

function addToCart(event){
    console.log((event.target.className).substring(13,999))
    let cookiename = (event.target.className).substring(13,999)
    for(i in cookieList){
        if(cookieList[i].name == cookiename){
            console.log(cookieList[i])
        }
    }
}