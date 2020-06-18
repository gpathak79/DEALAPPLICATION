module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    ticketCltr = require("../controllers/controller.tickets");//ticket control module
    router.post('/user-order', auth.isAuthenticated, auth.checkToken, ticketCltr.UserOrder);
    router.get('/my-tickets', auth.isAuthenticated, auth.checkToken, ticketCltr.MyTickets);
    return router;
}