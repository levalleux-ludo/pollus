import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { PollListComponent } from './poll-list/poll-list.component';
import { PollDetailsComponent } from './poll-details/poll-details.component';

@NgModule({
  declarations: [AppComponent, PollListComponent, PollDetailsComponent],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: PollListComponent},
      { path: 'polls', component: PollListComponent },
      { path: 'polls/:pollId', component: PollDetailsComponent },
    ])
  ]
})
export class AppModule {}
