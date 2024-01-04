import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipes: Recipe[] = []
  public recipesChanged: Subject<Recipe[]> = new Subject<Recipe[]>();
  /*
  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A Super Tasty Schnitzel - just awesome',
      'https://mydinner.co.uk/wp-content/uploads/2022/02/cordon-blue-schnitzel-1-1024x1024.jpg',
      [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    ),
    new Recipe(
      'Big Fat Burguer',
      'What else you need to say?',
      'https://dantoombs.com/wp-content/uploads/2015/01/ff1.jpg',
      [
        new Ingredient('Bread', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Cheddar Cheese', 2),
      ]
    ),
  ];
  */
  constructor(private shoppingListService: ShoppingListService) {}

  public getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  public setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  public addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    // this.shoppingListService.addIngredients(ingredients);
    ingredients.forEach((ingredient: Ingredient) =>
      this.shoppingListService.addIngredient(ingredient)
    );
  }

  public getRecipe(index: number): Recipe {
    const correctIndex = index - 1;
    return this.recipes[correctIndex];
  }

  public addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  public updateRecipe(index: number, newRecipe: Recipe): void {
    // this.recipes[index] = newRecipe;
    const correctIndex = index - 1;
    this.recipes[correctIndex] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  public deleteRecipe(index: number): void {
    // this.recipes.splice(index, 1);
    const correctIndex = index - 1;
    this.recipes.splice(correctIndex, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
