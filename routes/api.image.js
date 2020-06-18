module.exports=(router)=>{
    const auth = require("../helpers/api-auth");//authorization module
    imageCltr=require("../controllers/controller.image");//user control module
    let UserUpld = require('../helpers/common-service'); /*Media Upload */
    router.post('/upload-image', auth.isAuthenticated,auth.checkToken,auth.userExist,UserUpld.upload.array('photos'), imageCltr.UploadImage);
    return router;
}