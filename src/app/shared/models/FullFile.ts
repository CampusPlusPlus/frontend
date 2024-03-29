import { Tag } from './Tag';
import { Comment } from './Comment';

export type FullFile = {
  id: number,
  name: string,
  size: number,
  tags: Tag[],
  upvotes: any[],
  downvotes: any[],
  comments: Comment[],
  rating: number,
  authorName: string,
  authorId: string,
  lectureId: number,
  links: [
    {
      rel: string,
      href: string
    }
  ]
};
