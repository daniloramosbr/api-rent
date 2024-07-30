import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken"
const prisma = new PrismaClient();

class UserController {

   async createUser (request: Request, response: Response) {

    try {
        const { name, email, password } = request.body;
  
        if (!name || !email || !password) {
          return response.status(500).json({ erro: "insira todos os dados" });          //verircia se tem todos os dados
        }
   
        const user = await prisma.user.findUnique({  //busca no banco o email
          where: {
            email
          },
        })
         
        if (user != null) {
          return response.status(500).json({ erro: "email já cadastrado" });         //retorna erro
        }
  
        const passCrypt = await bcrypt.hash(password, 10);   //senha criptografada
           
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: passCrypt,
          },
        });
        
        const token = Jwt.sign({ id: newUser.id, name:name }, "190526", {
          //cria token com id e name
          expiresIn: "24h",
        });
  
        response.status(201).json({
            message: 'usuário criado com sucesso!',
            token: token
        })
      } catch (error) {
        response.status(500).send(error)
      }
    }

    async validUser (request: Request, response: Response) {

        try {
            const { email, password } = request.body;
      
            const user = await prisma.user.findUnique({ where: { email } });          //busca email
      
            if (!user) {
              return response.status(404).json({ erro: "Usuário não encontrado" });
            }
      
            const hash = await prisma.user.findUnique({         //busca password
              where: { email: email },
              select: { password: true },
            });
      
            if (hash == null) {
              return response.status(404).send({
                message: "usuário ou senha incorretos",         //se nao existir
              });
            }
      
            const validPassword = await bcrypt.compare(password, hash.password!); //verifica se a senha eh igual
      
            if (!validPassword) {
              return response.status(401).json({ erro: "Senha inválida" });
            }
      
            const token = Jwt.sign({ id: user.id, name: user.name }, "190526", {
              expiresIn: "24h",
            });
      
            response.json({
                message: 'validação concluída com sucesso!',
                token: token
            });
          } catch (error) {
            response.status(500).send(error);
          }
    }

}
export default new UserController();