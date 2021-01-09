export type SimpleFile = {
  id: number,
  name: string,
  size: number,
  rating: number,
  author: string,
  authorId: string,
  lectureId: number,
  links: [
    {
      rel: string,
      href: string
    }
  ]
};
