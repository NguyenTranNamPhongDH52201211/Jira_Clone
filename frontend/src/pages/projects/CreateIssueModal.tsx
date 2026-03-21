import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueApi } from '@/api/issueApi';


interface Props {
    open: boolean;
    onClose: () => void;
    projectId: number;
}

export default function CreateIssueModal({ open, onClose, projectId }: Props) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'task' | 'bug' | 'story'>('task');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => issueApi.createIssues(projectId, {name, type, priority }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
            onClose();
        }
    })

    return (

        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Issue</DialogTitle>
                </DialogHeader>

                {/* Name */}
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Issue name"
                        className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'task' | 'bug' | 'story')}
                        className="w-full border rounded-md px-3 py-2 mt-1"
                    >
                        <option value="task">Task</option>
                        <option value="bug">Bug</option>
                        <option value="story">Story</option>
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full border rounded-md px-3 py-2 mt-1"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <Button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Creating...' : 'Create Issue'}
                </Button>
            </DialogContent>
        </Dialog>
    );

}