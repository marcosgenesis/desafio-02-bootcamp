import Router from 'express';

import multer from "multer"
import multerConfig from "./config/multer"

import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import FileController from "./app/controllers/FileController"
import MeetupsController from "./app/controllers/MeetupsController"
import SubscriptionController from "./app/controllers/SubscriptionController"


import authMiddleware from "./app/middleware/auth"

const routes = new Router();
//Cria um multer com as configs do multer para configurar o uploads dos arquivos
const upload = multer(multerConfig);

routes.post('/users',UserController.store)
routes.post('/sessions',SessionController.store)

routes.use(authMiddleware)

routes.put("/users",UserController.update)
//Esta requisição vai pegar o uploads de apenas um arquivo se fossem mais arquivos
//seria filess
routes.post("/files",upload.single('file'),FileController.store)
routes.post('/meetups',MeetupsController.store)
routes.get('/meetups',MeetupsController.index)
routes.get('/subscriptions',SubscriptionController.index)
routes.put('/meetups/:id',MeetupsController.update)
routes.delete('/meetups/:id',MeetupsController.delete)
routes.post('/meetups/:meetupId/subscription',SubscriptionController.store)
export default routes;
