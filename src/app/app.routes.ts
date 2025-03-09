import { Routes } from '@angular/router';
import { CoursesComponent } from '../components/Courses/courses/courses.component';
import { authGuardGuard } from '../guards/auth-guard.guard';
import { MenuComponent } from '../components/menu/menu.component';
import { LessonsComponent } from '../components/lessons/lessons.component';
import { ButtonsComponent } from '../components/ButtonsLoginRegister/buttons/buttons.component';
import { UsersForAdminComponent } from '../components/UsersForAdmin/users/users-for-admin.component';
import { HomePageComponent } from '../components/home-page/home-page.component';

export const routes: Routes = [

    {
        path: '',
        component: MenuComponent,
        canActivate: [authGuardGuard],        
    },
    {path:'homepage',component:HomePageComponent       
    },{path:"courses",component:CoursesComponent,
        children:[ 
            {path:':courseId/lessons',component:LessonsComponent}
            
        ]
    },
    {
        path:"users",component:UsersForAdminComponent
    },
    {path:"login", component:MenuComponent}


];
