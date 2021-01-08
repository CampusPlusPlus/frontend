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
  author: string,
  lectureId: number,
  links: [
    {
      rel: string,
      href: string
    }
  ]
};
