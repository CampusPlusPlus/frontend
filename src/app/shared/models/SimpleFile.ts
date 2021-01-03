export type SimpleFile = {
      id: number,
      name: string,
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
