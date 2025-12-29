import data from "@/assets/data.movies";

import { useLocalStorage } from "@uidotdev/usehooks";
import titleImage from "@/assets/title.svg";

import { Movie } from "./components/movie";

export function App() {
  const [found, save] = useLocalStorage<number[]>("movies", []);

  return (
    <>
      <div className="flex items-center p-8 py-4 sticky top-0 backdrop-blur-lg justify-center z-10">
        <img
          src={titleImage}
          alt="Quel est ce film ?"
          className="h-6 md:h-8 lg:h-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 gap-x-8 p-8">
        {data.map((movie) => (
          <Movie
            movie={movie}
            found={found.includes(movie.number)}
            key={movie.number}
            onSuccess={(number) => {
              save([...found, number]);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
