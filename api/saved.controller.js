import SavedDAO from '../dao/savedDAO.js';

export default class SavedController{
    static async apiUpdateSaved(req,res,next){
        try{
            const SavedResponse = await SavedDAO.updateSaved(
                req.body._id,
                req.body.saved
            )
            var {error} = SavedResponse
            if(error){
                res.status(500).json({error});
            }
            if(SavedResponse.modifiedCount===0){
                throw new Error("Unable to update saved.")
            }
            res.json({status:"success"});
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiGetSaved(req,res,next){
        try{
            let id = req.params.id;
            let saved = await SavedDAO.getSaved(id);
            if(!saved){
                res.status(404).json({error:"No saved favorites"});
                return
            }
            res.json(saved);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({error:e});
        }
    }
}