"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const RentController_1 = __importDefault(require("../controllers/RentController"));
const routes = (0, express_1.Router)();
routes.post("/signup", UserController_1.default.createUser);
routes.post("/signin", UserController_1.default.validUser);
routes.post("/rentcreate", RentController_1.default.createRent);
routes.patch("/rentedit/:id", RentController_1.default.editRent);
routes.delete("/rentdelete/:id", RentController_1.default.deleteRent);
routes.get("/rentall", RentController_1.default.getAllRent);
routes.get("/myrent/:id", RentController_1.default.myRent);
exports.default = routes;
