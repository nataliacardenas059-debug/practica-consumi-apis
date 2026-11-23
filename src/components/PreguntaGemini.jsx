import { useEffect, useState } from "react"

import { GoogleGenAI } from "@google/genai"


function PreguntaGemini({ seleccionado }) {
  const [pregunta, setPregunta] = useState("Explícame esta noticia en palabras sencillas")
  const [respuesta, setRespuesta] = useState("")
  const [consultando, setConsultando] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setRespuesta("")
    setError("")
  }, [seleccionado?.id])

  async function preguntar(evento) {
    evento.preventDefault()

    if (!seleccionado) {
      setError("Elige una noticia antes de preguntar.")
      return
    }

    const llave = import.meta.env.VITE_GEMINI_API_KEY
    if (!llave) {
      setError("Falta la llave en el archivo .env. Agrégala y reinicia npm run dev.")
      return
    }

    const prompt = [
      "Responde en español, en un párrafo corto y claro.",
      `Título: ${seleccionado.title}`,
      `Resumen: ${seleccionado.summary}`,
      `Pregunta: ${pregunta}`,
    ].join("\n")

    try {
      setConsultando(true)
      setError("")
      setRespuesta("")

      const ai = new GoogleGenAI({ apiKey: llave })
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: prompt,
      })

      const texto = interaction.output_text
      if (!texto) {
        console.log(interaction)
        throw new Error("Gemini respondió sin texto. Revisa la consola del navegador.")
      }
      setRespuesta(texto)
    } catch (err) {
      setError(err.message || "No se pudo consultar a Gemini.")
    } finally {
      setConsultando(false)
    }
  }

  return (
    <aside className="panel">
      <h2>Pregunta a Gemini</h2>

      {error && <p className="aviso">{error}</p>}

      {seleccionado ? (
        <>
          <h3>{seleccionado.title}</h3>
          <p>{seleccionado.summary}</p>
          <a href={seleccionado.url} target="_blank" rel="noreferrer">
            Leer la noticia completa
          </a>
        </>
      ) : (
        <p>Selecciona un artículo de la lista.</p>
      )}

      <form onSubmit={preguntar}>
        <label htmlFor="pregunta">Tu pregunta</label>
        <textarea
          id="pregunta"
          value={pregunta}
          onChange={(evento) => setPregunta(evento.target.value)}
          rows={3}
        />
        <button type="submit" disabled={consultando || !seleccionado}>
          {consultando ? "Consultando..." : "Preguntar"}
        </button>
      </form>

      {respuesta && (
        <div className="respuesta">
          <h3>Respuesta</h3>
          <p>{respuesta}</p>
        </div>
      )}
    </aside>
  )
}

export default PreguntaGemini
