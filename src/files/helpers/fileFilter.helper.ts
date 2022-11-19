


//esto es solamente para aceptar o rechazar un archivo, no lanzara una excecpcion por el lado de nest
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback:Function)=>{

    if(!file)return callback(new Error('Archivo vacio'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg','jpeg','png','gif'];

    if(validExtension.includes(fileExtension)){
        return callback(null, true)
    }
    callback(null, false);

}