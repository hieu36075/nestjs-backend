// socket-action.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { SocketConnection } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service'; // Thay thế đường dẫn thật
@Injectable()
export class SocketActionService {
  constructor(private prismaService: PrismaService) {}


  async saveSocketId(userId: string, socketId: string): Promise<SocketConnection> {
    const existingRecord = await this.prismaService.socketConnection.findFirst({
      where: {
        OR: [
          { userId: userId },
          { socketId: socketId }
        ]
      },
    });
    if (existingRecord) {
      // Nếu record đã tồn tại với một trong hai giá trị, thực hiện cập nhật
      const updatedRecord = await this.prismaService.socketConnection.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          userId: existingRecord.userId !== userId ? userId : existingRecord.userId,
          socketId: existingRecord.socketId !== socketId ? socketId : existingRecord.socketId,
        },
      });
  
      return updatedRecord;
    } else {
      // Nếu record không tồn tại, thực hiện tạo mới
      const newRecord = await this.prismaService.socketConnection.create({
        data: {
          userId: userId,
          socketId: socketId,
        },
      });
  
      return newRecord;
    }
  }
  
  
  async deleteSocketId(socketId: string): Promise<any> {
    try {
      const existingRecord = await this.prismaService.socketConnection.findFirst({
        where: {
          socketId: socketId,
        },
      });
  
      if (!existingRecord) {
        // Nếu không tìm thấy bản ghi với socketId cần xóa, không làm gì cả hoặc throw lỗi tùy theo tình huống
        return null; // hoặc throw new Error('Socket connection not found.');
      }
  
      // Thực hiện xóa bản ghi nếu tìm thấy
      const deletedRecord = await this.prismaService.socketConnection.delete({
        where: {
          id: existingRecord.id,
        },
      });
  
      return deletedRecord;
    } catch (error) {
      throw new Error(`An error occurred while deleting socket connection: ${error.message}`);
    }
  }

  async getUserByClient(socketId: string): Promise<SocketConnection["userId"]>{
    try {
      const SocketConnection =await this.prismaService.socketConnection.findUnique({
        where:{
          socketId: socketId,
        },
      })

      if(!SocketConnection){
        throw new NotFoundException("Please Check Data Again")
      };
      
      return SocketConnection.userId
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getClientByUser(userId: string): Promise<SocketConnection["socketId"]>{
    try {
      const SocketConnection =await this.prismaService.socketConnection.findUnique({
        where:{
          userId: userId,
        },
      })

      if(!SocketConnection){
        throw new NotFoundException("Please Check Data Again")
      };
      console.log(SocketConnection)
      console.log(SocketConnection.socketId)
      return SocketConnection.socketId
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createNotification(userId: string, data: any) {
    const notification = await this.prismaService.notification.create({
      data: {
        data: data,
        userId: userId,
      },
    });

    return notification;
  }

  // ... các phần khác của dịch vụ ...
}
