var fs = require('fs');
var mkdirp = require('mkdirp');
var service = {};
var path = require('path');


service.save = handleImageUpload;
service.get = getImage;
const route = `./uploads/images/`;

module.exports = service;

function getImage(imageName){
    const images = new Map();
    fs.readdirSync(route).forEach(file => {
        // TODO: this fail if event name has a dot on it self
        images.set(file.split('.')[0], file);
      })
    return path.resolve(`./uploads/images/${images.get(imageName)}`)
}


function handleImageUpload(image, eventObj){

    return new Promise((resolve, rejected) =>{
        makeDirectory(route)
        .catch(rejected)
        .then(() => {
            return saveImage(image, eventObj, route);
        })
        .catch(rejected)
        .then(resolve);
        
    });

}

function saveImage(image, eventObj, route) {
    return new Promise((resolve, rejected) => {
        image.mv(`${route}${eventObj.event_name}.${image.name.split(".")[1]}`, function (err) {
            if (err){
                rejected(err);
            }
    
            resolve(image.name)
        });
    });
}

function makeDirectory(path) {
    return new Promise((resolve, rejected) => {
        mkdirp(path, function(err) { 
            if(err){
                rejected(err)
            }
            resolve();        
        });
    });
}