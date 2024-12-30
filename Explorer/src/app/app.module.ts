import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { BlogModule } from './feature-modules/blog/blog.module';
import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { TourAuthoringModule } from './feature-modules/tour-authoring/tour-authoring.module';
import { TourExecutionModule } from './feature-modules/tour-execution/tour-execution.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TourShoppingModule } from './feature-modules/tour-shopping/tour-shopping.module';
import { EncountersComponent } from './feature-modules/encounters/encounters/encounters.component';
import { SharedModule } from "./shared/shared.module";
/*import { StoryFormComponent } from './feature-modules/library/story-form/story-form.component';
import { LibraryListComponent } from './feature-modules/library/library-list/library-list.component';
import { BookComponent } from './feature-modules/library/book/book.component';
import { BookFormComponent } from './feature-modules/library/book-form/book-form.component';
import { BookListComponent } from './feature-modules/library/book-list/book-list.component';*/
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationComponent } from './shared/notification/notification.component';
import { StoryModule } from './feature-modules/library/story.module';

@NgModule({
  declarations: [
    AppComponent,
    EncountersComponent,
  /*  StoryFormComponent,
    LibraryListComponent,
    BookComponent,
    BookFormComponent,
    BookListComponent*/
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    AdministrationModule,
    BlogModule,
    MarketplaceModule,
    TourAuthoringModule,
    TourExecutionModule,
    TourShoppingModule,
    AuthModule,
    HttpClientModule,
    StoryModule,
    /*
      OVO JE ZAMJENJENO SA NOTIFICATION SERVICE, OD SADA NJEGA KORISTITI
    MatSnackBarModule,
    */
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    SharedModule,
    MatDatepickerModule,
    MatDialogModule
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
