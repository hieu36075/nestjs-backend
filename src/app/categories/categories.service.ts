import {  Injectable, Body, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Category, Hotel } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCategoryDTO } from "./dto/create.category.dto";
import { UpdateCategoryDTO } from "./dto/update.category.dto";

@Injectable()
export class CategoriesService{
    constructor(
        private prismaService: PrismaService,
        ){
    }


    async getAll():Promise<Category[]>{
        return await this.prismaService.category.findMany();
    }

    async createCategory(@Body() createCategoryDTO : CreateCategoryDTO):Promise<Category>{
        return await this.prismaService.category.create({
            data: {
                ...createCategoryDTO
            }
        })
    }

    async updateCategory(categoryID: string, @Body() updateCategoryDTO : UpdateCategoryDTO): Promise<Category | null>{
        const category = await this.prismaService.category.findUnique({
            where:{
                id: categoryID
            }
        })

        if(!category){
            throw new ForbiddenException('Cannot find Post in Database')
        }
        return await this.prismaService.category.update({
            where:{
                id: categoryID
            },data:{
                ...updateCategoryDTO
            }
        })
    }

    async getHotelByCategory(categoryId: string): Promise<Hotel[]>{
        const hotel = await this.prismaService.category.findMany({
            where:{
                id: categoryId
            },
            select:{
                hotels:true,
            }
        })
        if (!hotel || hotel.length === 0) {
            throw new NotFoundException('Cannot find country with the provided ID');
        }
        return hotel[0].hotels
    }

    async deleteCategory(categoryId: string): Promise<void>{
        await this.prismaService.category.delete({
            where:{
                id: categoryId
            }
        })
    }
}