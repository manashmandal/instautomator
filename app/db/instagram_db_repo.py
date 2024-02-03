from dataclasses import dataclass
from app.models.instagram import InstagramStoryData
from typing import Any

@dataclass
class InstagramDbRepo:
    db: Any

    def save(self, data: InstagramStoryData) -> InstagramStoryData:
        # ... saving logic ...
        saved_data = self.db.save(data.model_dump())
        return InstagramStoryData.model_validate(saved_data)