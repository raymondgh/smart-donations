
$(document).ready(function() {
    $("#tippySigninTwitter").click(function () {
        signIn();
    });
});

function signIn() {
    OAuth.initialize('SmThmY15olmUlwfrGWkbdZX7n-M');
    OAuth.popup('twitter').done(function(result) {
        console.log(result);
        result.me().done(function(data) {
            console.log("ME " + JSON.stringify(data));
            var twitterId = data["raw"]["id"];
            $("#tippyNinjaDonate").attr("twitter-id", twitterId);
            var url = '/updateHoursWorked';
            var hoursWorked = $("#hoursWorked").val();
            var obj = {
                twitterId: twitterId,
                hoursWorked: hoursWorked
            };

            $.ajax({
                type: "POST",
                url: url,
                data: obj,
                success: function(data) {
                    console.log("updateHoursWorked success");
                    $("#twitter-signin").hide();
                    $("#code").show();
                    $(".payment-container").show();
                    showCode(twitterId);
                    listDonation(data);
                },
                error: function(error) {
                    console.log("updateHoursWorked error");
                }
            });

        });
    });
}

function listDonation(data) {
    data = jQuery.parseJSON(data);
    var totalHours = data.hoursWorked;
    var totalCash = (data.totalEarned*100);
    var payments = data.payments;
    var rate = 0;
    if ( totalCash > 0 ) {
        rate = ((totalCash*100)/totalHours).toFixed(2);
    }

    $("#payment-summary").text("Hours: " + totalHours + " Donations: $" + totalCash + " Wage: $" + rate);
    $("#cashout-button").text("Cash out $" + totalCash);

    var paymentsDiv = $("#payments");
    paymentsDiv.empty();
    for ( var i = 0; i < payments.length; i++ ) {
        var payment = payments[i];
        var time = payment.time;
        var amount = payment.amount / 100;
    }
}

function showCode(twitterId) {

    var tippyNinJaDonateButton = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">\
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">\
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>\
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>\
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>\
    <script type="text/javascript" src="https://www.simplify.com/commerce/v1/simplify.js"></script>\
    <script type="text/javascript" src="https://tippyninja.azurewebsites.net/javascripts/tippy-ninja.js"></script>\
    <div class="tippyNinjaButtonPanel">\
        <div class="btn-left col-md-7">\
        <button type="button"\
        data-toggle="popover"\
        id="tippyNinjaHourRate"\
        class="btn donate-left"\
        style="width: 100%;"\
        data-content="Hours Worked">\
        </button>\
        </div>\
    <div class="btn-right col-md-5">\
        <button\
        id="tippyNinjaDonate"\
        class="btn donation-right"\
        twitter-id="148966800"\
        data-toggle="modal" data-target="#paymentModal">\
        DONATE\
        </button>\
    </div>\
    </div>\
<div class="modal fade" id="paymentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
    <div class="modal-dialog">\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
                <h4 class="modal-title" id="myModalLabel">Make donation</h4>\
            </div>\
            <form id="simplify-payment-form" action="/processPayment" method="POST">\
                <div class="modal-body">\
                    <div class="form-group">\
                        <label>Donation Amount: </label>\
                        <input id="donationAmount" type="text"\
                        class="form-control"\
                        value="" autofocus />\
                    </div>\
                    <div class="form-group">\
                        <label>Credit Card Number: </label>\
                        <input id="cc-number" type="text"\
                        class="form-control"\
                        maxlength="20" autocomplete="off" value="" autofocus />\
                    </div>\
                    <div class="form-group">\
                        <label>CVC: </label>\
                        <input id="cc-cvc" type="text"\
                        class="form-control"\
                        maxlength="4" autocomplete="off" value=""/>\
                    </div>\
                    <div class="form-group ">\
                        <label>Expiry Date: </label>\
                        <select id="cc-exp-month" class="form-control">\
                            <option value="01">Jan</option>\
                            <option value="02">Feb</option>\
                            <option value="03">Mar</option>\
                            <option value="04">Apr</option>\
                            <option value="05">May</option>\
                            <option value="06">Jun</option>\
                            <option value="07">Jul</option>\
                            <option value="08">Aug</option>\
                            <option value="09">Sep</option>\
                            <option value="10">Oct</option>\
                            <option value="11">Nov</option>\
                            <option value="12">Dec</option>\
                        </select>\
                        <select id="cc-exp-year" class="form-control">\
                            <option value="13">2013</option>\
                            <option value="14">2014</option>\
                            <option value="15">2015</option>\
                            <option value="16">2016</option>\
                            <option value="17">2017</option>\
                            <option value="18">2018</option>\
                            <option value="19">2019</option>\
                            <option value="20">2020</option>\
                            <option value="21">2021</option>\
                            <option value="22">2022</option>\
                        </select>\
                    </div>\
                </div>\
                <div class="modal-footer">\
                    <button\
                    type="button"\
                    class="btn btn-default"\
                    data-dismiss="modal">Close</button>\
                    <button\
                    id="process-payment-btn"\
                    type="submit"\
                    class="btn btn-primary">Donate</button>\
                </div>\
            </form>\
        </div>\
    </div>\
</div>';
    $("#code").text(tippyNinJaDonateButton);
}