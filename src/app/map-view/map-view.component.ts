import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker, Popup } from 'maplibre-gl';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-mapview',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarModule],
  templateUrl: 'map-view.component.html',
  styleUrls: ['map-view.component.scss'],
 
})
export class MapviewComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: Map;
  contextMenuVisible = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedMarkerDetails: any = null;
  sidebarVisible = false;
  streetlights: any[] = []; 

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStreetlights();
  }

  ngAfterViewInit() {
    const initialState = { lng: 80.2209, lat: 13.0105, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=KYF9wgI47DOeYBVqtdI5`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl(), 'top-right');
  }

  fetchStreetlights() {
    this.http.get<any[]>('http://localhost:8080/api/streetlights').subscribe(
      (data) => {
        this.streetlights = data;
        this.addMarkers();
      },
      (error) => {
        console.error('Error fetching streetlights', error);
      }
    );
  }

  addMarkers() {
    this.streetlights.forEach(marker => {
      const popupContent = `
        <div style="text-align: center; max-width: 150px;">
          <img src="assets/streetlight-icon.png" alt="Streetlight Icon" style="width: 30px; height: 30px;">
          <h4>${marker.name}</h4>
          <p><strong>Type:</strong> ${marker.type}</p>
          <p><strong>Coordinates:</strong> [${marker.coordinates}]</p>
          <p><strong>Status:</strong> ${marker.status ? '<span class="on">On</span>' : '<span class="off">Off</span>'}</p>
        </div>
      `;

      const popup = new Popup()
        .setHTML(popupContent)
        .setMaxWidth('150px');

      const coordinates = this.parseCoordinates(marker.coordinates);
      const markerElement = new Marker({ color: marker.status ? '#00FF00' : '#FF0000' })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(this.map);

     
      markerElement.getElement().addEventListener('contextmenu', (event) => {
        event.preventDefault(); 
        this.showContextMenu(event, marker);
      });
    });
  }

  parseCoordinates(coordinates: string): [number, number] {
    const coordArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    return [coordArray[0], coordArray[1]];
  }

  showContextMenu(event: MouseEvent, marker: any) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: `${event.clientX}px`, y: `${event.clientY}px` };
    
    this.selectedMarkerDetails = {
      ...marker,
      coordinates: this.parseCoordinates(marker.coordinates) 
    };
  }
  

  viewDetails() {
    this.contextMenuVisible = false;
    this.sidebarVisible = true;
  }

  toggleLight() {
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
