import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class RentController {

async createRent (request: Request, response: Response) {

    try {

        const {userId, img, title, price, city} = request.body

        if (!userId || !img || !title || !price || !city) {
          return response.status(500).json({ erro: "insira todos os dados" });          //verircia se tem todos os dados
        }

        const newRent = await prisma.rent.create({
            data: {
              userId,
              img,
              title,
              price,
              city,
            },
          });

          response.status(201).json({message: 'criado com sucesso!', data: newRent});
        
    } catch (error) {
      response.status(500).send(error)
    }
}

async editRent (request: Request, response: Response) {

  try {

    const id = request.params.id 
    const idNumber = parseInt(id, 10)

    const { img, title, price, city } = request.body

    const newEdit = await prisma.rent.update({
      where: {
        id: idNumber
      },
      data: {
        img,
        title,
        price,
        city
      },
    })

    response.status(200).json({ message: 'editado com sucesso!', data: newEdit});
    
  } catch (error) {
    response.status(500).send(error)
  }
}

async deleteRent (request: Request, response: Response) {

  try {

    const id = request.params.id 
    const idNumber = parseInt(id, 10)

    await prisma.rent.delete({
      where: {
        id: idNumber
      },
    })

    response.status(200).json({ message: 'excluído com sucesso!'});
    
  } catch (error) {
    response.status(500).send(error)
  }
}

  async getAllRent (request: Request, response: Response) {

    try {

      const rents = await prisma.rent.findMany();
      
      response.status(200).json({ data: rents});
      
    } catch (error) {
      response.status(500).send(error)
    }
  }

  async myRent (request: Request, response: Response) {
    try {
      
      const userId = request.params.id
      
      const myRents = await prisma.rent.findMany({
        where: {
          userId
        },
      });
      
      response.status(200).json({ data: myRents});
      
    } catch (error) {
      response.status(500).send(error)
    }
  }

}

export default new RentController();