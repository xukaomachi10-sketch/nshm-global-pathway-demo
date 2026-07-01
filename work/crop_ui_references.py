from pathlib import Path

from PIL import Image, ImageChops


source_dir = Path("work/ui_pages")
output_dir = Path("work/ui_crops")
output_dir.mkdir(parents=True, exist_ok=True)

screens = {
    4: "UI-01_worklist",
    6: "UI-02_registration",
    8: "UI-03_student_360",
    10: "UI-04_evidence",
    12: "UI-05_application_pipeline",
    14: "UI-07_documents_essays",
    16: "PW-01_public_website",
    18: "PW-02_cms",
}

for page_number, screen_name in screens.items():
    image = Image.open(source_dir / f"page-{page_number:02d}.png").convert("RGB")
    top = 194 if page_number == 10 else 126
    crop = image.crop((112, top, 1120, 706))
    background = Image.new("RGB", crop.size, "white")
    diff = ImageChops.difference(crop, background)
    bbox = diff.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        crop = crop.crop((max(0, left - 8), max(0, top - 8), min(crop.width, right + 8), min(crop.height, bottom + 8)))
    if page_number == 16 and crop.width > 20 and crop.height > 20:
        crop = crop.crop((8, 8, crop.width - 8, crop.height - 8))
    crop.save(output_dir / f"{screen_name}.png", optimize=True)
