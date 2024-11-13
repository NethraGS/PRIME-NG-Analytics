import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

interface Streetlight {
  id: number;
  name: string;
  type: string;
  coordinates: string;
  status: boolean;
  powerConsumption: number;
  brightness: number;
  operationalTime: string;
  lastMaintenance: string;
  issues: string[];
  location: string; // Add location property
}


@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [TabMenuModule, TableModule,RouterModule],
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.scss']
})
export class AssetTableComponent implements OnInit {
  streetlights: Streetlight[] = [];
  private apiUrl = 'http://192.168.56.192:8080/api/streetlights';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStreetlights();
  }

  fetchStreetlights(): void {
    this.http.get<Streetlight[]>(this.apiUrl)
      .subscribe(
        (data) => {
          this.streetlights = data;
        },
        (error) => {
          console.error('Error fetching streetlight data:', error);
        }
      );
  }

  viewDetails(streetlight: Streetlight): void {
    console.log('View details for streetlight:', streetlight);
  }
}
