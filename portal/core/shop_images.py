import io
import uuid
import warnings
from pathlib import Path
from PIL import Image, ImageOps, UnidentifiedImageError
from django.conf import settings
from django.core.exceptions import ValidationError


def image_path(storage_name):
    # Names are generated server-side; never resolve a client-supplied path.
    return Path(settings.MEDIA_ROOT) / 'catalogue' / storage_name


def store_image(upload):
    if upload.size > 10 * 1024 * 1024:
        raise ValidationError('La photo dépasse 10 Mo.')
    raw = upload.read(10 * 1024 * 1024 + 1)
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(raw)) as source:
                if source.format not in ('JPEG','PNG','WEBP') or source.width * source.height > 25000000:
                    raise ValidationError('Image non prise en charge ou dimensions trop grandes.')
                source.load()
                clean = ImageOps.exif_transpose(source).convert('RGB')
                clean.thumbnail((1600,1600))
                name = uuid.uuid4().hex + '.webp'
                target = image_path(name)
                target.parent.mkdir(parents=True, exist_ok=True)
                clean.save(target, 'WEBP', quality=86)
                return name
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise ValidationError('Fichier image invalide.')
