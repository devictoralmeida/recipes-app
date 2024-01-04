import { RecipesService } from './../recipes.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  public id: number;
  public editMode: boolean = false;
  public recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService,
    private router: Router,
    private storeService: DataStorageService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null ? true : false;
      this.initForm();
    });
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe.ingredients) {
        // Como a receita deve ter 2 formControl (name e amount), cada ingrediente será um formGroup.
        for (let currentIngredient of recipe.ingredients) {
          const ingredient = new FormGroup({
            name: new FormControl(currentIngredient.name, Validators.required),
            amount: new FormControl(currentIngredient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/),
            ]),
          });

          recipeIngredients.push(ingredient);
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  public onSubmit(): void {
    // const recipeName = this.recipeForm.value['name'];
    // const recipeDescription = this.recipeForm.value['description'];
    // const recipeImagePath = this.recipeForm.value['imagePath'];
    // const recipeIngredients = this.recipeForm.value['ingredients'];

    // const newRecipe = new Recipe(
    //   recipeName,
    //   recipeDescription,
    //   recipeImagePath,
    //   recipeIngredients
    // );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.storeService.storeRecipes();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public onAddIngredient(): void {
    const ingredient = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });

    (<FormArray>this.recipeForm.get('ingredients')).push(ingredient);
  }

  public onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  public onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
