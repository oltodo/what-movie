import path from "path";
import { type Plugin } from "vite";
import { readFileSync } from "node:fs";

export const importMoviesPlugin = (): Plugin => {
  let mode = "development";

  return {
    name: "import-movies",
    enforce: "pre",
    config(_, { command }) {
      if (command === "build") {
        mode = "production";
      }
    },
    resolveId(id) {
      if (id.includes("data.movies")) {
        return path.resolve(__dirname, `./src/assets/data.movies`);
      }
      return null;
    },
    load(id) {
      if (!id.endsWith("/data.movies")) {
        return null;
      }

      // console.log(this.environment.name);
      const content = readFileSync(`${id}.${mode}`, "utf-8");

      if (content.startsWith("export default")) {
        return null;
      }

      const data = content
        .trim()
        .split("\n")
        .map((line, index) => {
          const match = line.match(/^(.+?)\s*\((\d+)\)$/);

          if (!match) {
            throw new Error(
              `Invalid format in ${id} at line ${index + 1}: "${line}"`
            );
          }

          const [, name, year] = match;

          return {
            name,
            number: index + 1,
            year: Number(year),
          };
        });

      return {
        code: `export default ${JSON.stringify(data)};`,
        map: null,
      };
    },
  };
};
