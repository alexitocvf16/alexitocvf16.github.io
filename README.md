# Portfolio de Alejandro Sánchez Moreno
### Administración de Sistemas · Ciberseguridad · IA

Sitio web estático (HTML + CSS + JavaScript, sin dependencias) con estética de consola de operaciones en tonos azules. Reúne proyectos de administración de sistemas y redes, máquinas vulnerables resueltas, certificaciones oficiales (eJPTv2, Cisco CCST Cybersecurity, SC-900, Azure AI Fundamentals, IT Specialist) y formación ASIR.

---

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Todo el contenido: textos, proyectos, máquinas, certificaciones, contacto |
| `styles.css` | Diseño: colores (variables al principio del archivo), tipografía y versión móvil |
| `main.js` | Interacción: red animada del inicio, filtros de proyectos, terminal, menú móvil |
| `profile.jpg` · `Curriculum.pdf` | Foto y currículum enlazados desde la página |
| `images/` | Captura de MiAulaTech para la sección Web e IA |
| `.htaccess` | Caché y cabeceras si se publica en Hostinger / Apache (GitHub Pages lo ignora) |
| `backup/index-anterior.html` | Copia de la versión anterior del portfolio |

## Cómo editar

- **Añadir un proyecto:** copia un bloque `<article class="card project" ...>` en `index.html` y cambia título, descripción, etiquetas y enlace. El atributo `data-cat` (`sistemas`, `redes` o `virtualizacion`) decide en qué filtro aparece; actualiza también el número del botón de filtro.
- **Añadir una máquina resuelta:** copia una fila `<a class="ops__row" ...>` en la sección *Hacking ético*.
- **Cambiar colores:** variables `--blue`, `--cyan`, `--bg`… al principio de `styles.css`.
- **Comandos de la terminal:** objeto `commands` dentro de `main.js`.
- Tras cambiar CSS o JS, sube el número `?v=` en las dos líneas del `<head>` de `index.html` para que los navegadores no usen la versión en caché.

## Despliegue en GitHub Pages

```bash
git add .
git commit -m "Rediseño del portfolio"
git push origin main
```

Con **Settings > Pages** apuntando a la rama `main` y raíz `/`, queda publicado en `https://alexitocvf16.github.io/`.
