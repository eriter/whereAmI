(function() {
    var geoLocationBust = function() {
        alert("We ain't sure where yer at");
    };

    if (!navigator.geolocation || !document.querySelector) {
        geoLocationBust();
    }
    else {
        navigator.geolocation.getCurrentPosition(
            function(p) {
                document.querySelector("[name='latitude']").value = p.coords.latitude;
                document.querySelector("[name='longitude']").value = p.coords.longitude;
                document.querySelector("[type='submit']").removeAttribute("disabled");
            },
            function(err) {
                geoLocationBust();
            }
        );
    }
})();
