import axios from "axios"
// import Select from "react-select"
import "./App.css"
import { useEffect, useState } from "react"

interface currInterface {
  title: String
  overview: String
  poster_path: String
}
function App() {
  const [currMovie, setCurrMovie] = useState("Batman")
  const [currMovieInd, setCurrMovieInd] = useState(1362)
  const [currMovieDetails, setCurrMovieDetails] = useState<currInterface>()
  const [movies, setMovies] = useState<any[]>([])
  const [recommend, setRecommend] = useState<any[]>([])
  const [recommededMovies, setRecommendedMovies] = useState<any[]>([])

  const getMovies = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/movie-names`)
    const data = await res.data
    setMovies(data.nums)
  }

  const getRecommendedMovie = async (r: Number) => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${r}?api_key=476e57a45b8ccdc2c82053407e163fc4`
    )

    const data = await res.data
    setRecommendedMovies((prev) => {
      if (prev) return [...prev, data]
      return data
    })
  }

  const getCurrMovieInd = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/movieind/${currMovie}`)

    const data = await res.data

    setCurrMovieInd(data.ind)
  }

  useEffect(() => {
    getCurrMovieInd()
  }, [currMovie])

  useEffect(() => {
    if (recommend.length != 0) {
      recommend.map((r) => {
        getRecommendedMovie(r)
      })
    }
  }, [recommend])

  const recommeded = async () => {
    setRecommendedMovies([])
    const res = await axios.get(`http://127.0.0.1:5000/recommend/${currMovie}`)
    const data = await res.data
    setRecommend(data)
  }

  const getCurrMovieDetails = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${currMovieInd}?api_key=476e57a45b8ccdc2c82053407e163fc4`
      )
      const data = await res.data
      setCurrMovieDetails(data)
    } catch (error) {
      setCurrMovieDetails(undefined)
    }
  }

  useEffect(() => {
    getCurrMovieDetails()
    recommeded()
  }, [currMovieInd])

  useEffect(() => {
    getMovies()
    getCurrMovieDetails()
    getCurrMovieInd()
  }, [])

  return (
    <div className=" flex flex-col justify-center items-center bg-black">
      <div className="text-6xl text-white">Movies</div>
      <select
        onChange={(e) => {
          setCurrMovie(e.target.value)
          // setCurrMovieInd()
        }}
        className="w-[40vw] mt-2"
      >
        {movies &&
          movies?.map((m, index) => {
            return (
              <option value={m[0]} key={index}>
                {m[0]}
              </option>
            )
          })}
      </select>
      {currMovieDetails && (
        <div className="grid grid-cols-3  text-white justify-center sm:mx-20 mx-5 mt-5 sm:h-[70vh]">
          <div className="col-span-2 flex flex-col gap-5 justify-center overflow-hidden">
            <h1 className="z-10 sm:text-4xl text-2xl">
              {currMovieDetails?.title}
            </h1>
            <p className="z-10 sm:text-lg text-sm">
              {currMovieDetails?.overview}
            </p>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/w185${currMovieDetails.poster_path}`}
            width={100}
            height={100}
            className=" sm:h-[70vh] col-span-1 sm:w-full w-[20vw] sm:object-contain object-scale-down"
          ></img>
        </div>
      )}
      {/* <button onClick={recommeded}>Recommend</button> */}
      <div className="grid md:grid-cols-4 grid-cols-2  gap-2 w-[90%] mt-[5vh]">
        {recommededMovies &&
          recommededMovies?.map((m) => {
            return (
              <div
                key={m?.backdrop_path}
                className="col-span-1  relative hover:shadow-lg cursor-pointer"
                onClick={() => setCurrMovie(m.title)}
              >
                <h4 className="absolute sm:text-2xl tex-sm text-white bottom-0">
                  {m.title}
                </h4>
                <img
                  height={100}
                  width={50}
                  className="w-full"
                  src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                ></img>
              </div>
            )
          })}
      </div>
      {/* <Select options={options} /> */}
    </div>
  )
}

export default App
