import CommentsDAO from "../dao/commentsDAO.js";
export default class CommentsController{
    static async apiPostComment(req, res, next){
        try{
            const recipeId = req.body.recipe_id;
            const comment = req.body.comment;
            const userInfo = {
                name: req.body.name,
                _id:req.body.user_id
            }
            const date = new Date();
            const commentResponse = await CommentsDAO.addComment(
                recipeId,
                userInfo,
                comment,
                date
            );
            var {error} = commentResponse;
            console.log(error);
            if(error){
                res.status(500).json({error:"Unable to post comment"});
            } else{
                res.json({status:"success"});
            }
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }
    static async apiUpdateComment(req, res, next){
        try{
            const comment_id = req.body.comment_id;
            const comment = req.body.comment;
            const date = new Date();
            const commentResponse = await CommentsDAO.updateComment(
                comment_id,
                req.body.user_id,
                comment,
                date
            )
            var {error} = commentResponse;
            if(error){
                res.status(500).json({error:"Unable to update comment"});
            } 
            if(commentResponse.modifiedCount==0){
                throw new Error ("Unable to update comment.")
            }
            res.json({status:"success "});
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }
    static async apiDeleteComment(req, res, next){
        try{
            const comment_id = req.body.comment_id;
            const userId = req.body.user_id;
            const commentResponse = await CommentsDAO.deleteComment(
                comment_id,
                userId
            );
            var {error} = commentResponse;
            if(error){
                res.status(500).json({error:"Unable to delete comment"});
            } else{
                res.json({status:"successfully deleted!"});
            }
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiGetComments(req,res,next){
        try{
            let recipe_id = req.params.recipeId;
            let finding_comments = await CommentsDAO.getComments(recipe_id);
            if(!finding_comments){
                res.status(404).json({error:"not found"});
                return
            }
            res.json(finding_comments);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({error:e});
        }
    }
}