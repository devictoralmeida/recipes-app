import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs';
import { RecipesService } from './recipes.service';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root',
})
// precisamos definir o tipo de dado que vamos resolver no generics do resolve
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private storageService: DataStorageService,
    private recipeService: RecipesService
  ) {}

  // O Método resolve faz o subscribe no observable, assim o nosso resolve vai carregar os dados antes da página (q depende deles) ser carregada
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getRecipes();

    // Vamos carregar as receitas da API apenas quando o array de receitas estiver vazio
    if (recipes.length === 0) {
      return this.storageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
