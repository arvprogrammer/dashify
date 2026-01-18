'use client';

import { PaginationMeta } from '@/shared/types/pagination';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Pagination({ page, meta }: { page: number; meta: PaginationMeta | undefined; }) {

    const router = useRouter();
    const goToPage = (p: number) => {
        router.push(`?page=${p}`);
    };

    if (!meta) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-2 mt-6">
            <Button
                variant="outline"
                size={'sm'}
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
            >
                Previous
            </Button>

            <span className="text-sm self-center">
                Page {meta.page} of {meta.totalPages}
            </span>

            <span className="text-sm self-center">
                Total items {meta.total}
            </span>

            <Button
                variant="outline"
                size={'sm'}
                disabled={page >= meta.totalPages}
                onClick={() => goToPage(page + 1)}
            >
                Next
            </Button>
        </div>
    );
}
