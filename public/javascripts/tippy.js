

function signIn() {
    OAuth.initialize('SmThmY15olmUlwfrGWkbdZX7n-M')
    OAuth.popup('twitter').done(function(result) {
        console.log(result);
        result.me().done(function(data) {
            console.log("ME " + JSON.stringify(data));

            // twitterId = id_str
            // do something with `data`, e.g. print data.name
        });
    });
}
