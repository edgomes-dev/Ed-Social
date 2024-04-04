import { Request, Response } from "express";
import { PostController } from "./PostController";
import Post from "../model/post";
import { validateUser } from "../utils/validations/validateUser";

jest.mock('../model/post');

describe('PostController', () => {
    let postController: PostController;

    beforeEach(() => {
        postController = new PostController();
    });

    describe('create', () => {
        it('should create a post', async () => {
            const req = {
                body: {
                    text: 'Testando a para um programador',
                    img: 'test.png',
                    coments: false,
                    likes: true
                }
            } as unknown as Request;

            const mockPost = {
                _id: '660bf1a1c1bb5e6ed9f251f0',
                ...req.body
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response            

            (Post as jest.Mocked<typeof Post>).create.mockResolvedValue(mockPost);

            await postController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });

        it('should handle error when req.body.text is invalid', async () => {
            const req = {
                body: {
                    text: 'test',
                    img: 'test.png',
                    coments: false,
                    likes: true
                }
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response            

            const next = jest.fn();

            validateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request data' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('getAll', () => {
        it('should get all posts', async () => {
            const mockPosts = [
                {
                    _id: '660bf1a1c1bb5e6ed9f251f0',
                    text: 'Testando a funcionalidade do sistema',
                    img: 'test1.png',
                    coments: true,
                    likes: true
                },
                {
                    _id: '880bf1a1c1bb5e6ed9f241e0',
                    text: 'Testando a funcionalidade do sistema',
                    img: 'test2.png',
                    coments: true,
                    likes: true
                }
            ];

            (Post as jest.Mocked<typeof Post>).find.mockResolvedValue(mockPosts);

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await postController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPosts)
        })
    });

    describe('getById', () => {
        it('should get post by id', async () => {
            const mockPost = {
                _id: '660bf1a1c1bb5e6ed9f251f0',
                text: 'Testando a para um programador',
                img: 'test.png',
                coments: false,
                likes: true
            };

            (Post as jest.Mocked<typeof Post>).findById.mockResolvedValue(mockPost);
            
            const req = {
                params: {
                _id: '660bf1a1c1bb5e6ed9f251f0',
                }
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
    
            await postController.getById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });
    
        it('should handle error when post not found', async () => {
            (Post as jest.Mocked<typeof Post>).findById.mockRejectedValue('1');
            
            const req = {
                params: {
                    id: '1'
                }
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
    
            await postController.getById(req, res);
    
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const postId = '660bf1a1c1bb5e6ed9f251f0';
    
            const req = {
                params: { id: postId },
                body: {
                    text: 'Novo texto do post',
                    img: 'nova-imagem.png',
                    coments: true,
                    likes: false
                }
            } as unknown as Request;
    
            const updatedPost = {
                _id: postId,
                text: 'Novo texto do post',
                img: 'nova-imagem.png',
                coments: true,
                likes: false
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
    
            (Post as jest.Mocked<typeof Post>).findByIdAndUpdate.mockResolvedValue(updatedPost);
    
            await postController.update(req, res);
                
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedPost);
        });
    
        it('should handle error when post is not found', async () => {
            const postId = 'invalid-id';
    
            const req = {
                params: { id: postId },
                body: {
                    text: 'Novo texto do post',
                    img: 'nova-imagem.png',
                    coments: true,
                    likes: false
                }
            } as unknown as Request;
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;
    
            (Post as jest.Mocked<typeof Post>).findByIdAndUpdate.mockResolvedValue(null);
    
            await postController.update(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });
    
        it('should handle error when invalid data is provided', async () => {
            const req = {
                params: { id: '660bf1a1c1bb5e6ed9f251f0' }, 
                body: {
                    // Dados inválidos (nenhum campo fornecido)
                }
            } as unknown as Request;
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn();
    
            validateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request data' });
        });
    });    
})