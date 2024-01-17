import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public collapsed = true;
  public userSubscription: Subscription;
  public isAuthenticated: boolean = false;

  constructor(
    private storageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe({
      next: (user) => {
        this.isAuthenticated = !!user;
      },
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public onSaveData() {
    this.storageService.storeRecipes();
  }

  public onFetchData() {
    this.storageService.fetchRecipes().subscribe();
  }

  public logout() {
    this.authService.logout();
  }
}
