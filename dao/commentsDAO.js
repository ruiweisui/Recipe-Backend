import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let comments;

export default class CommentsDAO{
    static async injectDB(conn){
        if(comments){
            return;
        }
        try{
            comments = await conn.db(process.env.RECIPEAPP_NS).collection('comments');
        } catch(e){
            console.error(`Unable to establish connection handle in commentsDAO: ${e}`);
        }
    }
    static async addComment(recipeId, user, comment, date){
        try{
            const commentDoc={
                name: user.name,
                user_id:user._id,
                date:date,
                comment:comment,
                recipe_id: ObjectId(recipeId)
            }
            return await comments.insertOne(commentDoc);
        }
        catch(e){
            console.error(`Unable to post comment: ${e}`)
            return{error:e};
        }
    }
    static async updateComment(commentId, userId, comment, date){
        try{
            const updateResponse = await comments.updateOne(
                {user_id: userId, _id:ObjectId(commentId)},
                {$set:{comment:comment, date: date}}
            )
            return updateResponse
        }
        catch(e){
            console.error(`Unable to update comment: ${e}`);
            return{error:e};
        }
        
    }
    static async deleteComment(commentId, userId){
        try{
            const deleteResponse = await comments.deleteOne({
                _id: ObjectId(commentId),
                user_id: userId,
            });
            return deleteResponse;
        } catch(e){
            console.error(`Unable to delete comment: ${e}`);
            return{error: e}
        }
    }


    static async getComments(recipe_id){
        let cursor;
        try{
            cursor = await comments.find({
                recipe_id: ObjectId(recipe_id)
            });
            const commentsList = await cursor.toArray();
            return commentsList;
        } catch(e){
            console.error(`Unable to find comments: ${e}`);
            throw e;
        }
    }
}