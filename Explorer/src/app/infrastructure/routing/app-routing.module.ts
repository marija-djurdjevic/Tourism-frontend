import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { UserProfileComponent } from 'src/app/feature-modules/layout/user-profile/user-profile.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { ClubsComponent } from 'src/app/feature-modules/tour-authoring/clubs/clubs.component';
import { Object } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object/object.component';
import { ObjectFormComponent } from 'src/app/feature-modules/tour-authoring/object-form/object-form.component';
import { TourPreferencesComponent } from 'src/app/feature-modules/tour-execution/tour-preferences/tour-preferences.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component';
import { UserRatingComponent } from 'src/app/feature-modules/layout/user-rating/user-rating.component';
import { RatingsListComponent } from 'src/app/feature-modules/layout/ratings-list/ratings-list.component';
import { ProblemReportComponent } from 'src/app/feature-modules/tour-execution/problem-report/problem-report.component';
import { TourReviewComponent } from 'src/app/feature-modules/tour-authoring/tour-review/tour-review.component';
import { TourReviewFormComponent } from 'src/app/feature-modules/tour-authoring/tour-review-form/tour-review-form.component';
import { ProblemFormComponent } from 'src/app/feature-modules/tour-execution/problem-form/problem-form.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { KeyPointComponent } from 'src/app/feature-modules/tour-authoring/key-point/key-point/key-point.component';
import { KeyPointFormComponent } from 'src/app/feature-modules/tour-authoring/key-point-form/key-point-form.component';
import { BlogOverview } from 'src/app/feature-modules/blog/blog-overview/blog-overview-component';
import { ImageComponent } from '../../shared/image/image.component';
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/tour-shopping/shopping-cart/shopping-cart.component';
import { ExploreToursComponent } from 'src/app/feature-modules/tour-shopping/explore-tours/explore-tours.component';
import { ProblemsListComponent } from 'src/app/feature-modules/tour-execution/problems-list/problems-list.component';
import { TouristLocationComponent } from 'src/app/feature-modules/tour-execution/tourist-location/tourist-location.component';
import { TourSearchComponent } from 'src/app/feature-modules/marketplace/tour-search/tour-search.component';
import { TourProblemComponent } from 'src/app/feature-modules/tour-execution/tour-problem/tour-problem.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-shopping/purchased-tours/purchased-tours.component';
import { TourSessionComponent } from 'src/app/feature-modules/tour-execution/tour-session/tour-session.component';
import { TourListComponent } from 'src/app/feature-modules/tour-execution/tour-list/tour-list.component';
import { PublishRequest } from 'src/app/feature-modules/tour-execution/model/publish-request.model';
import { PublishRequestComponent } from 'src/app/feature-modules/tour-execution/publish-request-list/publish-request-list.component';
import { EncounterComponent } from 'src/app/feature-modules/administration/encounter/encounter.component';
import { EncounterFormComponent } from 'src/app/feature-modules/administration/encounter-form/encounter-form.component';
import { EncountersComponent } from 'src/app/feature-modules/encounters/encounters/encounters.component';
import { AddEncounterComponent } from 'src/app/feature-modules/encounters/add-encounter/add-encounter.component';
import { WalletComponent } from 'src/app/feature-modules/tour-shopping/wallet/wallet.component';
import { KeyPointUpdateFormComponent } from 'src/app/feature-modules/tour-authoring/key-point-update-form/key-point-update-form.component';
import { BundleComponent } from 'src/app/feature-modules/tour-shopping/bundles/bundle.component';
import { BundleCreateComponent } from 'src/app/feature-modules/tour-shopping/bundle-create/bundle-create.component';
import { ExploreBundlesComponent } from 'src/app/feature-modules/tour-shopping/explore-bundles/explore-bundles.component';
import { SalesComponent } from 'src/app/feature-modules/tour-shopping/sales/sales.component';
import { ExploreToursComponent as AllTours } from 'src/app/feature-modules/tour-authoring/explore-tours/explore-tours';
import { GroupTourFormComponent } from 'src/app/feature-modules/tour-authoring/group-tour-form/group-tour-form.component';
import { BundleToursComponent } from 'src/app/feature-modules/tour-shopping/bundle-tours/bundle-tours.component';
import { StoryFormComponent } from 'src/app/feature-modules/library/story-form/story-form.component';
import { LibraryListComponent } from 'src/app/feature-modules/library/library-list/library-list.component';
import { BookComponent } from 'src/app/feature-modules/library/book/book.component';
import { BookFormComponent } from 'src/app/feature-modules/library/book-form/book-form.component';
import { BookListComponent } from 'src/app/feature-modules/library/book-list/book-list.component';


const routes: Routes = [
  {
    path: 'key-points/:tourId',
    component: KeyPointComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'key-points-form/:tourId',
    component: KeyPointFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'comments/:blogId', component: CommentComponent },
  { path: 'image', component: ImageComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'clubs', component: ClubsComponent },
  { path: 'object', component: ObjectComponent },
  { path: 'objectForm', component: ObjectFormComponent },
  { path: 'tours', component: TourComponent, canActivate: [AuthGuard] },
  { path: 'add-tour', component: TourFormComponent, canActivate: [AuthGuard] },
  {
    path: 'tour-equipment',
    component: TourEquipmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tour-preferences',
    component: TourPreferencesComponent,
    canActivate: [AuthGuard],
  },
  // {path: 'problemRep', component: ProblemReportComponent, canActivate: [AuthGuard]},
  {
    path: 'problem',
    component: TourProblemComponent,
    canActivate: [AuthGuard],
  }, //
  {
    path: 'problems',
    component: ProblemsListComponent,
    canActivate: [AuthGuard],
  }, //
  {
    path: 'report/:tourId',
    component: ProblemFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tourReviews',
    component: TourReviewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'blogs', component: BlogOverview, canActivate: [AuthGuard] },
  {
    path: 'user-rating',
    component: UserRatingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ratings-list',
    component: RatingsListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  {
    path: 'explore-tours',
    component: ExploreToursComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'location',
    component: TouristLocationComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'add-encounter/:id',
    component: AddEncounterComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'tour-search',
    component: TourSearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'purchasedTours',
    component: PurchasedToursComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'review/:tourId/:tourName',
    component: TourReviewFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'encounters',
    component: EncounterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'encounter-form',
    component: EncounterFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'tourSession/:tourId', component: TourSessionComponent },
  { path: 'tourList', component: TourListComponent },

  { path: 'explore', component: ExploreToursComponent },
  { path: 'encountersMap', component: EncountersComponent },
  {
    path: 'wallet',
    component: WalletComponent,
    canActivate: [AuthGuard],
  },

  { path: 'publishRequestList', component: PublishRequestComponent, canActivate: [AuthGuard] },
  { path: 'key-points/edit/:id', component: KeyPointUpdateFormComponent },

  {
    path: 'bundles',
    component: BundleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bundle-create',
    component: BundleCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'publishRequestList',
    component: PublishRequestComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always' 
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'explore-bundles',
    component: ExploreBundlesComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'story-form/:id/:tourId',
    component:StoryFormComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'create-book/:entityId/:requestId',
    component: BookFormComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-story-to-book/:entityId/:requestId',
    component: BookListComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path:'library',
    component:LibraryListComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'book/:id',
    component:BookComponent,
    canActivate:[AuthGuard]
  },

  {
    path: 'bundle/:bundleId/author/:authorId',
    component: BundleToursComponent,
    canActivate: [AuthGuard],
  },

  //{ path: 'explore', component: AllTours },
  { path: 'add-group-tour', component: GroupTourFormComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
