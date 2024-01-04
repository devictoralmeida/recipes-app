import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public collapsed = true;

  constructor(private storageService: DataStorageService) {}

  public onSaveData() {
    this.storageService.storeRecipes();
  }

  public onFetchData() {
    this.storageService.fetchRecipes().subscribe();
  }
}
