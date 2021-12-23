import { Routes } from '@angular/router';
import { SitesComponent } from './sites.component';
import { MainComponent } from './components/main/main.component';


export let SitesRouter: Routes = [
    {path: '', component: SitesComponent, children: [
        {path: ':sectionScope', component: MainComponent},
        {path: '', component: MainComponent}
    ]},
];
