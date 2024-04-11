import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let recipes;

export default class RecipesDAO {
    static async injectDB(conn) {
        if (recipes) {
            return;
        }
        try {
            recipes = await conn.db(process.env.RECIPEAPP_NS)
                .collection('recipes');
        } catch (e) {
            console.error(`Unable to connect in RecipesDAO: ${e}`);
        }
    }

    static async getRecipes({
        filters = null,
        page = 0,
        recipesPerPage = 20,} = {}) { 
        let query;
        if (filters) {
            if ("title" in filters) { // find by title
                query = {
                    $text: {
                        $search: filters['title']
                    }
                };
            } else if ("userId" in filters) { // find recipes by an author (ie. clicking on their names to get recipes)
                query = {
                    "userId": {
                        $eq: filters['userId']
                    }
                }
            } else if ("meal" in filters) { // filter by meal
                query = {
                    "meal": {
                        $eq: filters['meal']
                    }
                }
            }
            else if ("difficulty" in filters) { // filter by difficulty
                query = {
                    "difficulty": {
                        $eq: filters['difficulty']
                    }
                }
            }
            else if ("dietary" in filters) { // filter by dietary restrictions
                query = {
                    "dietary": {
                        $eq: filters['dietary']
                    }
                }
            }
        }

        let cursor;
        try {
            cursor = await recipes.find(query).limit(recipesPerPage).skip(recipesPerPage * page);
            const recipesList = await cursor.toArray();
            const totalNumRecipes = await recipes.countDocuments(query);
            return { recipesList, totalNumRecipes };
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { recipesList: [], totalNumRecipes: 0 };
        }
    }

    static async getMeal() { // meal types
        let meals = [];
        try {
            meals = await recipes.distinct("meal");
            return meals;
        } catch (e) {
            console.error(`Unable to get meals, ${e}`);
            return meals;
        }
    }
    static async getDifficulty() { // difficulty types
        let difficulties = [];
        try {
            difficulties = await recipes.distinct("difficulty");
            return difficulties;
        } catch (e) {
            console.error(`Unable to get difficulties, ${e}`);
            return difficulties;
        }
    }
    static async getDietary() { // dietary restriction types
        let dietaries = [];
        try {
            dietaries = await recipes.distinct("dietary");
            return dietaries;
        } catch (e) {
            console.error(`Unable to get dietary restrictions, ${e}`);
            return dietaries;
        }
    }

    static async getRecipeById(id) { // get one recipe using _id
        try {
            return await recipes.aggregate([{
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'recipe_id',
                        as: 'comments',
                    }
                }
            ]).next();
        } catch (e) {
            console.error(`Something went wrong in getRecipeById: ${e}`);
            throw e;
        }

    }

    static async getRecipesByIds(ids) { // get list of recipes using list of _ids
        try {
            let objIds = ids.map(id => ObjectId(id));
            let recipesList = await recipes.find({ _id: { $in: objIds } });
            let recipesArray = await recipesList.toArray();
            return recipesArray;
        } catch (e) {
            console.error(`Something went wrong in getRecipesByIds:${e}`);
            throw e;
        }
    }

    static async addRecipe(recipe_name, meal, difficulty, dietary, picture, content, user, date){
      try {
          meal = meal.toLowerCase()
          dietary = dietary.toLowerCase()
          difficulty = difficulty.toLowerCase()
        const recipeDoc = {
            name: user.name,
            user_id: user._id,
            meal: meal,
            difficulty: difficulty,
            dietary: dietary,
            picture: picture,
            content: content,
            recipe_name: recipe_name,
            date:date
        }
        return await recipes.insertOne(recipeDoc);
    }
    catch(e) {
        console.error(`Unable to post review: ${e}`)
        return { error: e };
    }
    }

    static async updateRecipe(recipe_id, recipe_name, meal, difficulty, dietary, picture, content, user, date){
        try{
            meal = meal.toLowerCase()
            dietary = dietary.toLowerCase()
            difficulty = difficulty.toLowerCase()
            const updateResponse = await recipes.updateOne(
                {_id:ObjectId(recipe_id),
                user_id: user._id
                },
                {$set:{
                    meal:meal,
                    difficulty: difficulty,
                    dietary: dietary,
                    picture: picture,
                    content: content,
                    recipe_name: recipe_name,
                    date: date
                }}
            )
            return updateResponse
        }
        catch(e){
            console.error(`Unable to update recipe: ${e}`);
            return{error:e};
        }
        
    }
    static async deleteRecipe(recipeId, user_id){
        try{
            const deleteResponse = await recipes.deleteOne({
                _id: ObjectId(recipeId),
                user_id: user_id,
            });
            return deleteResponse;
        } catch(e){
            console.error(`Unable to delete recipe: ${e}`);
            return{error: e}
        }
    }
}