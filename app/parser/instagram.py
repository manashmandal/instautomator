from dataclasses import dataclass
from app.models.instagram import InstagramStoryData
from datetime import datetime

@dataclass
class InstagramPostParser:
    def parse(self, html_content: str) -> InstagramStoryData:
        # ... parsing logic ...
        return InstagramStoryData(
            url="https://www.instagram.com/p/1234567890/",
            media_type="image",
            scraped_at=datetime.utcnow(),
            likes_count=123,
            comments_count=45,
        )