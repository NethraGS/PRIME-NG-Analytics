import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker, Popup } from 'maplibre-gl';

@Component({
  selector: 'app-mapview',
  standalone: true,
  templateUrl: 'map-view.component.html',
  styleUrls: ['map-view.component.scss']
})
export class MapviewComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: Map;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const initialState = { lng: 80.2209, lat: 13.0105, zoom: 14 };

    // Initialize the map with MapTiler style
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=KYF9wgI47DOeYBVqtdI5`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    // Add navigation controls
    this.map.addControl(new NavigationControl(), 'top-right');

    // Add markers with popups
    this.addMarkers();
  }

  addMarkers() {
    const markers = [
      { id: 1, name: 'Streetlight 1', coordinates: [80.2209, 13.0105], status: true, type: 'Single Pole' },
      { id: 2, name: 'Streetlight 2', coordinates: [80.2150, 13.0050], status: false, type: 'Double Pole' },
      { id: 3, name: 'Streetlight 3', coordinates: [80.2250, 13.0150], status: true, type: 'Single Pole' },
      { id: 4, name: 'Streetlight 4', coordinates: [80.2300, 13.0200], status: false, type: 'Light Standard' },
      { id: 5, name: 'Streetlight 5', coordinates: [80.2400, 13.0300], status: true, type: 'Single Pole' }
    ];

    markers.forEach(marker => {
      const popupContent = `
        <div style="text-align: center; max-width: 150px;">
          <img src="assets/streetlight-icon.png" alt="Streetlight Icon" style="width: 30px; height: 30px;">
          <h4>${marker.name}</h4>
          <p><strong>Type:</strong> ${marker.type}</p>
          <p><strong>Coordinates:</strong> [${marker.coordinates[0].toFixed(4)}, ${marker.coordinates[1].toFixed(4)}]</p>
          <p><strong>Status:</strong> ${marker.status ? '<span class="on">On</span>' : '<span class="off">Off</span>'}</p>
        </div>
      `;

      const popup = new Popup()
        .setHTML(popupContent)
        .setMaxWidth('150px'); // Set a maximum width for the popup

      // Set the marker color based on the status (Green for On, Red for Off)
      new Marker({ color: marker.status ? '#00FF00' : '#FF0000' })
        .setLngLat(marker.coordinates as [number, number])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
