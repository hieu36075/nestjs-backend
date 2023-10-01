import { Body, ForbiddenException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CategoryRoom } from '@prisma/client';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateCategoryRoomDTO } from './dto/create.categoryRoom.dto';

@Injectable()
export class CategoryRoomSerive {
  constructor(private prismaService: PrismaService) {}
  async getAll(page:number, perPage: number): Promise<PaginationResult<CategoryRoom>> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.categoryRoom.findMany(
      {
        skip,
        take,
      }
    );

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }

  // async getCategoryRoomByHotel(hotelId: string): Promise<CategoryRoom[]>{
  //   const categoryRoom = await this.prismaService.categoryRoom.findMany({
  //     where:{
  //       hotelId: hotelId
  //     },
  //     include:{
  //       rooms: true
  //     }
  //   })
  //   return categoryRoom;
  // }
  async getByHotelId(id: string, page: number, perPage:number): Promise<PaginationResult<CategoryRoom>>{
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const hotel = await this.prismaService.hotel.findUnique({
      where:{
        id: id
      }
    })
    if(!hotel){
      throw new ForbiddenException('please check again')
    }
    const data = await this.prismaService.categoryRoom.findMany(
      {
        where:{
          hotelId: hotel.id
        },include:{
          rooms: {
            include:{
              imageRoom: true
            }
          }
        },
        skip,
        take,
      }
    );

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }
  async createCategoryRoom(createCategoryRoomDTO: CreateCategoryRoomDTO): Promise<CategoryRoom >{
      return await this.prismaService.categoryRoom.create({
        data:{
          ...createCategoryRoomDTO
        }
      })
  }
  
  async getCategoryRoomById(id: string) : Promise<CategoryRoom>{
    const room =  await this.prismaService.categoryRoom.findUnique({
      where:{
        id:id,
      }
    })
    if(!room){
      throw new NotFoundException('please check again')
    }
    return room
  }


}
