export type FullFile = {
  id: number,
  originalName: string,
  size: number,
  tags: [],
  upvotes: [],
  downvotes: [],
  rating: number,
  author: string,
  lectureId: number,
  _links: {
    self: {
      href: string
    },
    download: {
      href: string
    }
  }
};
