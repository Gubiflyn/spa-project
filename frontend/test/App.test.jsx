import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";

/**
 * Tests del componente App.jsx
 *
 * Instalación de dependencias necesarias:
 *   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
 *
 * En vite.config.js agregar:
 *   test: { environment: "jsdom", globals: true, setupFiles: "./test/setup.js" }
 *
 * Crear archivo test/setup.js con:
 *   import "@testing-library/jest-dom";
 */

// Datos de ejemplo que simula la respuesta del backend
const planesMock = [
  { id: 1, nombre: "Relajación Total",    descripcion: "Masajes y aromaterapia",     precio: 49990 },
  { id: 2, nombre: "Hidratación Profunda", descripcion: "Tratamiento facial completo", precio: 35000 },
];

describe("App – componente principal", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------
  // Muestra spinner mientras carga
  // ---------------------------------------------------------------
  it("muestra 'Cargando planes...' mientras espera la respuesta", () => {
    // fetch nunca resuelve durante esta prueba
    vi.stubGlobal("fetch", () => new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Cargando planes...")).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Renderiza los planes correctamente
  // ---------------------------------------------------------------
  it("muestra los planes cuando el fetch es exitoso", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(planesMock),
      })
    );

    render(<App />);

    // Espera a que desaparezca el loading
    await waitFor(() =>
      expect(screen.queryByText("Cargando planes...")).not.toBeInTheDocument()
    );

    expect(screen.getByText("Relajación Total")).toBeInTheDocument();
    expect(screen.getByText("Masajes y aromaterapia")).toBeInTheDocument();
    expect(screen.getByText("49990")).toBeInTheDocument();

    expect(screen.getByText("Hidratación Profunda")).toBeInTheDocument();
    expect(screen.getByText("Tratamiento facial completo")).toBeInTheDocument();
    expect(screen.getByText("35000")).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Muestra mensaje de error cuando fetch falla (respuesta no-ok)
  // ---------------------------------------------------------------
  it("muestra mensaje de error cuando el servidor responde con error", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({ ok: false })
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Error al obtener planes/i)).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Muestra mensaje de error cuando fetch lanza excepción (red caída)
  // ---------------------------------------------------------------
  it("muestra mensaje de error cuando la red falla", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.reject(new Error("Network error"))
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    );
  });

  // ---------------------------------------------------------------
  // El título principal siempre está presente
  // ---------------------------------------------------------------
  it("siempre muestra el título 'SPA relax'", () => {
    vi.stubGlobal("fetch", () => new Promise(() => {}));

    render(<App />);

    expect(screen.getByRole("heading", { name: /SPA relax/i })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Lista vacía — no muestra ítems pero tampoco error
  // ---------------------------------------------------------------
  it("no muestra ítems cuando el backend retorna lista vacía", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.queryByText("Cargando planes...")).not.toBeInTheDocument()
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
  });
});
