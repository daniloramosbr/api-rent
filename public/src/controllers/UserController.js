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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class UserController {
    createUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = request.body;
                if (!name || !email || !password) {
                    return response.status(500).json({ erro: "insira todos os dados" }); //verircia se tem todos os dados
                }
                const user = yield prisma.user.findUnique({
                    where: {
                        email
                    },
                });
                if (user != null) {
                    return response.status(500).json({ erro: "email já cadastrado" }); //retorna erro
                }
                const passCrypt = yield bcrypt_1.default.hash(password, 10); //senha criptografada
                const newUser = yield prisma.user.create({
                    data: {
                        name,
                        email,
                        password: passCrypt,
                    },
                });
                const token = jsonwebtoken_1.default.sign({ id: newUser.id, name: name }, "190526", {
                    //cria token com id e name
                    expiresIn: "24h",
                });
                response.status(201).json({
                    message: 'usuário criado com sucesso!',
                    token: token
                });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
    validUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const user = yield prisma.user.findUnique({ where: { email } }); //busca email
                if (!user) {
                    return response.status(404).json({ erro: "Usuário não encontrado" });
                }
                const hash = yield prisma.user.findUnique({
                    where: { email: email },
                    select: { password: true },
                });
                if (hash == null) {
                    return response.status(404).send({
                        message: "usuário ou senha incorretos", //se nao existir
                    });
                }
                const validPassword = yield bcrypt_1.default.compare(password, hash.password); //verifica se a senha eh igual
                if (!validPassword) {
                    return response.status(401).json({ erro: "Senha inválida" });
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, "190526", {
                    expiresIn: "24h",
                });
                response.json({
                    message: 'validação concluída com sucesso!',
                    token: token
                });
            }
            catch (error) {
                response.status(500).send(error);
            }
        });
    }
}
exports.default = new UserController();
