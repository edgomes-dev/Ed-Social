import { Router } from "express";
import {PostController} from "./controller/PostController"

import { validateUser } from "./utils/validations/validateUser";

export const router = Router();
const controller = new PostController();

router.post('/posts', validateUser, controller.create);
router.get('/posts', controller.getAll);
router.get('/posts/:id', controller.getById);
router.put('/posts/:id', validateUser, controller.update);
