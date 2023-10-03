$(document).ready(function(){
    
})
// Function that saves the inputted data from the customer 
function saveRecord(){
    // Regex for validation of an email 
    let validEmail = /^\w*(@)[a-zA-Z]*((\.)[a-zA-Z]{2,3})+$/;
    // Regex for validation of phone number
    let validPhone = /^\([0-9]{3}\)\-[0-9]{3}\-[0-9]{4}$/;
    // getting the user's inputs 
    let email = $("#emailInput").val();
    let phone = $("#phoneNumberInput").val();
    let name = $("#nameInput").val();
    let message = $("#messageInput").val();
    let purpose = $("#purposeSelect").val();
    // checks whether email and phone number are invalid 
    if(!email.match(validEmail) && !phone.match(validPhone)){
        console.log("Not a valid email");
        // adds warning about email input if warning not already seen 
        if(!$("#emailTitle").html().includes("warning")){
            $("#emailTitle").append("<div class=\"warning\" style=\"display:inline\"> Make sure your input is in the correct format</div>");
            $("#emailTitle").css("background-color", "red");
        }
        console.log("Not a valid phone number");
        // adds warning about phone number input if warning not already seen 
        if(!$("#phoneNumberTitle").html().includes("warning")){
            $("#phoneNumberTitle").append("<div class=\"warning\" style=\"display:inline\"> Make sure your input is in the correct format</div>");
            $("#phoneNumberTitle").css("background-color", "red");
        }
    }
    // checks if only phone number is valid 
    else if(!email.match(validEmail) && phone.match(validPhone)){
        // resets phone number input title to regular 
        $("#phoneNumberTitle").css("background-color", "#FFE6D6");
        $("#phoneNumberTitle .warning").remove();
        // adds warning about email input if warning not already seen 
        if(!$("#emailTitle").html().includes("warning")){
            $("#emailTitle").append("<div class=\"warning\" style=\"display:inline\"> Make sure your input is in the correct format</div>");
            $("#emailTitle").css("background-color", "red");
        }
    }
    // checks if only email is valid 
    else if(email.match(validEmail) && !phone.match(validPhone)){
        // resets email input title to regular
        $("#emailTitle").css("background-color", "#FFE6D6");
        $("#emailTitle .warning").remove();
        // adds warning about phone number input if warning not already seen 
        if(!$("#phoneNumberTitle").html().includes("warning")){
            $("#phoneNumberTitle").append("<div class=\"warning\" style=\"display:inline\"> Make sure your input is in the correct format</div>");
            $("#phoneNumberTitle").css("background-color", "red");
        }
    }
    else if(phone.match(validPhone) && email.match(validEmail)){
        console.log("Valid phone number");
        // resets both input if have warnings 
        $("#emailTitle").css("background-color", "#FFE6D6");
        $("#phoneNumberTitle").css("background-color", "#FFE6D6");
        // remove warnings 
        $(".warning").html("");
        // create JSON request with user input data 
        let request = {"name":name, "email":email, "phoneNumber":phone, "purpose":purpose, "message":message};
        // converts JSON request into a JSON string 
        let jsonString = JSON.stringify(request);
        console.log(jsonString);
        // allows user to download a copy of their responses 
        let userData = "text/json;charset=UTF-8," + encodeURIComponent(jsonString);
        let jsonDownloadLink = $('<a href="data:' + userData + '" download="userEntry.json">download JSON</a>');
        let jsonDownload = $("#jsonDownload");
        jsonDownload.append(jsonDownloadLink);
        // clears all the inputs of the information inputted by the user 
        $("#emailInput").val("");
        $("#phoneNumberInput").val("");
        $("#nameInput").val("");
        $("#messageInput").val("");
    }
}


