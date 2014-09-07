var twitterId = null;
$(document).ready(function() {
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
        var donationAmount = $("#donationAmount").val() * 100;
        // Insert the token into the form so it gets submitted to the server
        $paymentForm.append("<input type='hidden' name='simplifyToken' value='" + token + "' />");
        $paymentForm.append("<input type='hidden' name='twitterId' value='" + twitterId + "' />");
        $paymentForm.append("<input type='hidden' name='amount' value='" + donationAmount + "' />");
        // Submit the form to the server
        $paymentForm.get(0).submit();
    }
}


function signIn() {
    OAuth.initialize('SmThmY15olmUlwfrGWkbdZX7n-M')
    OAuth.popup('twitter').done(function(result) {
        console.log(result);
        result.me().done(function(data) {
            console.log("ME " + JSON.stringify(data));
            twitterId = data.id;
            // twitterId = id_str
            // do something with `data`, e.g. print data.name
        });
    });
}
