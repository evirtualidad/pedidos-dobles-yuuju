
"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SortableItem(props: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className={cn(
                "flex items-center bg-card p-3 border-b last:border-b-0",
                isDragging && "shadow-lg bg-muted"
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                className="cursor-grab h-8 w-8 mr-2"
                {...listeners}
                {...attributes}
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
            {props.children}
        </div>
    );
}
