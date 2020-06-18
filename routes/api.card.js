module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    UserVal=require("../helpers/joi_validator");
    cardCltr=require("../controllers/controller.card");//user control module
    router.post('/add-card',auth.isAuthenticated,auth.checkToken,UserVal.AddUserCard,auth.userExist,cardCltr.AddUserCard);
    router.delete('/delete-card',auth.isAuthenticated,auth.checkToken,auth.userExist,cardCltr.DeleteCard);
    router.get('/card-list',auth.isAuthenticated,auth.checkToken,auth.userExist,cardCltr.CardList);
	router.post('/delete-user',auth.isAuthenticated,cardCltr.DeleteUser);    
    router.post('/email-check',auth.isAuthenticated,cardCltr.EmailCheck);
    return router;
}