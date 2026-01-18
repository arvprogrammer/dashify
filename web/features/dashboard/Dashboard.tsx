'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasksStore } from '../task/task.store';
import { useEffect } from 'react';
import { useUserStore } from '../user/user.store';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { meta, fetchTasks, tasks, loading } = useTasksStore();
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        fetchTasks(1);
    }, [fetchTasks]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className='text-center'>Total tasks</CardTitle>
                </CardHeader>
                <CardContent className='text-center'>
                    {meta?.total ?? 0}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='text-center'>Role</CardTitle>
                </CardHeader>
                <CardContent className='text-center'>
                    {user?.role}
                </CardContent>
            </Card>

            <Card className='md:col-span-2'>
                <CardHeader>
                    <CardTitle className='text-center'>Latest tasks</CardTitle>
                </CardHeader>
                {loading ? (<div className='text-center'>Loading tasks...</div>) :
                    (<CardContent>
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                                <div>
                                    <h3 className="font-semibold uppercase">{task.title}</h3>
                                </div>
                                <small>Status: {task.status.toLocaleUpperCase()}</small>
                                <Button variant={'secondary'} onClick={() => router.push('/dashboard/tasks/' + task.id + '/update')}><Edit /> Update</Button>
                            </div>
                        ))}

                        {tasks.length > 0 && (
                            <Link className='mt-4 block text-center text-primary' href="/dashboard/tasks">View all tasks</Link>
                        )}

                        {tasks.length === 0 && (
                            <div className='text-center text-gray-500'>There are no tasks available.</div>
                        )}
                    </CardContent>)}
            </Card>
        </div>
    );
}
