
jQuery(document).ready(function ($) {

    function locateOnMap(lat, lng) {

        // first delete the current map if it existed
        $('#map').remove();
        
        // create the div for map
        $('#map-wrapper').append(`<div id="map"></div>`);

        var map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var locationIcon = L.icon({
            iconUrl: '/images/icon-location.svg',
            iconSize: [32, 60],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            // shadowUrl: 'my-icon-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        });

        var marker = L.marker([lat, lng], {icon: locationIcon}).addTo(map);
    }


    function isIpValid(value) {
        // Using Regex expression for validating IPv4
        var ipAddressRegex =
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

        return ipAddressRegex.test(value);
    }

    function isDomainValid(value) {
        // Using Regex expression for validating domain
        var domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
        return domainRegex.test(value);
    }

    function getLocation(ip, domain) {
        var api_key = "at_YikWy1eQ7qFpUGSOJrsVaxqITYXci";

        $.ajax({
            url: "https://geo.ipify.org/api/v1",
            data: { apiKey: api_key, ipAddress: ip, domain: domain },
            success: function (data) {
                // $("body").append("<pre>"+ JSON.stringify(data,"",2)+"</pre>");

                ipStr = data['ip'];
                locationStr = data['location']['country'] + ', ' + data['location']['region'] + ', ' + data['location']['city'] + data['location']['postalCode']
                timeZoneStr = 'UTC' + data['location']['timezone'];
                ispStr = data['isp'];

                $('#ip-value').html(ipStr);
                $('#location-value').html(locationStr);
                $('#timezone-value').html(timeZoneStr);
                $('#isp-value').html(ispStr);

                locateOnMap(data['location']['lat'], data['location']['lng']);

            },
            error: function (xhr) {
                alert('An error occured, Please try again later');
            }
        });
    }

    var ip = null;
    var domain = null;
    
    $(':text').bind('keydown',function(e){ //on keydown for all textboxes  
        if(e.keyCode==13) //if this is enter key  
            e.preventDefault();                  
    });  

    // On page load set map to user's location
    getLocation('192.212.174.101');
    // locateOnMap(51.505, -0.09);

    
    $("#js-btn").click(function () {
        var ipOrDomain = $("#js-input").val();

        if (isIpValid(ipOrDomain)) {
            ip = ipOrDomain;
            getLocation(ip, domain);

        } else if (isDomainValid(ipOrDomain)) {
            domain = ipOrDomain;
            getLocation(ip, domain);

        } else {
            alert('Please enter a valid domain or IP adress.');
        }

    });

});