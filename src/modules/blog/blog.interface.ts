import { Types } from 'mongoose';

export type TBlog ={
  title:string;
  shortDescription:string;
  longDescription:string;
  imageTitle:string;
  images:string[];
  tags:string[];
  category:string;
  author:Types.ObjectId;
  createdAt:Date;
  updatedAt:Date;
}
