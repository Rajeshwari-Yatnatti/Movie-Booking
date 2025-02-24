import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  //appConfig is used for global configurations like routing. You can include provideRouter(routes) in it instead of registering the router manually in main.ts.

  // you don't need NgModule at all. Instead, you bootstrap the app directly in main.ts
