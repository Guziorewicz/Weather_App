
// zdefiniuj zmienne lokalizacji oraz stałą apiKey która umożliwia pobieranie danych pogodowych ze strony "openweathermap"
let lat;
let long;
const apiKey = "a1b39a1582387d23523a6a4475ae600d";


// stwórz funkcję uruchamiającą się po włączeniu skryptu
function startApp(){

// sprawdzanie geolokacji - jeśli istnieje wykonaj blok kodu
    if(navigator.geolocation) {

// użyj funkcji getCurrentPosition i przypisz do zmiennych szerokość i długość geograficzną, potrzebna akceptacja lokalizacji w przeglądarce

        navigator.geolocation.getCurrentPosition(
            (position) => {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                console.log("lat: ", lat, "long: ", long);
                getWeatherData();
            }
        );
    }
}
/* 
zdefiniuj funkcję która wysyła do strony link w celu pobrania wartości w formacie json
 link pochodzi ze strony natomiast zmienne są przypisane do tych ze skryptu za pomocą $ i `` 
 dopisanie na końcu linka "&units=metric" powoduje zmianę jednostek na metryczne 
 */
function getWeatherData(){
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
    console.log(url);

/*
funckją fetch pobierz dane ze zmiennej "url" następnie stwórz plik json który zapisze dane do zmiennej "data"
*/

    fetch(url).then(function(response){
        response.json().then(function(data){
            console.log(data);
            updateWeatherData(data);
        });
    });

} 

function updateWeatherData(data){

/*
wybierz z pliku nazwę miasta i przypisz do zmiennej
ustaw wartość dla odpowiedniego ID z pliku HTML
ustaw parametr "href" zmiennej "locationLink" na adres strony openstreetmap
przypisz parametry lokalizacji do linku
*/
    const city = data.name;
    const locationLink = document.getElementById("locationLink");
    locationLink.innerHTML = city;
    locationLink.href = `https://openstreetmap.org/#map=10/${lat}/${long}`;

    const temp = data.main.temp;
    document.getElementById("temp").innerHTML = temp;

    const hum = data.main.humidity;
    document.getElementById("humidity").innerHTML = hum;

    const pres = data.main.pressure;
    document.getElementById("pressure").innerHTML = pres;

    const clouds = data.clouds.all;
    document.getElementById("cloudsPrec").innerHTML = clouds;

    const wind = data.wind.speed;
    document.getElementById("windSpeed").innerHTML = wind;

// wartość czasu podawana jest w timestamp czyli od 1 stycznia 1970 roku, trzeba ją przekonwertować do obiektu date i pomnożyć przez 1000 ponieważ jest liczona w milisekundach
// w przypadku prezentacji danych wybierz godziny i minuty funckjami getHours i getMinutes
    const sunRise = new Date(data.sys.sunrise*1000);
    document.getElementById("sunRise").innerHTML = sunRise.getHours() + ":" + sunRise.getMinutes();

    const sunSet = new Date(data.sys.sunset*1000);
    document.getElementById("sunSet").innerHTML = sunSet.getHours() + ":" + sunSet.getMinutes();

/*
utwórz zmienną linkującą obrazek z pogodą ze strony, parametr ikony pobierz z pliku JSON w wklej w link "+data.weather[0].icon+"
nastepnie w id "currentWeatherImg" ustaw atrybut "src" na link "imgUrl"
*/
    let imgUrl = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
    document.getElementById("currentWeatherImg").setAttribute("src", imgUrl);
}