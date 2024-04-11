import RecipesDAO from '../dao/recipesDAO.js';

export default class RecipesController {

    static async apiGetRecipes(req, res, next) {
        const recipesPerPage = req.query.recipesPerPage ?
            parseInt(req.query.recipesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.meal) {
            filters.meal = req.query.meal; // meal type
        } else if (req.query.userId) {
            filters.userId = req.query.userId; // author
        }else if (req.query.title) {
            filters.title = req.query.title; // recipe name
        }
        else if (req.query.difficulty) {
            filters.difficulty = req.query.difficulty; // difficulty
        }
        else if (req.query.dietary) {
            filters.dietary = req.query.dietary; // dietary restrictions
        }

        const { recipesList, totalNumRecipes } = await RecipesDAO.getRecipes({ filters, page, recipesPerPage });

        let response = { // display recipes on page
            recipes: recipesList,
            page: page,
            filters: filters,
            entries_per_page: recipesPerPage,
            total_results: totalNumRecipes,
        };

        res.json(response);
    }

    static async apiGetRecipeById(req, res, next) { // get recipe by id
        try {
            let id = req.params.id || {}
            let recipe = await RecipesDAO.getRecipeById(id);
            if (!recipe) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(recipe);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetMeal(req, res, next) { // get meal types
        try {
            let propertyTypes = await RecipesDAO.getMeal();
            res.json(propertyTypes);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiGetDifficulty(req, res, next) { // get difficulty types
        try {
            let propertyTypes = await RecipesDAO.getDifficulty();
            res.json(propertyTypes);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiGetDietary(req, res, next) { // get dietary restriction types
        try {
            let propertyTypes = await RecipesDAO.getDietary();
            res.json(propertyTypes);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiGetListOfRecipesByIds(req, res, next) { // return list of recipes using saved IDs
        try {
            let ids = req.params.ids || [];
            let idArray = JSON.parse(ids);
            let recipes = await RecipesDAO.getRecipesByIds(idArray);
            if (!recipes) {
                res.status(404).json({error: "not found"});
                return;
            }
            res.json(recipes);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e });
        }
    }

    static async apiPostRecipe(req, res, next){
      try {
        const recipe_name = req.body.recipe_name;
        const meal = req.body.meal;
        const difficulty = req.body.difficulty;
        const dietary = req.body.dietary;
        const picture = req.body.picture;
        const content = req.body.content;
        const userInfo = {
          name: req.body.name,
          _id: req.body.user_id
        }

        const date = new Date();

        const HttpResponse = await RecipesDAO.addRecipe(
          recipe_name,
          meal,
          difficulty,
          dietary, 
          picture,
          content, 
          userInfo,
          date
        );

        var { error } = HttpResponse;
            if (error) {
                res.status(500).json({ error: "Unble to post recipe." });
            } else {
                res.json({ status: "success"});
            }

      } catch(e) {
        res.status(500).json({ error: e.message})
      }
    }


    static async apiUpdateRecipe(req, res, next){
        try {
            const recipe_id = req.body.recipe_id;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const recipe_name = req.body.recipe_name;
            const meal = req.body.meal;
            const difficulty = req.body.difficulty;
            const dietary = req.body.dietary;
            const picture = req.body.picture;
            const content = req.body.content;
            const date = new Date();
            const recipeResponse = await RecipesDAO.updateRecipe(
                recipe_id,
                recipe_name,
                meal,
                difficulty,
                dietary, 
                picture,
                content,
                userInfo,
                date
            );
            var {error} = recipeResponse;
                if(error){
                    res.status(500).json({error:"Unable to update recipe"});
                } 
                if(recipeResponse.modifiedCount==0){
                    throw new Error ("No recipe modifications made.")
                }
                res.json({status:"success "});
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiDeleteRecipe(req, res, next){
        try{
            const recipe_id = req.body.recipe_id;
            const user_id = req.body.user_id;
            const recipeResponse = await RecipesDAO.deleteRecipe(
                recipe_id,
                user_id
            );
            var {error} = recipeResponse;
            if(error){
                res.status(500).json({error:"Unable to delete recipe"});
            } else{
                res.json({status:"successfully deleted!"});
            }
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }


}