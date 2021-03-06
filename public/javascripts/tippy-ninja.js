
$(document).ready(function() {
    getHourRate();
    $("#simplify-payment-form").on("submit", function() {
        // Disable the submit button
        $("#process-payment-btn").attr("disabled", "disabled");
        // Generate a card token & handle the response
        SimplifyCommerce.generateToken({
            key: "sbpb_ZDNiZjZhN2MtOWUzNS00NmI0LTkzYjYtN2YyOTkyZDlkYjFj",
            card: {
                number: $("#cc-number").val(),
                cvc: $("#cc-cvc").val(),
                expMonth: $("#cc-exp-month").val(),
                expYear: $("#cc-exp-year").val()
            }
        }, simplifyResponseHandler);
        return false;
    });
});

function getHourRate() {
    var twitterId = $("#tippyNinjaDonate").attr("twitter-id");
    var url = "/getUserInfo/" + twitterId;
    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            data = jQuery.parseJSON(data);
            console.log("getUserInfo success: " + JSON.stringify(data));
            var totalHours = data.hoursWorked;
            var totalCash = data.totalEarned;
            console.log("totalHours " + totalHours);
            console.log("totalCash " + totalCash);
            var rate = 0;
            if ( totalCash > 0 ) {
                rate = ((totalCash/100)/totalHours).toFixed(2);
            }
            $('#tippyNinjaHourRate').text("$" + rate + " / Hour");
            $('#tippyNinjaHourRate').attr("data-content", totalHours  + "Hours Worked");
        },
        error: function(error) {
            console.log("getUserInfo error: " + JSON.stringify(error));
            $('#tippyNinjaHourRate').text("$0 / Hour");
        }
    });
}

function simplifyResponseHandler(data) {
    console.log("SimplifyResponseHandler " + JSON.stringify(data));
    var $paymentForm = $("#simplify-payment-form");
    // Remove all previous errors
    $(".error").remove();
    // Check for errors
    if (data.error) {
        // Show any validation errors
        if (data.error.code == "validation") {
            var fieldErrors = data.error.fieldErrors,
                fieldErrorsLength = fieldErrors.length,
                errorList = "";
            for (var i = 0; i < fieldErrorsLength; i++) {
                errorList += "<div class='error'>Field: '" + fieldErrors[i].field +
                    "' is invalid - " + fieldErrors[i].message + "</div>";
            }
            // Display the errors
            $paymentForm.after(errorList);
        }
        // Re-enable the submit button
        $("#process-payment-btn").removeAttr("disabled");
    } else {
        // The token contains id, last4, and card type
        var token = data["id"];
        processPayment(token);
    }
}

function processPayment(simplifyToken) {
    var $paymentForm = $("#simplify-payment-form");
    var donationAmount = $("#donationAmount").val() * 100;
    var url = "/processPayment";
    var twitterId = $("#tippyNinjaDonate").attr("twitter-id");
    var obj = {
        'simplifyToken' : simplifyToken,
        'twitterId'     : twitterId,
        'amount'        : donationAmount
    };
    console.log("Submitting form to our server" + JSON.stringify(obj) );
    $.ajax({
        type: "POST",
        url: url,
        data: obj,
        success: function(data) {
            console.log("processPayment success");
            alert("Thank you for your donation!");
            $('#paymentModal').modal('hide');
            getHourRate();

            setTimeout(function(){
                $('#tippyNinjaHourRate').animate({
                        backgroundColor:'rgba(0, 150, 0, 0.3)'},
                    function(){$('#tippyNinjaHourRate').css({
                        '-webkit-box-shadow': '0px 0px 5px 5px rgba(0, 150, 0, 0.3)',
                        'box-shadow': '0px 0px 5px 5px rgba(0, 150, 0, 0.3)'
                    });
                    });
            },500);
            setTimeout(function(){
                $('#tippyNinjaHourRate').animate({
                        backgroundColor:'rgba(0, 150, 0, 0.0)'},
                    function(){$('#tippyNinjaHourRate').css({
                        '-webkit-box-shadow': '0px 0px 5px 5px rgba(0, 150, 0, 0.0)',
                        'box-shadow': '0px 0px 5px 5px rgba(0, 150, 0, 0.0)'
                    });
                    });
            },1200);
        },
        error: function(error) {
            console.log("processPayment error");
            $paymentForm.after(error);
        }
    });
}