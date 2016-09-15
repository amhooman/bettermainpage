// Important: keep the number of quotes and greetings the same
var quotes = ["If you are depressed you are living in the past. If you are anxious you are living in the future. If you are at peace you are living in the present.", "Madness, as you know, is a lot like gravity, all it takes is a little push.", "The surest way to corrupt a youth is to instruct him to hold in higher esteem those who think alike than those who think differently.", "Life has many ways of testing a person's will, either by having nothing happen at all or by having everything happen all at once.", "There is no excellent beauty that hath not some strangeness in its proportions.", "Children are fantastic little creatures, because next to drunk people, they are the only truly honest people on earth.", "I begin with an idea, and then it becomes something else.", "Be who you are and say what you feel because those who mind don't matter and those who matter don't mind.", "You can make more friends in two months by becoming interested in other people than you can in two years by trying to get people interested in you.", "An essential aspect of creativity is not being afraid to fail.", "Antisocial behavior is a trait of intelligence in a world of conformists.", "What you do today can improve all your tomorrows.", "A creative man is motivated by the desire to achieve, not by the desire to beat others.", "Don't watch the clock; do what it does. Keep going.", "If you can dream it, you can do it.", "You can't build a reputation on what you're going to do."];
var quoted = ["Lao Tzu", "Joker", "Friedrich Nietzsche", "Paulo Coelho", "Sir Francis Bacon", "Mads Nipper", "Pablo Picasso", "Dr. Seuss", "Dale Carnegie", "Edwin Land", "Nikola Tesla", "Ralph Marston", "Ayn Rand", "Sam Levenson", "Walt Disney", "Henry Ford"];
var greets = ["Hello", "Howdy", "Yo", "Sup", "Wazzup", "Salutations", "Hey", "Hi", "Greetings", "Aloha", "Namaste", "Hiya", "Yello", "Holla", "Peace"];

// Finds current time and date, formats it properly
function startTime() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    var now = new Date();
    var hour = now.getHours();
    var mins = now.getMinutes();
    var secs = now.getSeconds();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    var date = now.getDate();
    var day = dayNames[now.getDay()];
    var month = monthNames[now.getMonth()];
    var year = now.getFullYear();
    hour = hour % 12;
    hour = hour ? hour : 12;
    mins = mins < 10 ? '0' + mins : mins;
    secs = secs < 10 ? '0' + secs : secs;
    document.getElementById('time').innerHTML = hour + ':' + mins + ':' + secs + ' ' + ampm;
    document.getElementById('date').innerHTML = day + ' ' + month + ' ' + date + ', ' + year;
    var t = setTimeout(startTime, 500);
}

// Gets weather for requested location, appends to page
function getWeather(location) {
    $.simpleWeather({
        location: location,
        unit: 'c',
        success: function(weather) {
            $('.weather').html('In ' + weather.city + ', ' + weather.region + ', the weather is ' + weather.currently + ', the temperature is ' + weather.temp + '&deg;, and the wind is ' + weather.wind.speed + weather.units.speed + ' <span class="no-transform">' + weather.wind.direction + '</span>');
            $('.weatherlink').html('<a href="' + weather.link + '">More details (w)</a>');
        },
        error: function(error) {
            $('.weather').html('Sorry, ' + error);
        }
    });
}

// Geolocates the user, otherwise defaulting to Pittsburgh (2473224)
function geolocWeather() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            getWeather(position.coords.latitude + ',' + position.coords.longitude);
        }, getWeather(2473224), {
            timeout: 5000
        });
    } else {
        getWeather(2473224);
    }
}

// Master loading function; appends random greeting, quote, and weather
function loadStuff() {
    var randNum = Math.floor((Math.random() * greets.length));
    $('.greeting').html(greets[randNum]);
    $('.quote').html('&ldquo;' + quotes[randNum] + '&rdquo; &mdash; ' + '<cite><small>' + quoted[randNum] + '</small></cite>');
    geolocWeather();
}

// Initializes keyboard nav
function bindMousetraps() {
    $.each($('.parent'), function(i, val) {
        Mousetrap.bind($(val).attr('data-key'), function(e) {
            $('a#' + $(val).attr('id')).toggleClass('active').next().slideToggle(150);
            $.each($(val).parent().find('.tab'), function(i, val) {
                Mousetrap.bind($(val).attr('data-key'), function(e) {
                    window.location.href = $(val).attr('href');
                });
            });
            Mousetrap.bind($(val).attr('data-key'), function(e) {
                resetMousetraps();
            });
        });
    });
    // Resets on ESC
    Mousetrap.bind('esc', function(e) {
        resetMousetraps();
    });
    // Resets and refreshes with spacebar, TODO: change background image too
    Mousetrap.bind('space', function(e) {
        resetMousetraps();
        geolocWeather();

        // This technically works, but the browser caches the response, keeping the same image :(
        // $('body').css('background', "url('https://source.unsplash.com/collection/292287/') no-repeat center/cover fixed");
    });
    // Binds Weather and GitHub links
    Mousetrap.bind('w', function(e) {
        window.location.href = $('.weatherlink').children().attr('href');
    });
    Mousetrap.bind('g', function(e) {
        window.location.href = $('.github').children().attr('href');
    });
}

// Closes cells, rebinds keyboard shortcuts
function resetMousetraps() {
    $('.subMenu').slideUp(150);
    $('li a').removeClass('active');
    Mousetrap.reset();
    bindMousetraps();
}

// Initializes everything on page load
$(function() {
    startTime();
    loadStuff();
    bindMousetraps();
    // Binds click events for opening tabs and background click to close
    $('li a.parent').click(function() {
        $(this).parent('li').find('ul').slideToggle(150);
        $(this).toggleClass('active');
    });
    $('#background').click(function() {
        resetMousetraps();
    });
});
