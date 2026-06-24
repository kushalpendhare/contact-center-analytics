import time
from sqlalchemy import create_engine, text
from minio import Minio

print("Analytics Service Started", flush=True)

DATABASE_URL = "postgresql://ccadmin:ccpassword@postgres:5432/ccanalytics"

engine = create_engine(DATABASE_URL)

minio_client = Minio(
    "minio:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)

while True:
    call_id = None
    try:
        
        with engine.connect() as conn:

            print("Analytics Service Polling...")

            result = conn.execute(
                text("""
                    SELECT id, filename
                    FROM calls
                    WHERE status='UPLOADED'
                    LIMIT 1
                """)
            )

            row = result.fetchone()

            print(f"Found row: {row}")

            if row:

                call_id = row[0]
                filename = row[1]

                conn.execute(
                    text("""
                        UPDATE calls
                        SET status='PROCESSING'
                        WHERE id=:id
                    """),
                    {"id": call_id}
                )

                conn.commit()

                print(f"Processing Call {call_id}")

                response = minio_client.get_object(
                    "call-recordings",
                    filename
                )

                audio_bytes = response.read()

                transcript = f"""
                Customer called regarding billing issue.
                Recording Size: {len(audio_bytes)} bytes.
                Issue resolved by agent.
                """

                sentiment = "POSITIVE"

                summary = """
                Customer contacted support regarding billing.
                Agent resolved the issue successfully.
                Customer sentiment remained positive.
                """
                
                conn.execute(
                    text("""
                        INSERT INTO transcripts (
                            call_id,
                            transcript,
                            sentiment,
                            summary
                        )
                        VALUES (
                            :call_id,
                            :transcript,
                            :sentiment,
                            :summary
                        )
                    """),
                    {
                        "call_id": call_id,
                        "transcript": transcript,
                        "sentiment": sentiment,
                        "summary": summary
                    }
                )

                conn.execute(
                    text("""
                        UPDATE calls
                        SET status='COMPLETED'
                        WHERE id=:id
                    """),
                    {"id": call_id}
                )

                conn.commit()

                print(f"Completed Call {call_id}")
    except Exception as e:
        print(f"ERROR: {e}", flush=True)
        if call_id is not None:
            try:
                with engine.connect() as conn:
                     conn.execute(
                          text("""
                               UPDATE calls
                               SET status='FAILED'
                                WHERE id=:id
                            """),
                            {"id": call_id}
                    )
                     conn.commit()
            except Exception as inner_e:
                print(f"ERROR while updating status to FAILED: {inner_e}")

    time.sleep(5)