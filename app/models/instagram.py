from pydantic import BaseModel, Field
from datetime import datetime

class InstagramStoryData(BaseModel):
    url: str
    media_type: str
    parsed_at: datetime = Field(default_factory=datetime.utcnow)
    scraped_at: datetime
    likes_count: int
    comments_count: int
    downloaded_image_bytes: bytes | None = None