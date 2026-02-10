import type { ThumbnailElement } from '../types/thumbnail';

export interface Template {
    id: string;
    name: string;
    preview: string; // CSS color or image URL
    elements: ThumbnailElement[];
    background?: string;
}

export const TEMPLATES: Template[] = [
    {
        id: 'modern-tech',
        name: 'Modern Tech',
        preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        background: '#1a1a2e',
        elements: [
            {
                id: 't1',
                type: 'text',
                x: 50,
                y: 100,
                text: 'BUILD A SAAS',
                fontSize: 80,
                fontFamily: 'Inter',
                fontWeight: '900',
                fill: '#ffffff',
                align: 'left'
            },
            {
                id: 't2',
                type: 'text',
                x: 50,
                y: 200,
                text: 'IN 2 HOURS',
                fontSize: 80,
                fontFamily: 'Inter',
                fontWeight: '900',
                fill: '#4ade80', // Green accent
                align: 'left'
            },
            {
                id: 's1',
                type: 'rect',
                x: 800,
                y: 0,
                width: 480,
                height: 720,
                fill: '#ffffff',
                opacity: 0.1,
                cornerRadius: 0
            }
        ]
    },
    {
        id: 'gaming-neon',
        name: 'Gaming Neon',
        preview: 'linear-gradient(45deg, #000000 0%, #220033 100%)',
        background: '#050505',
        elements: [
            {
                id: 's1',
                type: 'rect',
                x: 0,
                y: 0,
                width: 1280,
                height: 720,
                fill: '#000000',
                opacity: 1
            },
            {
                id: 'c1',
                type: 'circle',
                x: 640,
                y: 360,
                width: 500,
                height: 500,
                fill: 'transparent',
                stroke: '#ec4899', // Pink
                strokeWidth: 4,
                opacity: 0.8
            },
            {
                id: 't1',
                type: 'text',
                x: 640,
                y: 550,
                text: 'IMPOSSIBLE',
                fontSize: 100,
                fontFamily: 'Inter',
                fontWeight: '900',
                fill: '#ffffff',
                align: 'center',
                shadowColor: '#ec4899',
                shadowBlur: 20
            },
            {
                id: 't2',
                type: 'text',
                x: 640,
                y: 650,
                text: 'CHALLENGE',
                fontSize: 60,
                fontFamily: 'Inter',
                fontWeight: 'bold',
                fill: '#ec4899',
                align: 'center'
            }
        ]
    },
    {
        id: 'coding-tutorial',
        name: 'Coding Tutorial',
        preview: '#1e1e1e',
        background: '#1e1e1e',
        elements: [
            {
                id: 's1',
                type: 'rect',
                x: 50,
                y: 50,
                width: 600,
                height: 620,
                fill: '#2d2d2d',
                cornerRadius: 20,
                shadowColor: '#000000',
                shadowBlur: 30,
                shadowOpacity: 0.5
            },
            {
                id: 't1',
                type: 'text',
                x: 700,
                y: 200,
                text: 'React vs Vue',
                fontSize: 70,
                fontFamily: 'Inter',
                fontWeight: 'bold',
                fill: '#ffffff',
                align: 'left'
            },
            {
                id: 't2',
                type: 'text',
                x: 700,
                y: 300,
                text: 'Which one in 2026?',
                fontSize: 40,
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fill: '#a0a0a0',
                align: 'left'
            }
        ]
    },
    {
        id: 'vlog-lifestyle',
        name: 'Vlog Lifestyle',
        preview: 'linear-gradient(to bottom, #dbeafe, #eff6ff)',
        background: '#eff6ff',
        elements: [
            {
                id: 's1',
                type: 'rect',
                x: 100,
                y: 100,
                width: 1080,
                height: 520,
                fill: '#ffffff',
                stroke: '#3b82f6',
                strokeWidth: 2,
                cornerRadius: 0
            },
            {
                id: 't1',
                type: 'text',
                x: 640,
                y: 600,
                text: 'A DAY IN THE LIFE',
                fontSize: 60,
                fontFamily: 'Inter',
                fontWeight: '900',
                fill: '#1e3a8a',
                align: 'center'
            }
        ]
    }
];
