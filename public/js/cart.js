$(document).ready(function(){
    console.log("Running")
    renderCart()
})

/* THIS IS HOW EACH ROW LOOKS
<tr>
    <td><img class="itemIcon" src="./images/samplecookie1.jpg"></td>
    <td>Name <br> Price</td>
    <td>Qty</td>
    <td><a href="#"><i class="fa-solid fa-trash-can"></i></a></td>
</tr>
*/
var subtotal = 0.0

function renderCart(){
    fetch('cart.json')
        .then(response => response.json())
        .then(function(data){
            for(var i=0; i<data.length; i++){
                var row =   `<tr>
                                <td><img class="itemIcon" src="./${data[i].image}"></td>
                                <td>${data[i].name} <br> ${data[i].price}</td>
                                <td>${data[i].quantity}</td>
                                <td><a href="#"><i class="fa-solid fa-trash-can"></i></a></td>
                            </tr>`
                $('#cart-table').append(row)
                subtotal += data[i].price
            }
        })
        .then(function(){
            console.log(subtotal)
            var tax = (subtotal*0.13).toFixed(2)
            var total = parseFloat(subtotal) + parseFloat(tax) + 10
            $('#subtotal').html(subtotal)
            $('#gst').html(tax)
            $('#shipping').html('10.00')
            $('#total').html(total)
        })
}