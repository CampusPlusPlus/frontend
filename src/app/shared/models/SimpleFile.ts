export type SimpleFile = {
  id: number,
  name: string,
  size: number,
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
