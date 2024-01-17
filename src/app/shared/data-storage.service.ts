import { AuthService } from './../auth/auth.service';
import { RecipesService } from './../recipes/recipes.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private baseUrl: string =
    'https://recipes-backend-c5750-default-rtdb.firebaseio.com/recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipesService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // Não retornamos o observable pq não vamos fazer o subscribe dele no Header.
    this.http.put<Recipe[]>(this.baseUrl, recipes).subscribe();
  }

  fetchRecipes(): Observable<Recipe[]> {
    // O token no firebase deve ser inserido por query Params e não no Header.
    return this.http.get<Recipe[]>(this.baseUrl).pipe(
      map((recipes) => {
        const modifyRecipes = recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ?? [],
          };
        });
        return modifyRecipes;
      }),
      // O tap nos permite executar algum codigo ao longo da stream de eventos do Observable, sem moficiar os dados que estão sendo transmitidos
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
