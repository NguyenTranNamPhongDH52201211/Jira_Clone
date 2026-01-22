import { ProjectService } from "../services/projectServices";
import { Response, Request } from "express";
import { CreatedProjectRequest, UpdateProjectRequest } from "../types";

export class ProjectController {
    static async createProject(req: Request, res: Response) {
        try {

            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const data = req.body as CreatedProjectRequest;

            const project = await ProjectService.createProject(userId, data);
            res.status(201).json({
                message: 'Project created successfully',
                project,
            });

        } catch (error) {
            console.error('Create project error:', error);
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getUserProjects(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const projects = await ProjectService.getUserProjects(userId);

            res.json({ projects })

        } catch (error) {
            console.error('Get user projects error:', error);
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async getProjectById(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }
            const project = await ProjectService.getProjectById(projectId, userId);

            res.json({ project });

        } catch (error) {
            console.error('Get project by ID error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async updateProject(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const data = req.body as UpdateProjectRequest;
            const project = await ProjectService.updateProject(projectId, userId, data);

            res.json({
                message: 'Project updated successfully',
                project
            });

        } catch (error) {
            console.error('Update project error:', error);

            if (error instanceof Error) {
                if (error.message === 'Only project admins can update project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async deleteProject(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }
            await ProjectService.deleteProject(projectId, userId);
            res.json({ message: 'Project deleted successfully' });

        } catch (error) {
            console.error('Delete project error:', error);

            if (error instanceof Error) {
                if (error.message === 'Only project admins can delete project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async addMember(req: Request, res: Response) {
        try {
            const currentUserId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);

            if (!currentUserId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const { userId: targetUserId, role='member' } = req.body;

            if (!targetUserId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const member = await ProjectService.addMember(projectId, currentUserId, targetUserId, role || 'member');
            res.status(201).json({
                message: 'Member added successfully',
                member
            });

        } catch (error) {
            console.error('Add member error:', error);

            if (error instanceof Error) {
                if (error.message === 'Only project admins can add members') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found' || error.message === 'User not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async removeMember(req: Request, res: Response) {
        try {
            const currentUserId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);
            const targetUserId = parseInt(req.params.userId as string);
            if (!currentUserId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId) || isNaN(targetUserId)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }
            await ProjectService.removeMember(projectId, currentUserId, targetUserId);

            res.json({ message: 'Member removed successfully' });

        } catch (error) {
            console.error('Remove member error:', error);

            if (error instanceof Error) {
                if (error.message === 'Only project admins can remove members') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Cannot remove project creator') {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === 'Project not found' || error.message === 'User is not a member of this project') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async getProjectMembers(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.id as string);
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const members = await ProjectService.getProjectMembers(projectId, userId);
            res.json({ members });

        } catch (error) {
            console.error('Get project members error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }
}