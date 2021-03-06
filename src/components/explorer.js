import React from 'react';
import L from 'leaflet';
import { geoLocation } from "../utils/geoLocation";
import {colorForPercentage} from "../utils/colors";

export class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.addCircle = this.addCircle.bind(this);
        this.renderSidebarButton = this.renderSidebarButton.bind(this);
        this.renderHomeButton = this.renderHomeButton.bind(this);
    }

    render() {
        return (
            <div id='explorer' style={{height: '640px', width: '768px'}}/>
        );
    }

    componentDidMount() {
        this.explorer = L.map('explorer', {
            center: [37.8, -96],
            zoom: 4,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.explorer);
        new L.Control.Zoom({position: 'topright'}).addTo(this.explorer);
        this.renderSidebarButton();
        this.renderHomeButton();

        console.log(this.explorer);
        this.explorer.on('click', this.onClick.bind(this));
    }

    renderSidebarButton() {
        const toggleSidebar = this.props.toggleSidebar;
        L.Sidebar = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: function(map) {
                let button = L.DomUtil.create('button');
                button.innerHTML = '\u2261';
                button.onclick = toggleSidebar;
                return button;
            }
        });

        L.sidebar = function(options) {
            return new L.Sidebar(options);
        };

        L.sidebar().addTo(this.explorer);
    }

    renderHomeButton() {
        const geolocation = () => geoLocation(this.setUserLocation.bind(this));
        L.HomeButton = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: function(map) {
                let button = L.DomUtil.create('button');
                button.innerHTML = '\u2302';
                button.onclick = geolocation;
                return button;
            }
        });

        L.homeButton = function(options) {
            return new L.HomeButton(options);
        };

        L.homeButton().addTo(this.explorer);
    }

    setUserLocation(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.explorer.setView(new L.latLng(lat, lng), 14);
    }

    addCircle(latlng, etr) {
        const circle = new L.circle(latlng, {
            color: colorForPercentage(etr / 5),
            radius: 1750,
            stroke: false
        }).bindPopup('etr: ' + etr.toFixed(2)).on('mouseover', () => {
            circle.openPopup();
        }).on('mouseout', () => {
            circle.closePopup();
        }).addTo(this.explorer);
    }

    onClick(e) {
        // check for radial / marker
        // ...

        // draw circle / marker->polygon
        if (this.queryCircle) {
            this.queryCircle.setLatLng(e.latlng);
        } else {
            this.queryCircle = new L.circle(e.latlng, {
               fillOpacity: 0,
               radius: 500
            });
            this.queryCircle.addTo(this.explorer);
        }

        // update sidebar data
        this.props.updateRadialCoords(e.latlng);
    }
}