import { IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateCommentDto {
    @IsString()
    body:string

    @IsNumber()
    authorId:number 

    @IsString()
    authorAddress:string 

    @IsNumber()
    articleId:number 

    @IsBoolean()
    active:boolean 
}

export class UpdateCommentDto {
    @IsString()
    body:string

    @IsString()
    authorAddress:string 
}