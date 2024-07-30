import { Router } from "express";
import UserController from "../controllers/UserController";
import RentController from "../controllers/RentController";

const routes = Router()

routes.post("/signup", UserController.createUser)
routes.post("/signin", UserController.validUser)
routes.post("/rentcreate", RentController.createRent)
routes.patch("/rentedit/:id", RentController.editRent)
routes.delete("/rentdelete/:id", RentController.deleteRent)
routes.get("/rentall", RentController.getAllRent)
routes.get("/myrent/:id", RentController.myRent)

export default routes