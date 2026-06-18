import time
from sqlalchemy import create_engine, text

print("Analytics Service Started", flush=True)

DATABASE_URL = "postgresql://ccadmin:ccpassword@postgres:5432/ccanalytics"

engine = create_engine(DATABASE_URL)

while True:
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT id FROM calls WHERE status='UPLOADED' LIMIT 1")
            )

            print("Analytics Service Polling...")

            row = result.fetchone()

            print(f"Found row: {row}")

            if row:
                call_id = row[0]

                conn.execute(
                    text(
                        "UPDATE calls SET status='PROCESSING' WHERE id=:id"
                    ),
                    {"id": call_id}
                )

                conn.commit()

                print(f"Processing Call {call_id}")

                time.sleep(5)

                conn.execute(
                    text(
                        "UPDATE calls SET status='COMPLETED' WHERE id=:id"
                    ),
                    {"id": call_id}
                )

                conn.commit()

                print(f"Completed Call {call_id}")

    except Exception as e:
        print(e)

    time.sleep(10)