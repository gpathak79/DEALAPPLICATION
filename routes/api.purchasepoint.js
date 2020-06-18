module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    PointCltr = require("../controllers/controller.purchasepoint");//Purchase Point control module
    router.post('/user-points',auth.isAuthenticated,auth.checkToken,auth.userExist,PointCltr.AddPurchasePoint);
    router.get('/point-list',auth.isAuthenticated,auth.checkToken,auth.userExist,PointCltr.PurchasePointList);
    return router; 
}