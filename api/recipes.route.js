import express from 'express';
import RecipesController from './recipes.controller.js';
import CommentsController from './comments.controller.js';
import SavedController from './saved.controller.js';


const router = express.Router();
// read recipes
router.route("/").get(RecipesController.apiGetRecipes);
router.route("/id/:id").get(RecipesController.apiGetRecipeById);
router.route("/ids/:ids").get(RecipesController.apiGetListOfRecipesByIds);
// categories for filtering recipes
router.route("/meal").get(RecipesController.apiGetMeal);
router.route("/difficulty").get(RecipesController.apiGetDifficulty);
router.route("/dietary").get(RecipesController.apiGetDietary);
// rest of crud operations for recipes
router.route("/").post(RecipesController.apiPostRecipe);
router.route("/").put(RecipesController.apiUpdateRecipe);
router.route("/").delete(RecipesController.apiDeleteRecipe);
// get comments using a recipe id
router.route("/comments/:recipeId").get(CommentsController.apiGetComments);
// rest of crud operations for comments
router.route("/comments").post(CommentsController.apiPostComment);
router.route("/comments").put(CommentsController.apiUpdateComment);
router.route("/comments").delete(CommentsController.apiDeleteComment);
// update and retrieve saved recipes
router.route("/saved").put(SavedController.apiUpdateSaved);
router.route("/saved/:id").get(SavedController.apiGetSaved); // for a given user id

export default router;