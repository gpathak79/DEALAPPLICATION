
exports.strAR='-prizeDetails.labelAR -prizeDetails.titleAR -prizeDetails.desAR -productDetails.titleAR -productDetails.desAR -priceInfo.priceLabelAR -priceInfo.taxDesAR -priceInfo.priceAR';
exports.strEN='-prizeDetails.labelEN -prizeDetails.titleEN -prizeDetails.desEN -productDetails.titleEN -productDetails.desEN -priceInfo.priceLabelEN -priceInfo.taxDesEN -priceInfo.priceEN';


    //using multer to store files
    var storage = multer.diskStorage({
        filename: (req, file, cb) => {
          console.log(file);
          var filetype = '';
          if(file.mimetype === 'image/gif') {
            filetype = 'gif';
          }
          if(file.mimetype === 'image/png') {
            filetype = 'png';
          }
          if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
          }
          cb(null, 'image-' + Date.now() + '.' + filetype);
        }
    });
    exports.upload = multer({storage: storage});
    
//Products Api English
exports.productEnglish=(val)=>
{
var array =[]
for (let index = 0; index < val[0].length; index++) {
    array.push({
        _id:val[0][index]._id,
        prizeDetails : {
            label : val[0][index].prizeDetails.labelEN,   
            title: val[0][index].prizeDetails.titleEN,              
            des : val[0][index].prizeDetails.desEN,
        },
        productDetails : {
            title : val[0][index].productDetails.titleEN,
            des : val[0][index].productDetails.desEN,
            image :val[0][index].productDetails.image,
        },
        priceInfo : {
            priceLabel : val[0][index].priceInfo.priceLabelEN,      
            taxDes : val[0][index].priceInfo.taxDesEN,
            price : val[0][index].priceInfo.priceEN,
            currency : val[0][index].priceInfo.currency
        },
        sell : {
            total : val[0][index].sell.total,
            sold : val[0][index].sell.sold,
        }
    })

}
return array;
}


//Products APi Arabic 

exports.productArabic=(data)=>
{
var array =[]
for (let index = 0; index < data[0].length; index++) {

    array.push({

        _id:data[0][index]._id,
        prizeDetails : {
            label : data[0][index].prizeDetails.labelAR,
          
            title: data[0][index].prizeDetails.titleAR,
           
            des : data[0][index].prizeDetails.desAR,
           
        },
        productDetails : {
            title : data[0][index].productDetails.titleAR,

            des : data[0][index].productDetails.desAR,

            image :data[0][index].productDetails.image,
        },
        priceInfo : {
            priceLabel : data[0][index].priceInfo.priceLabelAR,
          
            taxDesEN : data[0][index].priceInfo.taxDesAR,
            
            price : data[0][index].priceInfo.priceAR,
         
            currency : data[0][index].priceInfo.currency
        },
        sell : {
            total : data[0][index].sell.total,
            sold : data[0][index].sell.sold,
        }

    })
}

return array;
}


//Cuurency Convertor

exports.currencyConvert=(currency,value)=>{

fx.base = "INR";
fx.rates = {
    "USD" : 75.64, // eg. 1 USD === 0.745101 EUR
    // "GBP" : 0.647710, // etc...
    // "HKD" : 7.781919,
    // "USD" : 1,        // always include the base rate (1:1)
    /* etc */
}

var a =fx.convert(value, {from: "INR", to: currency});

console.log(a)
return a;
}

//Campaign Data English

exports.campaignEnglish=(results)=>
{

var data =[];
for(i=0;i<results[1].length;i++)
{

    data.push({

        isActive: results[1][i].isActive,
            _id: results[1][i]._id,
            product_id: {
                prizeDetails: {
                    label: results[1][i].product_id.prizeDetails.labelEN,
                    title: results[1][i].product_id.prizeDetails.titleEN,
                    des: results[1][i].product_id.prizeDetails.descEN
                    
                },
                productDetails: {
                    title:  results[1][i].product_id.productDetails.titleEN,
                    
                    des:  results[1][i].product_id.productDetails.desEN,
                 
                    image:  results[1][i].product_id.productDetails.image,
                },
                priceInfo: {
                    priceLabel:  results[1][i].product_id.priceInfo.priceLabelEN,

                    taxDes:  results[1][i].product_id.priceInfo.taxDesEN,
                 
                    price:  results[1][i].product_id.priceInfo.priceEN,
                   
                    currency:  results[1][i].product_id.priceInfo.currency,
                },
                sell: {
                    total:  results[1][i].product_id.sell.total,
                    sold: results[1][i].product_id.sold
                },
                _id:  results[1][i].product_id._id
            },
            label:results[1][i].labelEN,
            image: results[1][i].image,
            

    })
}

return data;
}

//Camapaign Data Arabic

exports.campaignArabic=(results)=>
{

var data =[];
for(i=0;i<results[1].length;i++)
{

    data.push({

        isActive: results[1][i].isActive,
            _id: results[1][i]._id,
            product_id: {
                prizeDetails: {
                    label: results[1][i].product_id.prizeDetails.labelAR,
                    title: results[1][i].product_id.prizeDetails.titleAR,
                    des: results[1][i].product_id.prizeDetails.descAR
                    
                },
                productDetails: {
                    title:  results[1][i].product_id.productDetails.titleAR,
                    
                    des:  results[1][i].product_id.productDetails.desAR,
                 
                    image:  results[1][i].product_id.productDetails.image,
                },
                priceInfo: {
                    priceLabel:  results[1][i].product_id.priceInfo.priceLabelAR,

                    taxDes:  results[1][i].product_id.priceInfo.taxDesAR,
                 
                    price:  results[1][i].product_id.priceInfo.priceAR,
                   
                    currency:  results[1][i].product_id.priceInfo.currency,
                },
                sell: {
                    total:  results[1][i].product_id.sell.total,
                    sold: results[1][i].product_id.sold
                },
                _id:  results[1][i].product_id._id
            },
            label:results[1][i].labelAR,
            image: results[1][i].image,
            

    })
}

return data;
}


//Image filter

exports.languageFilter=(language,currency,results,wishList,cartData)=>
{
  
            let key = '';
for (var i = 0; i < results.length; i++) {
    languageGun(language.toUpperCase(), currency, results[i], wishList, cartData)
    for (var j = 0; j < results[i].objectProcessor.length; j++) {
      languageGun(language.toUpperCase(), currency, results[i][results[i].objectProcessor[j]], wishList, cartData)
    }
}
console.log('check',results);
return results
}

function languageGun(language, currency, argument, wishList, cartData) {
if (argument.keys){
        for (var j = 0; j < argument.keys.length; j++) {
        key =  argument.keys[j];
        argument[key] = argument[argument.keys[j]+language]
    }
    for (var m = 0; m < argument.removeKeys.length; m++) {
        key =  argument.removeKeys[m];
        delete argument[argument.removeKeys[m]]
    }
        delete argument.keys
        delete argument.removeKeys
        argument["isFav"] = wishList.includes(argument._id.toString());
        argument["cartInfo"] = cartData.filter(cartObject => cartObject.campaignsId === argument._id.toString());        
return argument
}else{
    return argument    
}
}



exports.currencyKit=(language, currency, results)=>
{
    return {"INR":7500,"AED":100}
}

//Signature

var createHash = function(string){
    var hash = crypto.createHash('sha256').update(string, 'utf8').digest('hex');
    return hash;
};

exports.create_signature = (passphrase, object)=>{
        var signatureText = "";
        var keys = [];
        for (var eachKey in object) {
          keys.push(eachKey);
        }
        keys.sort(compare);
        
        var len = keys.length;
    
        for (var i = 0; i < len; i++){
          var k = keys[i];
          signatureText = signatureText+(k + '=' + object[k]);
        }
        var signature = createHash(passphrase+signatureText+passphrase);
        console.log(signature);
        return signature;
    };
    
    function compare(a, b){
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    }




