#!/usr/bin/env python3
"""Extrae el texto legible de una respuesta de get_design_context guardada en disco.

Cuando get_design_context devuelve demasiado, la herramienta guarda un JSON
`[{type, text}]` en tool-results/. Este script saca los párrafos (<p>) en orden,
sin tener que cargar 70k caracteres de JSX en el contexto.

Uso:  python3 -I figma_text.py <fichero.json> [--grep REGEX] [--json]
"""
import argparse, json, re, sys

def paragraphs(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    text = "\n".join(d.get("text", "") for d in data if isinstance(d, dict))
    out = []
    for m in re.finditer(r"<p\b[^>]*>\s*(.*?)\s*</p>", text, re.S):
        s = re.sub(r"\s+", " ", m.group(1)).strip()
        # los textos con llaves vienen como {`...`}
        s = re.sub(r"^\{`(.*)`\}$", r"\1", s)
        if s and s != "​":
            out.append(s)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--grep", help="solo párrafos que casen con esta regex (sin distinguir mayúsculas)")
    ap.add_argument("--json", action="store_true", help="salida JSON en vez de líneas numeradas")
    a = ap.parse_args()
    ps = paragraphs(a.file)
    if a.grep:
        rx = re.compile(a.grep, re.I)
        ps = [p for p in ps if rx.search(p)]
    if a.json:
        json.dump(ps, sys.stdout, ensure_ascii=False, indent=2)
    else:
        for i, p in enumerate(ps):
            print(f"{i}\t{p}")

if __name__ == "__main__":
    main()
