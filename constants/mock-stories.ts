// Mock story data used before the backend is connected.

export interface StoryPage {
  id: string;
  pageNumber: number;
  text: string;
  image?: string;
}

export interface StorySummary {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  accentColor: string;
}

export interface StoryDetail extends StorySummary {
  totalPages: number;
  pages: StoryPage[];
}

export const MOCK_STORIES: StoryDetail[] = [
  {
    id: 'emma-forest-friends',
    title: "Emma's Forest Friends",
    description: 'Emma meets kind forest friends and learns about healthy food.',
    coverImage:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#E8792F',
    totalPages: 3,
    pages: [
      {
        id: 'emma-page-1',
        pageNumber: 1,
        text:
          'Once upon a time, Emma put on her bright red boots and stepped into the soft green forest. She smiled at the tall trees and listened to the birds singing above her.',
        image:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'emma-page-2',
        pageNumber: 2,
        text:
          'Soon, Emma met a cheerful rabbit nibbling crunchy carrots. The rabbit told Emma that colorful vegetables help heroes grow strong and brave every day.',
        image:
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'emma-page-3',
        pageNumber: 3,
        text:
          'Emma shared an apple with her new friends and learned that healthy foods can give every child energy for adventures, games, and big happy dreams.',
        image:
          'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'broccoli-shield',
    title: "Broccoli's Green Shield",
    description: 'Broccoli teaches how healthy bites protect growing heroes.',
    coverImage:
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2F9E44',
    totalPages: 2,
    pages: [
      {
        id: 'broccoli-page-1',
        pageNumber: 1,
        text:
          'Broccoli Hero stood tall in the kitchen kingdom. With a shiny green shield, he protected children by reminding them to eat foods that help their bodies grow.',
        image:
          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'broccoli-page-2',
        pageNumber: 2,
        text:
          'When lunch arrived, Broccoli Hero showed everyone that even small bites can build strong bones, bright minds, and powerful playtime energy.',
        image:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];

export const STORY_SUMMARIES: StorySummary[] = MOCK_STORIES.map(
  ({ id, title, description, coverImage, accentColor }) => ({
    id,
    title,
    description,
    coverImage,
    accentColor,
  })
);

export function getStoryById(storyId: string) {
  return MOCK_STORIES.find((story) => story.id === storyId);
}
