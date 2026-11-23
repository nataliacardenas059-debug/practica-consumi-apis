import { useEffect, useState } from "react"

import axios from "axios"

const URL_ARTICULOS = "https://api.spaceflightnewsapi.net/v4/articles/?limit=6"

function ListaNoticias({ seleccionado, onSeleccionar }) {
  const [articulos, setArticulos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    cargarArticulos()
  }, [])

  async function cargarArticulos() {
    try {
      setCargando(true)
      setError("")
      const respuesta = await axios.get(URL_ARTICULOS)
      setArticulos(respuesta.data.results)
    } catch (err) {
      setError("No hubo conexión con el API de noticias. Revisa tu internet.")
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section>
      <h2>Artículos</h2>

      {error && <p className="aviso">{error}</p>}

      {cargando && <p>Cargando noticias...</p>}

      <ul className="lista">
        {articulos.map((articulo) => (
          <li key={articulo.id}>
            <button
              type="button"
              className={seleccionado?.id === articulo.id ? "tarjeta activa" : "tarjeta"}
              onClick={() => onSeleccionar(articulo)}
            >
              {articulo.image_url && <img src={articulo.image_url} alt="" />}
              <span className="medio">{articulo.news_site}</span>
              <strong>{articulo.title}</strong>
              <span className="fecha">{formatearFecha(articulo.published_at)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default ListaNoticias
