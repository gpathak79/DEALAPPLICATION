module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    UserCltr=require("../controllers/controller.user");//user control module
    UserVal=require("../helpers/joi_validator");
    router.post('/check-mobile-number', auth.isAuthenticated, UserCltr.checkMobileNumbers);
    router.post('/resend-otp',auth.isAuthenticated,UserCltr.resendOtp);
    router.post('/apply-coupon',auth.isAuthenticated,UserCltr.ApplyCoupon);
    router.post('/user-registration',auth.isAuthenticated,UserVal.Signup,UserCltr.Registration);
    router.post('/login',auth.isAuthenticated,UserCltr.Login);
    router.post('/sociallogin',auth.isAuthenticated,UserCltr.SocialLogin);
    router.post('/forgot-password',auth.isAuthenticated,UserCltr.ForgotPassword);
    router.post('/change-password',auth.isAuthenticated,auth.checkToken,UserCltr.ChangePassword);
    router.post('/logout',auth.isAuthenticated,auth.checkToken,auth.userExist,UserCltr.Logout);
    router.get('/products', auth.isAuthenticated, auth.checkToken, UserCltr.Products);
    router.get('/products-details',auth.isAuthenticated,UserCltr.ProductDetails);
    router.get('/home', auth.isAuthenticated, auth.checkToken, UserCltr.Homes);
    router.get('/campaign-details',auth.isAuthenticated, auth.checkToken, UserCltr.CampaignDetails);
    router.get('/personalize-details',auth.isAuthenticated,UserCltr.Personalize);
    router.get('/countryies-data',auth.isAuthenticated,UserCltr.CountryiesData);
    router.post('/verify-otp',auth.isAuthenticated,UserVal.VerifyOtp,UserCltr.VerifyOtp);
    //router.post('/add-products',auth.isAuthenticated,UserCltr.AddProducts);
    //router.post('/add-campaigns',auth.isAuthenticated,UserCltr.AddCampaigns);
    router.post('/add-wishlist',auth.isAuthenticated,auth.checkToken,UserVal.Wishlist,auth.userExist,UserCltr.Wishlist);
    router.post('/delete-wishlist-product',auth.isAuthenticated,auth.checkToken,UserVal.removeWishlist,auth.userExist,UserCltr.DeleteWishlistProduct);
    router.get('/wishlist',auth.isAuthenticated,auth.checkToken,auth.userExist,UserCltr.getWishlistProduct);
    router.delete('/delete-user',auth.isAuthenticated,UserCltr.DeleteUser);
    router.post('/device-signature',auth.isAuthenticated,auth.checkToken,UserCltr.DeviceSignature);
    router.post('/user-information',auth.isAuthenticated,UserVal.UserInformation,auth.checkToken,UserCltr.UserInformation);
    router.get('/i-level',auth.isAuthenticated,auth.checkToken,UserCltr.iLevel);
    router.get('/i-points',auth.isAuthenticated,auth.checkToken,auth.userExist,UserCltr.iPoints);
    router.post('/check-mobile-number',auth.isAuthenticated,auth.checkToken,auth.userExist,UserCltr.CheckMobileNumber);
    // router.post('/get-cuurency',UserCltr.CheckCurrency);
    return router;
}