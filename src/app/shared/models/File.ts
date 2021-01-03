export type File = {
      id: number,
      originalName: string,
      size: number,
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
