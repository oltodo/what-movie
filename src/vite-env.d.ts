interface Movie {
  titles: string[];
  number: number;
  year: number;
}

declare module "*.movies" {
  const data: Movie[];

  export default data;
}
