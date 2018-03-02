var service = {};

service.save = handleImageUpload;

module.exports = service;

function handleImageUpload(image, eventObj){

    return new Promise((resolve, rejected) =>{
        image.mv(`./public/images/${eventObj.event_name}.${image.name.split(".")[1]}`, function (err) {
            if (err){
                rejected(err);
            }

            resolve(image.name)
        });
    });

}