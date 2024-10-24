import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker, Popup } from 'maplibre-gl';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapview',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: 'map-view.component.html',
  styleUrls: ['map-view.component.scss']
})
export class MapviewComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: Map;
  contextMenuVisible = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedMarkerDetails: any = null;
  sidebarVisible = false;

 


  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

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

    // Add markers with popups and right-click menu
    this.addMarkers();
  }

  addMarkers() {
    const markers = [
      { id: 1, name: 'Streetlight 1', coordinates: [80.2209, 13.0105], status: true, type: 'Single Pole', powerConsumption: 50, brightness: 100, operationalTime: 'Operating since 2018', lastMaintenance: '2023-01-15', issues: [] },
      // Add other markers similarly...
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
        .setMaxWidth('150px'); 

      const markerElement = new Marker({ color: marker.status ? '#00FF00' : '#FF0000' })
        .setLngLat(marker.coordinates as [number, number])
        .setPopup(popup)
        .addTo(this.map)
        .getElement();

      // Add right-click event listener for marker
      markerElement.addEventListener('contextmenu', (event) => this.showContextMenu(event, marker));
    });
  }

  showContextMenu(event: MouseEvent, marker: any) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: `${event.clientX}px`, y: `${event.clientY}px` };
    this.selectedMarkerDetails = marker;
  }

  viewDetails() {
    this.contextMenuVisible = false;
    this.sidebarVisible = true;
  }

  toggleLight() {
    // Logic to toggle streetlight status
    this.selectedMarkerDetails.status = !this.selectedMarkerDetails.status;
  }

  

  closeSidebar() {
    this.sidebarVisible = false;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
