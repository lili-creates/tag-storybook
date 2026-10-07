#!/usr/bin/env python3
"""Convierte las variables de Figma (get_variable_defs) en un tokens.css con modo claro y oscuro.

Entrada: uno o más JSON {nombre: valor} tal y como los devuelve get_variable_defs.
  --light a.json [b.json ...]   variables del modo claro (se fusionan)
  --dark  c.json [d.json ...]   variables del modo oscuro; solo se emiten las que DIFIEREN del claro
  --rename FROM=TO              renombra un token (repetible). Necesario porque get_variable_defs
                                devuelve nombres locales ambiguos ("default", "on-subtle"):
                                mapéalos a los nombres completos que cita la documentación del Figma.
  --prefix                      prefijo opcional para todas las variables (p. ej. "ds")

Normaliza: "Label/s/fontSize" -> --label-s-font-size, "space-md" -> --space-md.
Convierte unidades (números sin unidad de espaciado/tipografía -> px; excepto weight y lineHeight 0)
y colores #rrggbbaa -> rgba(). Ignora los estilos compuestos "Font(...)".

Uso:  python3 -I tokens_to_css.py --light l1.json l2.json --dark d1.json --rename default=semantic-background-signal-info-subtle-default > tokens.css
"""
import argparse, json, re, sys

def kebab(name: str) -> str:
    s = name.strip().replace("/", "-").replace(" ", "-").replace("_", "-")
    s = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", s)  # fontSize -> font-Size
    return re.sub(r"-+", "-", s).lower()

def color(v: str) -> str:
    m = re.fullmatch(r"#([0-9a-fA-F]{8})", v)
    if not m:
        return v
    h = m.group(1)
    r, g, b, a = (int(h[i:i + 2], 16) for i in (0, 2, 4, 6))
    return f"rgba({r}, {g}, {b}, {round(a / 255, 3):g})"

def value(name: str, v):
    if isinstance(v, (int, float)):
        v = str(v)
    v = str(v)
    if v.startswith("Font("):
        return None
    if re.fullmatch(r"-?\d+(\.\d+)?", v):
        low = name.lower()
        if "weight" in low or "opacity" in low:
            return v
        if "letterspacing" in low.replace("-", "") and v == "0":
            return "0px"
        return f"{v}px"
    return color(v)

def load(paths):
    merged = {}
    for p in paths or []:
        with open(p, encoding="utf-8") as f:
            merged.update(json.load(f))
    return merged

def build(d, renames, prefix):
    out = {}
    for k, v in d.items():
        val = value(k, v)
        if val is None:
            continue
        name = renames.get(k) or renames.get(kebab(k)) or kebab(k)
        out[("--" + prefix + "-" if prefix else "--") + name.lstrip("-")] = val
    return out

def block(selector, tokens):
    lines = [f"{selector} {{"] + [f"  {k}: {v};" for k, v in sorted(tokens.items())] + ["}"]
    return "\n".join(lines)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--light", nargs="+", required=True)
    ap.add_argument("--dark", nargs="*")
    ap.add_argument("--rename", action="append", default=[])
    ap.add_argument("--prefix", default="")
    a = ap.parse_args()
    renames = dict(r.split("=", 1) for r in a.rename)
    light = build(load(a.light), renames, a.prefix)
    dark = build(load(a.dark), renames, a.prefix) if a.dark else {}
    dark = {k: v for k, v in dark.items() if light.get(k) != v}
    parts = ["/* Generado desde Figma (get_variable_defs). Revisa los nombres antes de commitear. */",
             block(":root", light)]
    if dark:
        parts.append(block(":root[data-theme='dark']", dark))
    print("\n\n".join(parts))

if __name__ == "__main__":
    main()
