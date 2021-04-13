export type Curricula = {
  id: number,
  name: string,
  studyCourseId: number,
  links: [
    {
      rel: string,
      href: string,
    }
  ]
};
