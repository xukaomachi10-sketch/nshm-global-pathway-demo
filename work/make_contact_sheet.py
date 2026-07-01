from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


source_dir = Path("work/render_source")
files = sorted(source_dir.glob("source-*.png"))
cell_width, cell_height = 420, 544

for sheet_index, start in enumerate(range(0, len(files), 6), 1):
    canvas = Image.new("RGB", (cell_width * 3, cell_height * 2), "white")
    for position, path in enumerate(files[start : start + 6]):
        image = Image.open(path).convert("RGB")
        thumb = ImageOps.contain(image, (cell_width, cell_height))
        x = (position % 3) * cell_width
        y = (position // 3) * cell_height
        canvas.paste(thumb, (x, y))
        ImageDraw.Draw(canvas).text(
            (x + 8, y + 8),
            f"P{start + position + 1}",
            fill="red",
            stroke_width=1,
            stroke_fill="white",
        )
    canvas.save(source_dir / f"contact-{sheet_index}.png")
