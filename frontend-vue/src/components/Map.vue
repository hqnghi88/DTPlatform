<template>

    <Transition>
        <div id="container" style="position: absolute;">
            <div id="sidebarContainer" class="d-flex">
                <!-- Sidebar -->
                <nav id="sidebar" class="bg-light border-end">
                    <!-- Sidebar Header -->
                    <div class="p-3 border-bottom">
                        <div class="d-flex align-items-center justify-content-between">
                            <div id="backIcon">
                                <button class="btn btn-outline-dark" style="background-color: none;"
                                    @click="pushToDashBoard()">
                                    Trang chủ
                                </button>
                            </div>
                            <button id="arrow-left" @click="show = false; toggle()" class="btn btn-link p-0">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <!-- <button class="btn btn-link p-0">
                            <i class="fas fa-ellipsis-v"></i>
                        </button> -->
                        </div>
                    </div>

                    <!-- Sidebar Content -->
                    <div class="p-3">
                        <div class="d-flex justify-content-between mb-3">
                            <div class="d-flex mb-3">
                                <div style="margin-bottom: 5px;">

                                    <input type="radio" @change="changeType(0)" class="btn-check" name="btnradio"
                                        id="btnradio" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradio">
                                        Tối ưu
                                    </label>

                                    <input checked type="radio" value=60 @change="changeType(1)" class="btn-check"
                                        name="btnradio" id="btnradioCar" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradioCar">
                                        <i class="fa-solid fa-car"></i>
                                    </label>

                                    <input type="radio" value=10 @change="changeType(2)" class="btn-check"
                                        name="btnradio" id="btnradioBike" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradioBike">
                                        <i class="fas fa-bicycle"></i>
                                    </label>

                                    <input type="radio" value=5 @change="changeType(3)" class="btn-check"
                                        name="btnradio" id="btnradioWalk" autocomplete="off" />
                                    <label class="btn btn-outline-secondary label" for="btnradioWalk">
                                        <i class="fas fa-walking"></i>
                                    </label>

                                    <input type="radio" value=5 @change="changeType(4)" class="btn-check"
                                        name="btnradio" id="btnradioBus" autocomplete="off" />
                                    <label class="btn btn-outline-secondary label" for="btnradioBus">
                                        <i class="fa-solid fa-bus"></i>
                                    </label>
                                </div>

                            </div>
                        </div>
                        <div id="geocoder">

                            <input type="text" @keyup="suggestion(addressStart, 0)" class="form-control "
                                placeholder="Điểm bắt đầu" v-model="addressStart">

                            <select v-if="addressStart.length > 0 && displaySuggestStart == true" class="form-select"
                                multiple :size="suggestStart.length">
                                <option value=1 v-for="suggestion in suggestStart"
                                    @click="addressStart = suggestion; displaySuggestStart = false">
                                    {{ suggestion }}
                                </option>
                            </select>

                            <div id="geocoder-icon" class="m-2">
                                <div class="text-center">
                                    <button :disabled="disableSwap" class="btn btn-light" @click="swapPlace()">
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </button>
                                </div>
                            </div>

                            <input type="text" @keyup="suggestion(addressEnd, 1)" class="form-control"
                                placeholder="Điểm kết thúc" v-model="addressEnd">

                            <select v-if="suggestEnd.length > 0 && displaySuggestEnd == true" class="form-select"
                                multiple :size='suggestEnd.length'>
                                <option v-for="suggestion in suggestEnd"
                                    @click="addressEnd = suggestion; displaySuggestEnd = false">
                                    {{ suggestion }}
                                </option>
                            </select>

                            <button class="btn btn-dark mt-3" @click="geocode($event)">Tìm đường</button>
                        </div>
                        <hr>

                        <div>
                            <div class="profile">
                                <div class="h6">
                                    <span class="h6">Độ dài: </span>
                                    <span>{{ lengthRoad }} m</span>
                                </div>
                                <div class="h6">
                                    <span class="h6">Lượng khí thải: </span>
                                    <span>1000 PPM</span>
                                </div>
                                <div class="h6">
                                    <span class="h6">Thời gian: </span>
                                    <span>{{ timeToTravel }} phút</span>
                                </div>
                            </div>
                        </div>


                        <hr>
                        <div class="accordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button :disabled="stepsNum <= 0" class="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">
                                        Lộ trình
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample">
                                    <div id="instructions" class="accordion-body">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

            </div>
        </div>
    </Transition>
    <Transition>
        <div>
            <button id="arrow-right" v-if="show == false"
                style="position: absolute; z-index: 2; margin: 20px; background: white;" @click="show = true; toggle()"
                class="btn btn-link p-2">
                <i style="margin: 0 2px;" class="fas fa-arrow-right"></i>
            </button>
        </div>
    </Transition>

    <div ref="mapContainer" class="map-container"></div>

    <button class="geolocate-btn" style="width: 50px; height: auto;"
        @click="loadingWait = !loadingWait; getCurrentLocation()">
        <div v-if="loadingWait == true">
            <i class="fa-solid fa-spinner fa-spin-pulse" style="width: 25px; height: 25px;"></i>
        </div>
        <div v-else>
            <i class="fa-solid fa-location-crosshairs" style="width: 25px; height: 25px;"></i>
        </div>
    </button>

</template>

<script>
// import '../assets/map.css';
import mapboxgl from 'mapbox-gl';
import autosuggestServices from '@/services/autosuggest.services';
import PollutionService from '../services/pollution.services'
import directionService from '@/services/direction.services';
import locationService from '@/services/location.service';
import trafficServices from '@/services/traffic.services';
import mapboxServices from '@/services/mapbox.services';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'

const cookies = useCookies()

var map, token, roads

const aqicnApiKey = import.meta.env.VITE_AQI_API_KEY
const trafficToken = import.meta.env.VITE_TRAFFIC_API_KEY

export default {
    computed: {
        disableSwap() {
            return this.addressStart == '' || this.addressEnd == '';
        }
    },
    data() {
        return {
            displaySuggestStart: false,
            displaySuggestEnd: false,
            suggestStart: [],
            suggestEnd: [],
            show: true,
            checkClick: false,
            lengthRoad: 0,
            timeToTravel: 0,
            choosenType: 1,
            choosenTypeCar: 'driving',
            loadingWait: false,
            roadNames: [],
            start: [],
            end: [],
            traffics: [],
            router: useRouter(),
            markers: [],
            addressStart: '',
            addressEnd: '',
            stepsNum: 0,
            dataBus: {}
        }
    },
    methods: {
        haversineDistance(lat1, lon1, lat2, lon2) {
            const toRadians = (degree) => (degree * Math.PI) / 180;

            const R = 6371; // Earth's radius in kilometers
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // Distance in kilometers
        },

        // Check if the point lies between the start and end points
        isBetweenPoints(startLat, startLon, endLat, endLon, pointLat, pointLon) {
            const latMin = Math.min(startLat, endLat);
            const latMax = Math.max(startLat, endLat);
            const lonMin = Math.min(startLon, endLon);
            const lonMax = Math.max(startLon, endLon);

            return pointLat >= latMin && pointLat <= latMax && pointLon >= lonMin && pointLon <= lonMax;
        },

        // Function to find the closest point between start and end points
        findClosestPointInRoute(startLat, startLon, endLat, endLon, points) {
            let closestPoint = null;
            let minDistance = Infinity;

            points.forEach(point => {
                if (this.isBetweenPoints(startLat, startLon, endLat, endLon, point.geometry.coordinates[1], point.geometry.coordinates[0])) {
                    const distance = this.haversineDistance(startLat, startLon, point.geometry.coordinates[1], point.geometry.coordinates[0]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPoint = [point.geometry.coordinates[0], point.geometry.coordinates[1]];
                    }
                }
            });

            return closestPoint;
        },

        async fetchJSON(url) {
            return fetch(url)
                .then(function (response) {
                    return response.json();
                });
        },
        createCompleteAddresses(data) {

            return data.map(entry => {
                if (entry.name == undefined)
                    return entry.address.formattedAddress
                else
                    return entry.name + ' ' + entry.address.formattedAddress
            });
        },
        async suggestion(q, type) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = setTimeout(async () => {
                let resp = await autosuggestServices.getAutoSuggest(q, trafficToken)
                if (resp != null && resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                    let completeAddress = this.createCompleteAddresses(resp.resourceSets[0].resources[0].value)

                    if (type == 0) { // suggest start
                        this.displaySuggestStart = true

                        this.suggestStart = []
                        completeAddress.forEach(element => {
                            if (element != '')
                                this.suggestStart.push(element)
                        });

                    } else { // suggest end
                        this.displaySuggestEnd = true

                        this.suggestEnd = []
                        completeAddress.forEach(element => {
                            if (element != '')
                                this.suggestEnd.push(element)
                        });
                    }
                } else {
                    return;
                }
            }, 500);
        },

        clearMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers.length = 0; // Clear the array
        },

        async geocode(e) {
            e.preventDefault();
            this.clearMarkers();

            if (this.addressStart == '' || this.addressEnd == '') return;

            // get start location
            let resp = await locationService.getLocation(this.addressStart, trafficToken)

            if (resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                var location = resp.resourceSets[0].resources[0].point.coordinates;
                var lng = location[1];
                var lat = location[0];

                this.start[0] = lng
                this.start[1] = lat

                let marker = new mapboxgl.Marker({ color: 'green', draggable: true })
                    .setLngLat([lng, lat])
                    .addTo(map);
                marker.on('dragend', () => {
                    let lngLat = marker.getLngLat();
                    this.start[0] = lngLat.lng
                    this.start[1] = lngLat.lat
                    this.calculateRoute()
                });
                this.markers.push(marker);

            } else {
                alert('Location not found');
            }

            // get end location
            let respEnd = await locationService.getLocation(this.addressEnd, trafficToken)

            if (respEnd.resourceSets.length > 0 && respEnd.resourceSets[0].resources.length > 0) {
                var location = respEnd.resourceSets[0].resources[0].point.coordinates;
                var lng = location[1];
                var lat = location[0];

                this.end[0] = lng
                this.end[1] = lat

                let marker = new mapboxgl.Marker({ color: 'red', draggable: true })
                    .setLngLat([lng, lat])
                    .addTo(map);
                marker.on('dragend', () => {
                    let lngLat = marker.getLngLat();
                    this.end[0] = lngLat.lng
                    this.end[1] = lngLat.lat
                    this.calculateRoute()
                });
                this.markers.push(marker);

                map.flyTo({
                    center: [lng, lat],
                    essential: true
                });

                // calculate route
                this.calculateRoute()

            } else {
                alert('Location not found');
            }

        },

        toggle() {  // toggle side bar
            var x = document.getElementById("container");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        },

        pushToDashBoard() {
            this.router.push('home')
        },

        async getCurrentLocation() {
            if (navigator.geolocation) {
                var latCurrent, lngCurrent

                navigator.geolocation.getCurrentPosition(async (position) => {
                    lngCurrent = position.coords.longitude;
                    latCurrent = position.coords.latitude;

                    const coordinates = [lngCurrent, latCurrent];

                    let resp = await locationService.getLocationByPoint(latCurrent, lngCurrent, trafficToken)
                    if (resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                        var address = resp.resourceSets[0].resources[0].address.addressLine;

                        this.addressStart = address + ' Việt Nam'
                    }

                    map.flyTo({
                        center: coordinates,
                        zoom: 14
                    });

                    this.start[0] = lngCurrent
                    this.start[1] = latCurrent

                    let marker = new mapboxgl.Marker({ color: 'green', draggable: true })
                        .setLngLat([lngCurrent, latCurrent])
                        .addTo(map);
                    marker.on('dragend', () => {
                        let lngLat = marker.getLngLat();
                        this.start[0] = lngLat.lng
                        this.start[1] = lngLat.lat
                        this.calculateRoute()
                    });
                    this.markers[0] = marker

                    // calculate route
                    this.calculateRoute()

                    this.loadingWait = false
                }, error => {
                    console.error('Error getting location', error);
                });

            } else {
                alert('Geolocation is not supported by this browser.');
            }

        },

        changeType(index) { // change driving type
            if (index == 1) this.choosenTypeCar = 'driving'
            else if (index == 2) this.choosenTypeCar = 'cycling'
            else if (index == 3) this.choosenTypeCar = 'walking'
            else if (index == 4) this.choosenTypeCar = 'bus'
            else if (index == 0) this.choosenTypeCar = 'driving-traffic'

            this.choosenType = index
            this.calculateRoute()
        },

        swapPlace() { // swap start and end place

            for (let i = 0; i < this.start.length; i++) {
                let tempVariable = this.start[i];
                this.start[i] = this.end[i];
                this.end[i] = tempVariable;
            }

            // swap address in input
            let temp = this.addressStart;
            this.addressStart = this.addressEnd
            this.addressEnd = temp

            this.calculateRoute()
        },

        async calculateRoute() { // find path
            if (this.start.length == 0 || this.end.length == 0) return;

            if (this.choosenTypeCar == 'bus') {
                // find 2 closest bus stop
                let start1 = this.findClosestPointInRoute(this.start[1], this.start[0], this.end[1], this.end[0], this.dataBus)
                let end1 = this.findClosestPointInRoute(this.end[1], this.end[0], this.start[1], this.start[0], this.dataBus)

                // Mapbox direction API
                let respDirection1 = await directionService.getDirection('walking', import.meta.env.VITE_MAPBOX_KEY, this.start[0], this.start[1], start1[0], start1[1])
                let respDirection2 = await directionService.getDirection('driving', import.meta.env.VITE_MAPBOX_KEY, start1[0], start1[1], end1[0], end1[1])
                let respDirection3 = await directionService.getDirection('walking', import.meta.env.VITE_MAPBOX_KEY, end1[0], end1[1], this.end[0], this.end[1])


                const directions1 = respDirection1.routes[0];
                const directions2 = respDirection2.routes[0];
                const directions3 = respDirection3.routes[0];

                // console.log(respTransit)
                const route1 = directions1.geometry.coordinates;
                const route2 = directions2.geometry.coordinates;
                const route3 = directions3.geometry.coordinates;

                const steps1 = directions1.legs[0].steps;

                if (map.getLayer('route')) {
                    map.removeLayer('route');
                }
                if (map.getSource('route')) {
                    map.removeSource('route');
                }

                // Function to convert line into dots by creating a feature collection of points
                const createCombinedGeoJSON = (route1, route2, route3) => {
                    let features = [];

                    // Add dots for route1 and route3
                    [route1, route3].forEach(route => {
                        route.forEach(coord => {
                            features.push({
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coord
                                }
                            });
                        });
                    });

                    // Add LineString for route2
                    features.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': route2
                        }
                    });

                    return {
                        'type': 'FeatureCollection',
                        'features': features
                    };
                };

                map.addSource('route', {
                    'type': 'geojson',
                    'data': createCombinedGeoJSON(route1, route2, route3)  // Use the function to convert the line to dots
                });

                // Add a circle layer to display the dots
                map.addLayer({
                    'id': 'route',
                    'type': 'circle',  // Use circle layer to display both dots and lines
                    'source': 'route',
                    'paint': {
                        'circle-radius': [
                            'case',
                            ['==', ['geometry-type'], 'Point'],  // If feature is a Point
                            5,  // Size of the dots
                            0  // No size for non-Point features
                        ],
                        'circle-color': [
                            'case',
                            ['==', ['geometry-type'], 'Point'],  // If feature is a Point
                            'blue',  // Color of the dots
                            'transparent'  // No color for non-Point features
                        ]
                    }
                });

                // Add a line layer to the same source (using a separate layer, not strictly one layer but combined with the circle layer)
                map.addLayer({
                    'id': 'routeLine',
                    'type': 'line',
                    'source': 'route',
                    'paint': {
                        'line-color': [
                            'case',
                            ['==', ['geometry-type'], 'LineString'],  // If feature is a LineString
                            'blue',  // Color of the line
                            'transparent'  // No color for non-LineString features
                        ],
                        'line-width': 8
                    }
                });

                // // add instruction
                this.stepsNum = steps1.length
                const instructions = document.getElementById('instructions');
                let tripInstructions = '';
                for (const step of steps1) {
                    let instruction = step.maneuver.instruction
                    let distance = Math.round(step.distance)
                    let duration = Math.round(step.duration / 60)
                    if (duration == 0) {
                        duration = Math.round(step.duration)
                        duration += 's'
                    } else {
                        duration += 'p'
                    }


                    tripInstructions += `<li>

                        <div class="d-flex justify-content-between">
                            <div class="w-75">
                                ${instruction} 
                            </div>

                           `;
                    if (duration != '0s' || distance != 0) {
                        tripInstructions += ` 
                            <div class="ms-2 w-25">
                                ${distance}m
                            </div>
                            <div class="w-25">
                                ${duration}
                            </div>
                        </div>

                    </li>`
                    } else {
                        tripInstructions += `</div></li>`
                    }
                }
                instructions.innerHTML = `<ol>${tripInstructions}</ol>`;

                this.lengthRoad = Math.round(directions1.distance);
                this.timeToTravel = Math.round(directions1.duration / 60)


                const bounds = [
                    [Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])], // Southwest coordinates [lng, lat]
                    [Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])]  // Northeast coordinates [lng, lat]
                ];

                map.fitBounds(bounds, {
                    padding: 100 // Optional padding around the bounding box
                });
            } else {
                // Mapbox direction API
                let respDirection = await directionService.getDirection(this.choosenTypeCar, import.meta.env.VITE_MAPBOX_KEY, this.start[0], this.start[1], this.end[0], this.end[1])
                const directions = respDirection.routes[0];
                const route = directions.geometry.coordinates;
                const steps = directions.legs[0].steps;

                // add instruction
                this.stepsNum = steps.length
                const instructions = document.getElementById('instructions');
                let tripInstructions = '';
                for (const step of steps) {
                    let instruction = step.maneuver.instruction
                    let distance = Math.round(step.distance)
                    let duration = Math.round(step.duration / 60)
                    if (duration == 0) {
                        duration = Math.round(step.duration)
                        duration += 's'
                    } else {
                        duration += 'p'
                    }


                    tripInstructions += `<li>

                        <div class="d-flex justify-content-between">
                            <div class="w-75">
                                ${instruction} 
                            </div>

                           `;
                    if (duration != '0s' || distance != 0) {
                        tripInstructions += ` 
                            <div class="ms-2 w-25">
                                ${distance}m
                            </div>
                            <div class="w-25">
                                ${duration}
                            </div>
                        </div>
                      
                    </li>`
                    } else {
                        tripInstructions += `</div></li>`
                    }
                }
                instructions.innerHTML = `<ol>${tripInstructions}</ol>`;

                this.lengthRoad = Math.round(directions.distance);
                this.timeToTravel = Math.round(directions.duration / 60)

                if (map.getLayer('route')) {
                    map.removeLayer('route');
                }
                if (map.getLayer('routeLine')) {
                    map.removeLayer('routeLine');
                }
                if (map.getSource('route')) {
                    map.removeSource('route');
                }

                map.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': route
                        }
                    }
                });
                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': 'blue',
                        'line-width': 8
                    }
                })

                const bounds = [
                    [Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])], // Southwest coordinates [lng, lat]
                    [Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])]  // Northeast coordinates [lng, lat]
                ];

                map.fitBounds(bounds, {
                    padding: 100 // Optional padding around the bounding box
                });

            }

        },


    },

    async mounted() {


        token = cookies.cookies.get('Token')

        roads = await mapboxServices.getRoad(token)



        map = new mapboxgl.Map({
            container: this.$refs.mapContainer,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [105.849817, 21.028511],
            zoom: 16,
        });

        // add bus data
        let resp = await this.fetchJSON('/export.geojson')
        this.dataBus = resp.features

        for (let i = 0; i < this.dataBus.length; i++) {
            let lat = this.dataBus[i].geometry.coordinates[1]
            let lng = this.dataBus[i].geometry.coordinates[0]

            let el = document.createElement('div');
            el.className = `custom-marker-bus marker`;

            el.innerHTML = '<i class="fa-solid fa-bus text-white"></i>';

            let description = ''
            if (this.dataBus[i].properties.name != undefined)
                description = `<div class="fw-bold">${this.dataBus[i].properties.name}</div>`
            let markerBus = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(description))
                .addTo(map);
        }

        // adding pollution
        const stations = [
            'hanoi',
            '@13414',
            '@1583',
            '@13686',
            'A230626',
            '@8641',
            'A476599',
            'A363001',
            'A230383',
            'A112819',
            'A80656',
            'A477292',
            'A230398'
        ];

        for (let i = 0; i < stations.length; i++) {

            let resp = await PollutionService.getPollution(aqicnApiKey, stations[i])
            // console.log(resp.data)
            if (resp.status == 'ok') {
                let aqi = resp.data.aqi;
                let coords = resp.data.city.geo;

                // adding description to marker
                let description = `
                    <b>Station</b>: ${resp.data.city.name} <br>
                    <b>AQI</b>: ${aqi}  <br>
                    <b>Dominant Pollutant</b>: ${resp.data.dominentpol} <br>`;
                if (resp.data.iaqi.pm25 != null) {
                    description += `<b>PM2.5</b>: ${resp.data.iaqi.pm25.v} <br>`
                }
                if (resp.data.iaqi.pm10 != null) {
                    description += `<b>PM10</b>: ${resp.data.iaqi.pm10.v} <br>`
                }
                if (resp.data.iaqi.h != null) {
                    description += `<b>Humidity</b>: ${resp.data.iaqi.h.v} <br>`
                }
                if (resp.data.iaqi.t != null) {
                    description += `<b>Temperature</b>: ${resp.data.iaqi.t.v} <br>`
                }
                if (resp.data.iaqi.p != null) {
                    description += `<b>Pressure</b>: ${resp.data.iaqi.p.v} <br>`
                }
                if (resp.data.iaqi.w != null) {
                    description += `<b>Wind</b>: ${resp.data.iaqi.w.v} <br>`
                }

                // calculate time and add to description
                let timeElapsed = Date.now() - Date.parse(resp.data.time.s);
                let minutesElapsed = Math.floor(timeElapsed / (1000 * 60));
                let hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));
                let daysElapsed = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));

                let content = minutesElapsed + ' phút trước'
                if (minutesElapsed > 60) content = hoursElapsed + ' giờ trước'
                if (hoursElapsed > 24) content = daysElapsed + ' ngày trước'

                description += `<div class='text-secondary'>Cập nhật lần cuối: ${content} </div>`

                let markerColor = 'green';
                if (aqi > 50 && aqi <= 100) {
                    markerColor = 'yellow';
                } else if (aqi > 100 && aqi <= 150) {
                    markerColor = 'red';
                } else if (aqi > 150 && aqi <= 200) {
                    markerColor = 'purple';
                } else if (aqi > 200) {
                    markerColor = 'brown';
                }

                let el = document.createElement('div');
                el.className = `custom-marker marker ${markerColor}`;

                // el.setAttribute('style', 'width: 30px; height: 30px; background-color: blue')
                el.textContent = aqi

                let marker1 = new mapboxgl.Marker(el)
                    .setLngLat([coords[1], coords[0]])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(description))
                    .addTo(map);
            }
        }

        // document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));
        // document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));

        // add traffic
        let respTraffic = await trafficServices.getTraffic(trafficToken)

        let featureCollection = []
        for (let i = 0; i < respTraffic.resourceSets[0].resources.length; i++) {
            let resource = respTraffic.resourceSets[0].resources[i]

            let latPoint = resource.point.coordinates[0], lngPoint = resource.point.coordinates[1] // 0 lat 1 lng
            let latToPoint = resource.toPoint.coordinates[0], lngToPoint = resource.toPoint.coordinates[1] // 0 lat 1 lng

            let severity = resource.severity
            let feature = {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [lngPoint, latPoint],
                        [lngToPoint, latToPoint]
                    ]
                },
                'properties': {
                    'severity': severity
                }
            }

            featureCollection.push(feature)
        }
        if (map.getSource('trafficLine')) {
            map.getSource('trafficLine' + i).setData({
                'type': 'FeatureCollection',
                'features': featureCollection,
            });
        } else {
            map.addLayer({
                'id': 'trafficLine',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': featureCollection,
                    }
                },
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': [
                        'case',
                        ['==', ['get', 'severity'], 5], '#ff0000', // Red for high severity
                        ['==', ['get', 'severity'], 4], '#ff0000', // Red for high severity
                        ['==', ['get', 'severity'], 3], '#ffa500', // Orange for medium severity
                        ['==', ['get', 'severity'], 2], '#008000', // Green for low severity
                        ['==', ['get', 'severity'], 1], '#008000', // Green for low severity
                        ['==', ['get', 'severity'], 0], '#008000', // Green for low severity
                        '#888' // Default color
                    ],
                    'line-width': 5
                }
            })
        }

    },
    unmounted() {
        if (map != null) map.remove();
        map = null;
    }

};
</script>
<style src="../assets/map.css"></style>
 