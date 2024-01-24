import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    // if it doesn't exist, throw an error
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return bookmark;
  }

  createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    return this.prismaService.bookmark.create({
      data: {
        ...createBookmarkDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    editBookmarkDto: EditBookmarkDto,
  ) {
    // get the bookmark by id and userId
    // if it doesn't exist, throw an error
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    // if it doesn't exist, throw an error
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    // update the bookmark
    return this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...editBookmarkDto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // find the bookmark by id and userId
    const bookmark = await this.getBookmarkById(userId, bookmarkId);

    // if it doesn't exist, throw an error
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    // delete the bookmark
    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
