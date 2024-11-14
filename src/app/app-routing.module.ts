import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './SM-Auth/login/login.component';
import { MapviewComponent } from './SM-Application/map-view/map-view.component';
import { UserDashboardComponent } from './SM-Application/user-dashboard/user-dashboard.component';
import { DimmingProfilesComponent } from './SM-Application/dimming-profiles/dimming-profiles.component';
import { DimmingSchedulesComponent } from './SM-Application/dimming-schedules/dimming-schedules.component';
import { ChartsDemoComponent } from './demo/components/uikit/charts/chartsdemo.component';
import { UserProfileComponent } from './SM-Application/user-profile/user-profile.component';
import { AnalyticsComponent } from './SM-Analytics/analytics/analytics.component';
import { AssetTableComponent } from './SM-Application/asset-table/asset-table.component';
import { AuthGuard } from './SM-Auth/auth-guard.guard';  

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', component: LoginComponent }, 
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: 'dashboard',
              component: UserDashboardComponent,
              canActivate: [AuthGuard], 
            },
            {
              path: 'mapview',
              component: MapviewComponent,
              canActivate: [AuthGuard],  
            },
            {
              path: 'scheduler',
              children: [
                {
                  path: 'dimming-profiles',
                  component: DimmingProfilesComponent,
                  canActivate: [AuthGuard],  
                },
                {
                  path: 'dimming-schedules',
                  component: DimmingSchedulesComponent,
                  canActivate: [AuthGuard],  
                },
              ],
            },
            {
              path: 'charts',
              component: ChartsDemoComponent,
              canActivate: [AuthGuard],  
            },
            {
              path: 'user-profile/:id',
              component: UserProfileComponent,
              canActivate: [AuthGuard],  
            },
            {
              path: 'analytics',
              component: AnalyticsComponent,
              canActivate: [AuthGuard],  
            },
            {
              path: 'assets',
              component: AssetTableComponent,
              canActivate: [AuthGuard], 
            },
          ],
        },
        { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
        { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' }, 
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
