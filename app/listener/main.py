from app.parser.instagram import InstagramPostParser
from app.db.instagram_db_repo import InstagramDbRepo
import amqp

queue_consumer = "instagram_stories"

def main() -> None:
    ig_parser = InstagramPostParser()
    instagram_db_repo = InstagramDbRepo(db='mongodb://localhost:27017/instagram')

    with amqp.Connection('broker.example.com') as c:
        ch = c.channel()
        def on_message(message):
            print('Received message (delivery tag: {}): {}'.format(message.delivery_tag, message.body))
            parsed_data = ig_parser.parse(message.body)
            instagram_db_repo.save(parsed_data)

            ch.basic_ack(message.delivery_tag)
        ch.basic_consume(queue=queue_consumer, callback=on_message)
        while True:
            c.drain_events()

