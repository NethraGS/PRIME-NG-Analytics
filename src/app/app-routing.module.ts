import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './login/login.component';
import { MapviewComponent } from './map-view/map-view.component'; 
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component'; 
import { DimmingProfilesComponent } from './dimming-profiles/dimming-profiles.component'; 
import { DimmingSchedulesComponent } from './dimming-schedules/dimming-schedules.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ChartsDemoComponent } from './demo/components/uikit/charts/chartsdemo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AnalyticsComponent } from './analytics/analytics.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            // Route for Login as the default page
            { path: '', component: LoginComponent }, 

            {
                path: '', component: AppLayoutComponent,
                children: [
                    // Existing Routes for Demo Components
                    { path: 'dashboard', component: UserDashboardComponent },
                    { path: 'mapview', component: MapviewComponent },
                    { path: 'admin-dashboard', component: AdminDashboardComponent }, 
                    {
                        path: 'scheduler',
                        children: [
                            { path: 'dimming-profiles', component: DimmingProfilesComponent },
                            { path: 'dimming-schedules', component: DimmingSchedulesComponent }
                        ]
                    },
                    { path: 'charts', component: ChartsDemoComponent },
                    { path: 'user-profile/:id', component: UserProfileComponent },
                    { path: 'analytics', component: AnalyticsComponent }
                ]
            },
            // Additional Routes (Authentication, Landing, Not Found)
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' }, // Fallback route for 404
        ], 
        { 
            scrollPositionRestoration: 'enabled', 
            anchorScrolling: 'enabled', 
            onSameUrlNavigation: 'reload' 
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
