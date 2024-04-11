let savedCollection;

export default class SavedDAO{
    static async injectDB(conn){
        if(savedCollection){
            return;
        }
        try{
            savedCollection = await conn.db(process.env.RECIPEAPP_NS).collection('saved');
        } 
        catch(e){
            console.error(`Unable to connect in SavedDAO: ${e}`);
        }
    }

    static async updateSaved(userId, saved){
        try{
            const updateResponse = await savedCollection.updateOne(
                {_id: userId },
                {$set: {saved:saved}},
                {upsert:true}
            )
            return updateResponse
        }
        catch(e){
            console.error(`Unable to update saved: ${e}`);
            return{error:e};
        }
    }

    static async getSaved(id){
        let cursor;
        try{
            cursor = await savedCollection.find({
                _id:id
            });
            const saved = await cursor.toArray();
            return saved[0];
        } catch(e){
            console.error(`Something went wrong in getSaved: ${e}`);
            throw e;
        }
    }
}