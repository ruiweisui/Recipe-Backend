// reference modules
import app from './server.js'; 
import mongodb from "mongodb";
import dotenv from "dotenv";
import CommentsDAO from './dao/commentsDAO.js';
import RecipesDAO from './dao/recipesDAO.js';
import SavedDAO from './dao/savedDAO.js';
// declared async to use the asynchronous await keyword
async function main(){ 
    dotenv.config(); 
    const client = new mongodb.MongoClient(
        process.env.RECIPEAPP_DB_URI
    )
    const port = process.env.PORT || 8000;

    try { 
        //Connect to MongoDB server for every DAO
        await client.connect();
        await RecipesDAO.injectDB(client);
        await CommentsDAO.injectDB(client);
        await SavedDAO.injectDB(client);

        app.listen(port, () => { 
            console.log('Server is running on port: .'+port);
        })
    } catch(e){
        // throw exception:
        console.error(e);
        process.exit(1);
    }
}
main().catch(console.error);