"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RentController {
    createRent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, userId, img, title, price, city } = request.body;
                if (!userId || !img || !title || !price || !city) {
                    return response.status(500).json({ erro: "insira todos os dados" }); //verircia se tem todos os dados
                }
                const newRent = yield prisma.rent.create({
                    data: {
                        userId,
                        name,
                        img,
                        title,
                        price,
                        city,
                    },
                });
                response.status(201).json({ message: 'criado com sucesso!', data: newRent });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
    editRent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = request.params.id;
                const idNumber = parseInt(id, 10);
                const { img, title, price, city } = request.body;
                const newEdit = yield prisma.rent.update({
                    where: {
                        id: idNumber
                    },
                    data: {
                        img,
                        title,
                        price,
                        city
                    },
                });
                response.status(200).json({ message: 'editado com sucesso!', data: newEdit });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
    deleteRent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = request.params.id;
                const idNumber = parseInt(id, 10);
                yield prisma.rent.delete({
                    where: {
                        id: idNumber
                    },
                });
                response.status(200).json({ message: 'excluído com sucesso!' });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
    getAllRent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rents = yield prisma.rent.findMany();
                response.status(200).json({ data: rents });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
    myRent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.params.id;
                const myRents = yield prisma.rent.findMany({
                    where: {
                        userId
                    },
                });
                response.status(200).json({ data: myRents });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
}
exports.default = new RentController();
