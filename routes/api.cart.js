module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    cartCltr=require("../controllers/controller.cart");//user control module
    router.post('/add-to-cart',auth.isAuthenticated,auth.checkToken,cartCltr.AddToCart);
    router.post('/add-quantity',auth.isAuthenticated,auth.checkToken,cartCltr.AddQuantity);
    router.post('/subtract-quantity',auth.isAuthenticated,auth.checkToken,cartCltr.subtractQuantity);
    router.post('/double-ticket',auth.isAuthenticated,auth.checkToken,cartCltr.DoubleTicket);
    router.get('/user-cart',auth.isAuthenticated,auth.checkToken,cartCltr.UserCart);
    return router;
}