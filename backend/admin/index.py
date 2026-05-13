import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def resp(status, body):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    """Управление сотрудниками, КП и договорами. Роутинг через ?resource=employees|proposals|contracts&id=N"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    resource = qs.get("resource", "")
    item_id = qs.get("id", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── СОТРУДНИКИ ──────────────────────────────────────────────
    if resource == "employees":
        if method == "GET":
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id, name, email, role, status, created_at FROM employees ORDER BY id")
                    rows = cur.fetchall()
            return resp(200, list(rows))

        if method == "POST":
            name = body.get("name", "").strip()
            email = body.get("email", "").strip()
            role = body.get("role", "Менеджер").strip()
            if not name or not email:
                return resp(400, {"error": "name и email обязательны"})
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "INSERT INTO employees (name, email, role) VALUES (%s, %s, %s) RETURNING id, name, email, role, status, created_at",
                        (name, email, role)
                    )
                    row = cur.fetchone()
                conn.commit()
            return resp(201, dict(row))

        if method == "PUT" and item_id:
            status = body.get("status")
            role = body.get("role")
            name = body.get("name")
            email = body.get("email")
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "UPDATE employees SET name=COALESCE(%s,name), email=COALESCE(%s,email), role=COALESCE(%s,role), status=COALESCE(%s,status) WHERE id=%s RETURNING id, name, email, role, status",
                        (name, email, role, status, item_id)
                    )
                    row = cur.fetchone()
                conn.commit()
            return resp(200, dict(row) if row else {"error": "not found"})

        if method == "DELETE" and item_id:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM employees WHERE id=%s", (item_id,))
                conn.commit()
            return resp(200, {"ok": True})

    # ── КОММЕРЧЕСКИЕ ПРЕДЛОЖЕНИЯ ─────────────────────────────────
    if resource == "proposals":
        if method == "GET":
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id, client, service, amount, status, author, comment, created_at FROM proposals ORDER BY id DESC")
                    rows = cur.fetchall()
            return resp(200, list(rows))

        if method == "POST":
            client = body.get("client", "").strip()
            service = body.get("service", "").strip()
            amount = body.get("amount", "").strip()
            author = body.get("author", "").strip()
            comment = body.get("comment", "").strip()
            if not client or not service or not amount or not author:
                return resp(400, {"error": "client, service, amount, author обязательны"})
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "INSERT INTO proposals (client, service, amount, author, comment) VALUES (%s,%s,%s,%s,%s) RETURNING id, client, service, amount, status, author, comment, created_at",
                        (client, service, amount, author, comment)
                    )
                    row = cur.fetchone()
                conn.commit()
            return resp(201, dict(row))

        if method == "PUT" and item_id:
            status = body.get("status")
            client = body.get("client")
            service = body.get("service")
            amount = body.get("amount")
            comment = body.get("comment")
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "UPDATE proposals SET status=COALESCE(%s,status), client=COALESCE(%s,client), service=COALESCE(%s,service), amount=COALESCE(%s,amount), comment=COALESCE(%s,comment) WHERE id=%s RETURNING id, client, service, amount, status, author, comment, created_at",
                        (status, client, service, amount, comment, item_id)
                    )
                    row = cur.fetchone()
                conn.commit()
            return resp(200, dict(row) if row else {"error": "not found"})

        if method == "DELETE" and item_id:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM proposals WHERE id=%s", (item_id,))
                conn.commit()
            return resp(200, {"ok": True})

    # ── ДОГОВОРЫ ─────────────────────────────────────────────────
    if resource == "contracts":
        if method == "GET":
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id, number, client, service, amount, signed_at, expires_at, created_at FROM contracts ORDER BY id DESC")
                    rows = cur.fetchall()
            return resp(200, list(rows))

        if method == "POST":
            number = body.get("number", "").strip()
            client = body.get("client", "").strip()
            service = body.get("service", "").strip()
            amount = body.get("amount", "").strip()
            signed_at = body.get("signed_at", "").strip()
            expires_at = body.get("expires_at", "").strip()
            if not all([number, client, service, amount, signed_at, expires_at]):
                return resp(400, {"error": "Все поля обязательны"})
            with get_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "INSERT INTO contracts (number, client, service, amount, signed_at, expires_at) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id, number, client, service, amount, signed_at, expires_at, created_at",
                        (number, client, service, amount, signed_at, expires_at)
                    )
                    row = cur.fetchone()
                conn.commit()
            return resp(201, dict(row))

        if method == "DELETE" and item_id:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM contracts WHERE id=%s", (item_id,))
                conn.commit()
            return resp(200, {"ok": True})

    return resp(400, {"error": "Укажите resource: employees, proposals или contracts"})
