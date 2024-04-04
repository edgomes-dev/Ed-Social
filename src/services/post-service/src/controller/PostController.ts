import { Request, Response } from "express";
import Post, { IPost } from "../model/post";

export class PostController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { text, img, coments, likes } = req.body;

            const post = await Post.create({
                text,
                img,
                coments,
                likes
            });
    
            res.status(201).json(post);
        } catch(err) {
            console.error(err);
            res.status(500).json({ message: 'Bad request' });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const posts: IPost[] =  await Post.find();
    
            res.status(200).json(posts);
        } catch(err) {
            console.error(`Erro ao buscar os posts: ${err}`);
            res.status(500).json({ message: 'Bad request' })
        }
    }
    
    async getById(req: Request, res: Response): Promise<void> {
        try {
            let id: string  = req.params.id;
    
            const post = await Post.findById(id);
    
            res.status(200).json(post);
        } catch(err) {
            res.status(404).json({ message: 'Post not found' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const postId: string = req.params.id;
            const { text, img, coments, likes } = req.body;
            const updatedPost = await Post.findByIdAndUpdate(postId, {
                text,
                img,
                coments,
                likes
            }, { new: true });
    
            if (!updatedPost) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
    
            res.status(200).json(updatedPost);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Bad request' });
        }
    }
}
