import {SnippetModel} from '../models/snippetModels'

export const getAll = async (req,res) =>{
    if(!req.user){
        res.send("Unauthorized Access!");
        return;
    }
    req.query.userId = req.user.id
    try{
        let snippets = await SnippetModel.getAll(req.user.id);
        res.json(snippets);

    }catch(error){
        res.sendStatus(500);

    }
}

export const getOneById = async (req,res) =>{

    try{
        let snippets = await SnippetModel.getOneById(req.params.snippetId);
        res.json(snippets);

    }catch(error){
        console.error(error);
        if(error === 404){
            res.sendStatus(404);
        }
        
        res.sendStatus(500);

    }
}

export const getBySearchTerm = async (req,res) =>{
    if(!req.user){
        res.send("Unauthorized Access!");
        return;
    }
    req.query.userId = req.user.id
    try{
        let snippetsByKeyword = await SnippetModel.getBySearchTerm(req.user.id,req.params.search,'keywords');
        let snippetsByTitle = await SnippetModel.getBySearchTerm(req.user.id,req.params.search,'title');
        let snippetsByContent = await SnippetModel.getBySearchTerm(req.user.id,req.params.search,'content');
        let snippets = [...snippetsByKeyword,...snippetsByTitle,...snippetsByContent];
        let uniqueSnippets = getUniqueByKey(snippets,'id');
        res.json(uniqueSnippets);

    }catch(error){
        res.sendStatus(500);

    }
}

export const deleteOneById = async (req,res) =>{
    if(!req.user){
        res.send("Unauthorized Access!");
        return;
    }
    req.query.userId = req.user.id
    try{
        let snippets = await SnippetModel.deleteOneById(req.params.snippetId,req.user.id);
        res.json(snippets);

    }catch(error){
        console.error(error);
        res.sendStatus(500);

    }
}

export const save = async (req,res) =>{
    if(!req.user){
        res.send("Unauthorized Access!");
        return;
    }
    req.query.userId = req.user.id

    try{
       let result = await SnippetModel.save(req.query);
       res.json(result);
    }catch(error){
        console.error(error);
        res.sendStatus(500);
    }
}
export const update = async (req,res) =>{
    if(!req.user){
        res.send("Unauthorized Access!");
        return;
    }
    req.query.userId = req.user.id
    try{
       let result = await SnippetModel.update(req.query);
       res.json(result);
    }catch(error){
        console.error(error);
        res.sendStatus(500);
    }
}

function getUniqueByKey(inputSnippets,key){
    //based on the key remove the duplications 
    let resultsSnippets = [];
    let snippetsInArray = [];
    inputSnippets.map(snippet =>{
        if(snippetsInArray.indexOf(snippet[key]) === -1){
            //if not in array then add it to results array
            resultsSnippets.push(snippet);
            snippetsInArray.push(snippet[key]);
        }
    });
   return resultsSnippets
}
