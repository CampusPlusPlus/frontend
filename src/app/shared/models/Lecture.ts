export type Lecture = {
      id: number,
      name: string,
      relativeSemester: number,
      curriculumId: number,
      links: [
        rel: string,
        href: string
      ]
};
