import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MadeWithLoveModule } from '@mugan86/ng-made-with-love';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MadeWithLoveModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
