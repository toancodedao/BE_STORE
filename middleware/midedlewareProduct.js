const petStore = require('../models/petStore_models')
const productStore = require('../models/productStore_models')
const serviceStore = require('../models/serviceStore_models')

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const os = require('os');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const handleProduct = {
    handleForm: async (req, res, next) => {

        try {
            const tempVirtualDir = path.join(os.tmpdir(), 'temp');
            const upload = multer({
                storage: multer.diskStorage({
                    destination: tempVirtualDir,
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            });

            upload.single('image')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).send('Something went wrong with the file upload');
                } else if (err) {
                    return res.status(400).send('Something went wrong with the file upload');
                } else {

                    if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.cert(serviceAccount),
                            storageBucket: 'gs://fir-b0fdf.appspot.com', // tên bucket của bạn
                        });
                    }

                    const bucket = admin.storage().bucket();

                    const filePath = req.file.path
                    const uuid = uuidv4();
                    const file = bucket.file(`images/${uuid}.jpg`);

                    fs.createReadStream(filePath)
                        .pipe(file.createWriteStream({
                            metadata: {
                                contenType: 'image/jpeg',
                            },
                        }))
                        .on('error', (err) => {
                            console.log(err);
                        })
                        .on('finish', async () => {
                            const dowloadUrl = await upImgae(file)
                            req.dowloadUrl = dowloadUrl
                            next()
                        })
                }
            });
        } catch (err) {
            return res.status(500).send('Something went wrong with the file upload');
        }

        const upImgae = (file) => {
            const config = {
                action: 'read',
                expires: '03-17-2024'
            };

            return new Promise((resolve, rejects) => {
                file.getSignedUrl(config)
                    .then(url => {
                        const url2 = url[0]
                        resolve(url2)
                        req.haha = url2
                    })
                    .catch(err => {
                        rejects(err)
                    })
            })
        }
    }
}

module.exports = handleProduct