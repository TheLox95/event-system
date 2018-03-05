var fs = require('fs');
var mkdirp = require('mkdirp');
var service = {};
var path = require('path');


service.save = handleImageUpload;
service.get = getImage;
service.delete = deleteImage;
const route = `./uploads/images/`;

module.exports = service;

function getImage(eventId){
    const images = _getImageMap();
    return path.resolve(`./uploads/images/${images.get(eventId)}`)
}

function deleteImage(eventId) {
    return new Promise((resolve, rejected) => {
        const images = _getImageMap();

        fs.unlink(`${route}${images.get(eventId)}`, (err) => {
            if (err) rejected(err);
            resolve(`${route}${images.get(eventId)}`);
          });
    });
}

function _getImageMap(){
    const images = new Map();
    const files = fs.readdirSync(route);
    for (const file of files) {
        images.set(file.split('.')[0], file);
    }
    return images;
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
        image.mv(`${route}${eventObj._id}.${image.name.split(".")[1]}`, function (err) {
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