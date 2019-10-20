import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { TicketDto, PathDto } from 'src/app/models';
import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';
import {} from 'googlemaps';

@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.less']
})
export class GoogleMapComponent implements AfterViewInit {
    @Input()
    set tickets(val: Array<TicketDto>) {
        if (val && val.length) {
            val.forEach(t => {
                this.updateCities(t.departure);
                this.updateCities(t.arrival);
            });
        }
    }

    @Input()
    set routes(val: Array<PathDto>) {
        if (val && val.length) {
            this.flightRoutes.forEach(r => r.setMap(null));
            this.flightRoutes = [];
            val.forEach(r => {
                this.updateRoutes(r);
            });
        }
    }

    @ViewChild('map', { static: false }) mapElement: any;
    map: google.maps.Map;

    private cities = new Map();
    private flightRoutes: google.maps.Polyline[] = [];
    constructor() {}

    ngAfterViewInit(): void {
        const mapProperties: google.maps.MapOptions = {
            center: new google.maps.LatLng(52.22977, 21.01178),
            zoom: 2,
            minZoom: 1,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    }

    private updateCities(place: PlaceSummary) {
        if (!this.cities.has(place.city)) {
            const marker = new google.maps.Marker({
                position: {
                    lat: place.latitude,
                    lng: place.longitude
                },
                title: place.city,
                map: this.map
            });
            this.cities.set(place.city, marker);
        }
    }

    private updateRoutes(path: PathDto) {
        const flyPath = path.tickets.reduce(
            (p: any[], t: TicketDto) => {
                p.push({
                    lat: t.arrival.latitude,
                    lng: t.arrival.longitude
                });
                return p;
            },
            [
                {
                    lat: path.tickets[0].departure.latitude,
                    lng: path.tickets[0].departure.longitude
                }
            ]
        );
        const flightPath = new google.maps.Polyline({
            path: flyPath,
            geodesic: true,
            strokeColor: this.getRandomColor(),
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: this.map
        });
        this.flightRoutes.push(flightPath);
    }

    private getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
