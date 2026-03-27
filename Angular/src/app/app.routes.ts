import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { VideosComponent } from './components/videos/videos.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [publicGuard] },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },  // public routes
  { path: 'signup', component: SignupComponent },

  { path: 'subjects', component: SubjectsComponent, canActivate: [authGuard] },  // protected  routes
  {
    path: 'subjects/videos/:id',
    component: VideosComponent,
    canActivate: [authGuard],
  }, 
  { path: '**', redirectTo: '' },
];